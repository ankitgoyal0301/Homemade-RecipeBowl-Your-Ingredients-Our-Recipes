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
        conn.execute('CREATE TABLE IF NOT EXISTS Users(Id Int,username Varchar,email Varchar,password Varchar,bio Varchar);')

        query = "INSERT INTO Users(Id,username,email,password, bio) VALUES (?, ?, ?, ?, ?)"

        cursor.execute("select count(*) from Users")
        numRows = cursor.fetchone()[0]

        today = datetime.date.today()
        bio = "Hey there! I am using RecipeBowl. RecipeBowl is the best Recipe generation website to get the most tasty recipes within seconds."

        recordTuple = (int(numRows) + 1, username, email, password, bio)
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

    ans = {"username":result[0][1],"email":result[0][2],"bio":result[0][4], "fav_recipes":recipes}

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
