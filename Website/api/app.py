import tensorflow as tf
import json
import platform
import pathlib
import time
import sqlite3
import datetime
import matplotlib.pyplot as plt
import torch
import torch.nn as nn
import numpy as np
import os
import pickle
import random
from args import get_parser
from model import get_model
from torchvision import transforms
from utils.output_utils import prepare_output
from PIL import Image
from sys import platform


## Dataset
def load_dataset(silent=False):
    # List of dataset files we want to merge.
    dataset_file_names = [
        'recipes_raw_nosource_ar.json',
        'recipes_raw_nosource_epi.json',
        'recipes_raw_nosource_fn.json',
    ]

    dataset = []

    for dataset_file_name in dataset_file_names:
        dataset_file_path = f'tmp/datasets/{dataset_file_name}'

        with open(dataset_file_path) as dataset_file:
            json_data_dict = json.load(dataset_file)
            json_data_list = list(json_data_dict.values())
            dict_keys = [key for key in json_data_list[0]]
            dict_keys.sort()
            dataset += json_data_list

            # This code block outputs the summary for each dataset.
            if silent == False:
                print(dataset_file_path)
                print('===========================================')
                print('Number of examples: ', len(json_data_list), '\n')
                print('Example object keys:\n', dict_keys, '\n')
                print('Example object:\n', json_data_list[0], '\n')
                print('Required keys:\n')
                print('  title: ', json_data_list[0]['title'], '\n')
                print('  ingredients: ', json_data_list[0]['ingredients'], '\n')
                print('  instructions: ', json_data_list[0]['instructions'])
                print('\n\n')

    return dataset
dataset_raw = load_dataset(True)


## Dataset Validation and Filtering
def recipe_validate_required_fields(recipe):
    required_keys = ['title', 'ingredients', 'instructions']

    if not recipe:
        return False

    for required_key in required_keys:
        if not recipe[required_key]:
            return False

        if type(recipe[required_key]) == list and len(recipe[required_key]) == 0:
            return False

    return True

dataset_validated = [recipe for recipe in dataset_raw if recipe_validate_required_fields(recipe)]
STOP_WORD_TITLE = '📗 '
STOP_WORD_INGREDIENTS = '\n🥕\n\n'
STOP_WORD_INSTRUCTIONS = '\n📝\n\n'

def recipe_to_string(recipe):
    # This string is presented as a part of recipes so we need to clean it up.
    noize_string = 'ADVERTISEMENT'

    title = recipe['title']
    ingredients = recipe['ingredients']
    instructions = recipe['instructions'].split('\n')

    ingredients_string = ''
    for ingredient in ingredients:
        ingredient = ingredient.replace(noize_string, '')
        if ingredient:
            ingredients_string += f'• {ingredient}\n'    # adding bullets to structure the data

    instructions_string = ''
    for instruction in instructions:
        instruction = instruction.replace(noize_string, '')
        if instruction:
            instructions_string += f'▪︎ {instruction}\n'    # adding bullets to structure the data

    return f'{STOP_WORD_TITLE}{title}\n{STOP_WORD_INGREDIENTS}{ingredients_string}{STOP_WORD_INSTRUCTIONS}{instructions_string}'

dataset_stringified = [recipe_to_string(recipe) for recipe in dataset_validated]
MAX_RECIPE_LENGTH = 2000

def filter_recipes_by_length(recipe_test):
    return len(recipe_test) <= MAX_RECIPE_LENGTH

dataset_filtered = [recipe_text for recipe_text in dataset_stringified if filter_recipes_by_length(recipe_text)]


## Building Model
def build_model(vocab_size, embedding_dim, rnn_units, batch_size):
    model = tf.keras.models.Sequential()

    model.add(tf.keras.layers.Embedding(
        input_dim=vocab_size,
        output_dim=embedding_dim,
        batch_input_shape=[batch_size, None]
    ))

    model.add(tf.keras.layers.LSTM(
        units=rnn_units,
        return_sequences=True,
        stateful=True,
        recurrent_initializer=tf.keras.initializers.GlorotNormal()
    ))

    model.add(tf.keras.layers.Dense(vocab_size))

    return model


## Loading model into the architecture
simplified_batch_size = 1
filepath_of_trained_model = "Model\Model.h5"
VOCABULARY_SIZE = 176
model_simplified = build_model(VOCABULARY_SIZE, 256, 1024, simplified_batch_size)
model_simplified.load_weights(filepath_of_trained_model)
model_simplified.build(tf.TensorShape([simplified_batch_size, None]))
model_simplified.summary()
tokenizer = tf.keras.preprocessing.text.Tokenizer(
    char_level=True,
    filters='',
    lower=False,
    split=''
)

# Stop word is not a part of recipes, but tokenizer must know about it as well.
STOP_SIGN = '␣'

tokenizer.fit_on_texts([STOP_SIGN])
tokenizer.fit_on_texts(dataset_filtered)
tokenizer.get_config()


## Generating Output
def generate_text(model, start_string, num_generate = 1000, temperature=1.0):
    # Evaluation step (generating text using the learned model)

    padded_start_string = STOP_WORD_TITLE + start_string

    # Converting our start string to numbers (vectorizing).
    input_indices = np.array(tokenizer.texts_to_sequences([padded_start_string]))

    # Empty string to store our results.
    text_generated = []

    # Here batch size == 1.
    model.reset_states()
    for char_index in range(num_generate):
        predictions = model(input_indices)
        # remove the batch dimension
        predictions = tf.squeeze(predictions, 0)

        # Using a categorical distribution to predict the character returned by the model.
        predictions = predictions / temperature
        predicted_id = tf.random.categorical(
            predictions,
            num_samples=1
        )[-1, 0].numpy()

        # We pass the predicted character as the next input to the model
        # along with the previous hidden state.
        input_indices = tf.expand_dims([predicted_id], 0)

        next_character = tokenizer.sequences_to_texts(input_indices.numpy())[0]

        text_generated.append(next_character)

    return (padded_start_string + ''.join(text_generated))


## Flask Portion
from flask import Flask, render_template, url_for
from flask import request

app = Flask(__name__)
print("Server Started!!")

image_select = True

def generate_combinations(model, ingredients_list):
    image_urls = ['https://i.ndtvimg.com/i/2017-06/spicy-dishes_620x350_41498029900.jpg',
                'https://cookthestory.com/wp-content/uploads/2019/12/Italian-Chicken-Breast-1392x780-4095.jpg',
                'https://i.pinimg.com/originals/d8/b7/fe/d8b7fef1785f83140567d8d5febf2e56.jpg',
                'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=960,872',
                'https://www.swantour.com/blogs/wp-content/uploads/2019/04/Famous-Food-of-Shimla.jpg',
                'https://i.ndtvimg.com/i/2016-04/bell-pepper-cover_625x350_71460619334.jpg',
                'https://www.archanaskitchen.com/images/archanaskitchen/Indian_Vegetables_Gravy/Kadai_Baby_Corn_Capsicum_Masala_Recipe-6.jpg',
                'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                'https://images2.alphacoders.com/100/1003810.jpg',
                'https://www.itl.cat/pngfile/big/290-2906144_food-wallpaper-hd-restaurants-food-images-hd.jpg',
                'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                'https://thumbs.dreamstime.com/b/indian-food-thali-style-meal-chicken-meat-masala-tea-chai-wooden-table-138439693.jpg']
    recipe_length = 4000
    try_letters = ingredients_list
    try_temperature = [0.2, 0.9]

    print("Inside function")

    ans = dict()
    ans[0] = []

    global image_select

    for letter in try_letters:

        if image_select == True:
            idx = 0
        else:
            idx = 11

        for temperature in try_temperature:
            generated_text = generate_text(
                model,
                start_string=letter,
                num_generate = recipe_length,
                temperature=temperature
            )

            title = ""
            ingredients = ""
            recipe = ""

            i = 0
            while i<len(generated_text) and (generated_text[i])  != "\n":
                title += generated_text[i]
                i += 1
            title.strip()
            # if len(title)<10:
            # print("title Length:" +  str(len(title)))

            while i<len(generated_text) and generated_text[i] != "•":
                i += 1
            if i == len(generated_text):
                continue

            while i+1<len(generated_text) and (generated_text[i] + generated_text[i+1]) != "\n\n":
                ingredients += generated_text[i]
                i += 1
            i += 4
            ingredients.strip()
            # if len(ingredients)<10:
            # print("Ingredients Length:" + str(len(ingredients)))

            while i<len(generated_text) and generated_text[i] != "▪":
                i += 1
            if i == len(generated_text):
                continue

            while i<len(generated_text) and (generated_text[i])!= "␣":
                recipe += generated_text[i]
                i += 1
            recipe.strip()
            # if len(recipe)<10:
            # print("recipe Length:" + str(len(recipe)))

            # Ingredients Duplicate Removal
            oringinal_ingredients = ingredients_list[0].split()
            oringinal_ingredients = [("• " + ingredient + "\n") for ingredient in oringinal_ingredients]
            ingredients = ingredients.split('\n')
            ingredients.extend(oringinal_ingredients)
            ingredients = list(set(ingredients))
            ingredients = '\n'.join([ingredient for ingredient in ingredients])

            # Printing Stuff
            # ans['author'] = title[2:]
            # ans['title'] = ingredients
            # ans['content'] = recipe
            # ans['date_posted'] = 'April 20, 2018'
            # break
            ans[0].append({'author':title[2:], 'title': ingredients,'content': recipe, 'date_posted': image_urls[idx], 'isFavorite':"false", 'classname':"heart"})

            if image_select == True:
                idx += 1
            else:
                idx -= 1


            # print(f'Attempt: "{letter}" + {temperature}')
            # print('-----------------------------------')
            # print()
            # print('\n\n')
            # print(ingredients)
            # print('\n\n')
            # print(recipe)
            # print('\n\n')
            # print(generated_text)
            # print('\n\n')
            #
            # # Breaking whenever we get a single proper output
            # break
    print(ans)
    if image_select:
        image_select = False
    else:
        image_select = True

    return ans

# conn = sqlite3.connect('login.db')
# cursor = conn.cursor()
# sql = "DROP TABLE Users"
# cursor.execute(sql)
#
# conn.execute('CREATE TABLE IF NOT EXISTS Users(Id Int,username Varchar,email Varchar,password Varchar,bio Varchar, image Varchar);')


def addRecord(username, email, password):

    # Updating db
    conn = sqlite3.connect('login.db')
    print("Opened database successfully")

    cursor = conn.cursor()
    # print("Opened database successfully")
    find_user = ("SELECT * from Users WHERE username=? or email=?")

    cursor.execute(find_user,[(username),(email)])

    results = cursor.fetchall()

    if results:
        conn.close()
        ans = dict()
        ans["auth"] = "false"
        return ans
    else:
        conn.execute('CREATE TABLE IF NOT EXISTS Users(Id Int,username Varchar,email Varchar,password Varchar,bio Varchar, image Varchar);')

        query = "INSERT INTO Users(Id,username,email,password, bio,image) VALUES (?, ?, ?, ?, ?, ?)"

        cursor.execute("select count(*) from Users")
        numRows = cursor.fetchone()[0]

        today = datetime.date.today()
        bio = "Hey there! I am using RecipeBowl. RecipeBowl is the best Recipe generation website to get the most tasty recipes within seconds."

        default_img = "data:image/png;base64,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"

        recordTuple = (int(numRows) + 1, username, email, password, bio, default_img)
        conn.execute(query, recordTuple)

        conn.commit()
        conn.close()

        ans = dict()
        ans["auth"] = "true"
        return ans

def checkRecord(username, password):

    # Updating db
    conn = sqlite3.connect('login.db')
    print("Opened database successfully")

    cursor = conn.cursor()
    # print("Opened database successfully")

    find_user = ("SELECT * from Users WHERE username=? AND password=?")

    cursor.execute(find_user,[(username),(password)])

    results = cursor.fetchall()

    conn.close()

    if results:
        ans = dict()
        ans["auth"] = "true"
        return ans
    else:
        ans = dict()
        ans["auth"] = "false"
        return ans

image_urls = ['https://i.ndtvimg.com/i/2017-06/spicy-dishes_620x350_41498029900.jpg',
                'https://cookthestory.com/wp-content/uploads/2019/12/Italian-Chicken-Breast-1392x780-4095.jpg',
                'https://i.pinimg.com/originals/d8/b7/fe/d8b7fef1785f83140567d8d5febf2e56.jpg',
                'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=960,872',
                'https://www.swantour.com/blogs/wp-content/uploads/2019/04/Famous-Food-of-Shimla.jpg',
                'https://i.ndtvimg.com/i/2016-04/bell-pepper-cover_625x350_71460619334.jpg',
                'https://www.archanaskitchen.com/images/archanaskitchen/Indian_Vegetables_Gravy/Kadai_Baby_Corn_Capsicum_Masala_Recipe-6.jpg',
                'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                'https://images2.alphacoders.com/100/1003810.jpg',
                'https://www.itl.cat/pngfile/big/290-2906144_food-wallpaper-hd-restaurants-food-images-hd.jpg',
                'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                'https://thumbs.dreamstime.com/b/indian-food-thali-style-meal-chicken-meat-masala-tea-chai-wooden-table-138439693.jpg']

## Ingredients-to-Recipe
@app.route('/ingredient', methods = ["POST"])
def home():

    print("Running Ingredients-to-Recipe Function...")

    ingredients_l = request.json
    ingredients_list = [ingredients_l]
    print(ingredients_list)

    ans = generate_combinations(model_simplified, ingredients_list)
    return ans

imageCount = 1

## Image-to-Recipe
@app.route('/image', methods=['POST'])
def fileUpload():

    print("Inside fb function")

    data_dir = './data'

    # code will run in gpu if available and if the flag is set to True, else it will run on cpu
    use_gpu = False
    device = torch.device('cuda' if torch.cuda.is_available() and use_gpu else 'cpu')
    map_loc = None if torch.cuda.is_available() and use_gpu else 'cpu'

    # code below was used to save vocab files so that they can be loaded without Vocabulary class
    #ingrs_vocab = pickle.load(open(os.path.join(data_dir, 'final_recipe1m_vocab_ingrs.pkl'), 'rb'))
    #ingrs_vocab = [min(w, key=len) if not isinstance(w, str) else w for w in ingrs_vocab.idx2word.values()]
    #vocab = pickle.load(open(os.path.join(data_dir, 'final_recipe1m_vocab_toks.pkl'), 'rb')).idx2word
    #pickle.dump(ingrs_vocab, open('../demo/ingr_vocab.pkl', 'wb'))
    #pickle.dump(vocab, open('../demo/instr_vocab.pkl', 'wb'))

    ingrs_vocab = pickle.load(open(os.path.join(data_dir, 'ingr_vocab.pkl'), 'rb'))
    vocab = pickle.load(open(os.path.join(data_dir, 'instr_vocab.pkl'), 'rb'))

    ingr_vocab_size = len(ingrs_vocab)
    instrs_vocab_size = len(vocab)
    output_dim = instrs_vocab_size

    t = time.time()
    import sys; sys.argv=['']; del sys
    args = get_parser()
    args.maxseqlen = 15
    args.ingrs_only=False
    model = get_model(args, ingr_vocab_size, instrs_vocab_size)
    # Load the trained model parameters
    model_path = os.path.join(data_dir, 'modelbest.ckpt')
    model.load_state_dict(torch.load(model_path, map_location=map_loc))
    model.to(device)
    model.eval()
    model.ingrs_only = False
    model.recipe_only = False
    print ('loaded model')
    print ("Elapsed time:", time.time() -t)

    transf_list_batch = []
    transf_list_batch.append(transforms.ToTensor())
    transf_list_batch.append(transforms.Normalize((0.485, 0.456, 0.406),
                                                  (0.229, 0.224, 0.225)))
    to_input_transf = transforms.Compose(transf_list_batch)

    greedy = [True, False, False, False]
    beam = [-1, -1, -1, -1]
    temperature = 1.0
    numgens = len(greedy)

    import requests
    from io import BytesIO
    import random
    from collections import Counter
    #use_urls = False # set to true to load images from demo_urls instead of those in test_imgs folder
    show_anyways = False #if True, it will show the recipe even if it's not valid
    #image_folder = os.path.join(data_dir, 'demo_imgs')

    #if not use_urls:
    #    demo_imgs = os.listdir(image_folder)
    #    random.shuffle(demo_imgs)

    #demo_urls = ['https://food.fnr.sndimg.com/content/dam/images/food/fullset/2013/12/9/0/FNK_Cheesecake_s4x3.jpg.rend.hgtvcom.826.620.suffix/1387411272847.jpeg',
    #            'https://www.196flavors.com/wp-content/uploads/2014/10/california-roll-3-FP.jpg']

    #demo_files = demo_urls if use_urls else demo_imgs

    import warnings
    warnings.filterwarnings("ignore")
    # for img_file in demo_files:

    #     if use_urls:
    #         response = requests.get(img_file)
    #         image = Image.open(BytesIO(response.content))
    #     else:
    #         image_path = os.path.join(image_folder, img_file)
    #         image = Image.open(image_path).convert('RGB')

    file = request.files['file']
    image = Image.open(file).convert('RGB')

    # image.save(os.getcwd() + "\\" + "../src/components/image.jpg")

    transf_list = []
    transf_list.append(transforms.Resize(256))
    transf_list.append(transforms.CenterCrop(224))
    transform = transforms.Compose(transf_list)

    image_transf = transform(image)
    image_tensor = to_input_transf(image_transf).unsqueeze(0).to(device)


    ans_list = []

    num_valid = 1
    for i in range(numgens):
        with torch.no_grad():
            outputs = model.sample(image_tensor, greedy=greedy[i],
                                   temperature=temperature, beam=beam[i], true_ingrs=None)

        recp = dict()

        ingr_ids = outputs['ingr_ids'].cpu().numpy()
        recipe_ids = outputs['recipe_ids'].cpu().numpy()

        outs, valid = prepare_output(recipe_ids[0], ingr_ids[0], ingrs_vocab, vocab)

        if valid['is_valid'] or show_anyways:

            print ('RECIPE', num_valid)
            num_valid+=1
            #print ("greedy:", greedy[i], "beam:", beam[i])

            BOLD = '\033[1m'
            END = '\033[0m'

            print (BOLD + '\nTitle:' + END,outs['title'])
            recp['author'] = outs['title']

            print (BOLD + '\nIngredients:'+ END)
            print (', '.join(outs['ingrs']))
            recp['title'] = ', '.join(outs['ingrs'])

            print (BOLD + '\nInstructions:'+END)
            print ('-'+'\n-'.join(outs['recipe']))
            recp['content'] = '-'+'\n-'.join(outs['recipe'])

            recp["date_posted"] = "image.jpg"

            recp['isFavorite'] = "false"
            recp['classname'] = "heart"
            print ('='*20)

            ans_list.append(recp)

        else:
            pass
            print ("Not a valid recipe!")
            print ("Reason: ", valid['reason'])

    ans = dict()
    # ans[0] = ans_list
    ans[0] = ans_list
    #return ans
    return ans

## Cuisine-to-Recipe
@app.route('/cuisine', methods=['POST'])
def cuisine():

    # Random recipes
    def Rand(start, end, num):
        res = []

        while len(res)<10:
            n = random.randint(start, end)
            if n not in res:
                res.append(n)

        return res

    def rectify(s):
        s = s[1:-1]
        li = s.split("',")

        for i in range(len(li)):
            li[i] = li[i].strip()
            li[i] = li[i].replace("'","")
            li[i] = li[i].replace("\\u2009", " ")

            li[i] = "- " + li[i] + " \n"

        s = "".join(li)

        return s


    # Provide cuisine here
    cuisine = request.json
    cuisine = cuisine.strip().lower()

    # Path to DB
    dirname = os.path.dirname(__file__)
    path = "Cuisines/" + cuisine + ".db"
    filename = os.path.join(dirname, path)

    # Connecting to DB
    conn = sqlite3.connect(filename)
    print("Opened database successfully")
    cursor = conn.cursor()

    count_query = ("SELECT count(*) from Recipes")
    cursor.execute(count_query)

    count = cursor.fetchall()[0][0]

    # RAndom 10 recipes
    num = 10
    start = 1
    end = int(count)
    recipe_nums = Rand(start, end, num)

    ans = dict()
    ans[0] = []

    for recipe in recipe_nums:
        find_recipe = ("SELECT * from Recipes WHERE Id=?")
        cursor.execute(find_recipe,[(recipe)])

        result = cursor.fetchall()

        title = result[0][1]
        ingredients = rectify(result[0][2])
        instructions = rectify(result[0][3])
        img_link = result[0][4]

        temp = {'author':title, 'title': ingredients,'content': instructions, 'date_posted': img_link, 'isFavorite':'false', 'classname':'heart'}

        ans[0].append(temp)

    conn.close()
    print("Successful")

    return ans

## User Login
@app.route('/login', methods = ["POST"])
def login():
    print(request.json)
    # username = request.form["username"]
    # password = request.form["password"]
    # print(username)
    # print(password)
    # print(request)
    ans = checkRecord(request.json["username"],request.json["password"])
    return ans

## User Register
@app.route('/register', methods = ["POST"])
def register():
    print(request.json)
    ans = addRecord(request.json["username"],request.json["email"],request.json["password"])
    return ans

@app.route('/profile-stats', methods=['POST'])
def profileStats():

    username = request.json
    print(username)

    filename = "login.db"

    conn = sqlite3.connect(filename)
    print("Opened database successfully")
    cursor = conn.cursor()

    find_recipe = ("SELECT * from Users WHERE username=?")
    cursor.execute(find_recipe,[(username)])

    result = cursor.fetchall()
    conn.close()

    conn = sqlite3.connect("userFav.db")
    print("Opened database successfully")
    cursor = conn.cursor()

    find_recipe = ("SELECT * from Favorites WHERE username=?")
    cursor.execute(find_recipe,[(username)])

    result2 = cursor.fetchall()

    # print(result2)
    recipes = []

    for recipe in result2:
        recipes.append({'author':recipe[2], 'title': recipe[3],'content': recipe[4], 'date_posted': recipe[5] , 'isFavorite':'true', 'classname':'heartclick'})


    # sql = "DELETE FROM Favorites"
    # conn = sqlite3.connect("userFav.db")
    #
    # cursor = conn.cursor()
    # cursor.execute(sql)
    #
    # conn.commit()

    ans = {"username":result[0][1],"email":result[0][2],"bio":result[0][4], "fav_recipes":recipes, "image":result[0][5]}

    conn.close()

    return ans

@app.route('/set-bio', methods=['POST'])
def setBio():

    username = request.json["Username"]
    bio = request.json["Bio"]
    print(bio)

    filename = "login.db"

    conn = sqlite3.connect(filename)
    print("Opened database successfully")
    cursor = conn.cursor()

    find_recipe = ("UPDATE Users SET bio = ? WHERE username=?")
    cursor.execute(find_recipe,[(bio),(username)])

    conn.commit()
    conn.close()


    return ""

@app.route('/change-password', methods=['POST'])
def updateUserPassword():

    old = request.json["old"]
    new = request.json["new"]
    username = request.json["Username"]

    filename = "login.db"

    conn = sqlite3.connect(filename)
    print("Opened database successfully")
    cursor = conn.cursor()

    find_user = ("SELECT password from Users WHERE username=?")

    cursor.execute(find_user,[(username)])

    results = cursor.fetchall()[0][0]
    print(results)

    if results != old:
        conn.close()
        ans = dict()
        ans["auth"] = "false"
        return ans
    else:
        find_recipe = ("UPDATE Users SET password = ? WHERE username=?")
        cursor.execute(find_recipe,[(new),(username)])

        print("updated")

        conn.commit()
        conn.close()
        ans = dict()
        ans["auth"] = "true"
        return ans

    return ""

@app.route('/favorites', methods=['POST'])
def FavoriteRecipe():
    conn = sqlite3.connect('userFav.db')
    print("Opened database successfully")

    cursor = conn.cursor()

    conn.execute('CREATE TABLE IF NOT EXISTS Favorites(Id Int,username Varchar,recipe_name Varchar,recipe_ing Varchar,recipe_inst Varchar,recipe_img Varchar);')
    # print("Opened database successfully")
    #find_user = ("SELECT * from Users WHERE username=? or email=?")

    #cursor.execute(find_user,[(username),(email)])

    #results = cursor.fetchall()
    req = request.json

    if req["set"] == "true":

        count = ("SELECT count(*) from Favorites")

        cursor.execute(count)
        count = cursor.fetchall()[0][0]

        query = "INSERT INTO Favorites(Id,username,recipe_name,recipe_ing, recipe_inst,recipe_img) VALUES (?, ?, ?, ?, ?, ?)"

        recordTuple = (int(count) + 1, req["username"], req["recipes"]["author"], req["recipes"]["title"], req["recipes"]["content"], req["recipes"]["date_posted"])
        conn.execute(query, recordTuple)

        conn.commit()
        conn.close()

        print("Namaste")

        ans = dict()
        return ans
    else:

        query = 'DELETE FROM Favorites WHERE username=? AND recipe_name=? AND recipe_ing=? AND recipe_inst=? AND recipe_img=?'

        cursor.execute(query,[(req["username"]),(req["recipes"]["author"]),(req["recipes"]["title"]),(req["recipes"]["content"]),(req["recipes"]["date_posted"])])

        conn.commit()
        conn.close()

        print("Namaste 2")

        ans = dict()
        return ans

@app.route('/user-image-change', methods=['POST'])
def updateUserImage():

    newImg = request.json["Image"]
    print(newImg)
    username = request.json["Username"]

    filename = "login.db"

    conn = sqlite3.connect(filename)
    print("Opened database successfully")
    cursor = conn.cursor()

    find_recipe = ("UPDATE Users SET image = ? WHERE username=?")
    cursor.execute(find_recipe,[(newImg),(username)])

    print("updated")

    conn.commit()
    conn.close()
    ans = dict()
    ans["auth"] = "true"
    return ans


@app.route('/user-post', methods=['POST'])
def userPost():

    newImg = request.json["Image"]
    username = request.json["Username"]
    post = request.json["Post"]

    filename = "UserPost.db"

    conn = sqlite3.connect(filename)
    print("Opened database successfully")

    cursor = conn.cursor()

    # sql = "DELETE FROM Users"
    # conn = sqlite3.connect(filename)
    #
    # cursor = conn.cursor()
    # cursor.execute(sql)
    #
    # conn.commit()

    conn.execute('CREATE TABLE IF NOT EXISTS Posts(Id Int,username Varchar,time Varchar,post Varchar, image Varchar);')

    query = "INSERT INTO Posts(Id,username,time,post,image) VALUES (?, ?, ?, ?, ?)"

    cursor.execute("select count(*) from Posts")
    numRows = cursor.fetchone()[0]

    from datetime import datetime

    now = datetime.now()
    dt_string = now.strftime("%d/%m/%Y %H:%M:%S")

    recordTuple = (int(numRows) + 1, username, dt_string, post, newImg)
    conn.execute(query, recordTuple)

    conn.commit()
    conn.close()

    print(dt_string)
    print(post)

    temp = dict()
    temp["username"] = username
    temp["date"] = dt_string
    temp["text"] = post
    temp["img"] = newImg

    filename = "login.db"

    conn = sqlite3.connect(filename)
    cursor = conn.cursor()

    find_recipe = ("SELECT * from Users WHERE username=?")
    cursor.execute(find_recipe,[(username)])

    result = cursor.fetchall()
    conn.close()

    temp["userImg"] = result[0][5]

    return temp

@app.route('/fetch-posts', methods=['POST'])
def fetchPost():

    filename = "UserPost.db"

    conn = sqlite3.connect(filename)
    print("Opened database successfully")

    cursor = conn.cursor()

    # sql = "DELETE FROM Posts"
    # conn = sqlite3.connect(filename)
    #
    # cursor = conn.cursor()
    # cursor.execute(sql)
    #
    # conn.commit()
    #
    # conn.execute('CREATE TABLE IF NOT EXISTS Posts(Id Int,username Varchar,time Varchar,post Varchar, image Varchar);')

    query = "SELECT * FROM Posts order by time desc"

    cursor.execute(query)

    result = cursor.fetchall()

    conn.close()

    # print(result)
    ans = dict()
    ans[0] = []

    for x in result:
        temp = dict()
        temp["username"] = x[1]
        temp["date"] = x[2]
        temp["text"] = x[3]
        temp["img"] = x[4]

        username = x[1]

        filename = "login.db"

        conn = sqlite3.connect(filename)
        cursor = conn.cursor()

        find_recipe = ("SELECT * from Users WHERE username=?")
        cursor.execute(find_recipe,[(username)])

        result = cursor.fetchall()
        conn.close()

        temp["userImg"] = result[0][5]
        temp["showComments"] = "off"

        ans[0].append(temp)

    return ans

@app.route('/fetch-comments', methods=['POST'])
def fetchComment():

    username = request.json["username"]
    date = request.json["date"]

    filename = "UserComment.db"

    conn = sqlite3.connect(filename)
    print("Opened database successfully")

    cursor = conn.cursor()

    # sql = "DELETE FROM Posts"
    # conn = sqlite3.connect(filename)
    #
    # cursor = conn.cursor()
    # cursor.execute(sql)
    #
    # conn.commit()

    conn.execute('CREATE TABLE IF NOT EXISTS Comments(Id Int,username Varchar,time Varchar,comment Varchar, commentor Varchar);')
    # conn.close()
    query = "SELECT * FROM Comments where username=? and time=?"

    cursor.execute(query,[(username),(date)])

    result = cursor.fetchall()
    print(result)
    # conn.close()
    #
    # # print(result)
    # ans = dict()
    # ans[0] = []
    #
    # for x in result:
    #     temp = dict()
    #     temp["username"] = x[1]
    #     temp["date"] = x[2]
    #     temp["text"] = x[3]
    #     temp["img"] = x[4]
    #
    #     username = x[1]
    #
    #     filename = "login.db"
    #
    #     conn = sqlite3.connect(filename)
    #     cursor = conn.cursor()
    #
    #     find_recipe = ("SELECT * from Users WHERE username=?")
    #     cursor.execute(find_recipe,[(username)])
    #
    #     result = cursor.fetchall()
    #     conn.close()
    #
    #     temp["userImg"] = result[0][5]
    #     temp["showComments"] = "off"
    #
    #     ans[0].append(temp)

    ans = dict()
    ans[0] = []
    for x in result:
        d = dict()
        d["username"] = x[3]
        d["comment"] = x[4]
        ans[0].insert(0,d)

    return ans

@app.route('/store-comments', methods=['POST'])
def storeComment():

    username = request.json["username"]
    date = request.json["date"]
    commentator = request.json["commentator"]
    comment = request.json["comment"]

    filename = "UserComment.db"

    conn = sqlite3.connect(filename)
    print("Opened database successfully")

    cursor = conn.cursor()

    # sql = "DELETE FROM Posts"
    # conn = sqlite3.connect(filename)
    #
    # cursor = conn.cursor()
    # cursor.execute(sql)
    #
    # conn.commit()

    conn.execute('CREATE TABLE IF NOT EXISTS Comments(Id Int,username Varchar,time Varchar,comment Varchar, commentor Varchar);')
    # conn.close()
    query = "INSERT INTO Comments(Id,username,time,comment, commentor) VALUES (?, ?, ?, ?, ?)"

    cursor.execute("select count(*) from Comments")
    numRows = cursor.fetchone()[0]

    recordTuple = (int(numRows) + 1, username, date, commentator,comment)
    conn.execute(query, recordTuple)

    conn.commit()

    query = "SELECT * FROM Comments where username=? and time=?"

    cursor.execute(query,[(username),(date)])

    result = cursor.fetchall()
    print(result)

    conn.close()

    # conn.close()
    #
    # # print(result)
    # ans = dict()
    # ans[0] = []
    #
    # for x in result:
    #     temp = dict()
    #     temp["username"] = x[1]
    #     temp["date"] = x[2]
    #     temp["text"] = x[3]
    #     temp["img"] = x[4]
    #
    #     username = x[1]
    #
    #     filename = "login.db"
    #
    #     conn = sqlite3.connect(filename)
    #     cursor = conn.cursor()
    #
    #     find_recipe = ("SELECT * from Users WHERE username=?")
    #     cursor.execute(find_recipe,[(username)])
    #
    #     result = cursor.fetchall()
    #     conn.close()
    #
    #     temp["userImg"] = result[0][5]
    #     temp["showComments"] = "off"
    #
    #     ans[0].append(temp)

    ans = dict()
    ans[0] = []
    for x in result:
        d = dict()
        d["username"] = x[3]
        d["comment"] = x[4]
        ans[0].insert(0,d)

    return ans
