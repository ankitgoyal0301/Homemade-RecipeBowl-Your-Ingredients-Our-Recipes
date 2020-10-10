# Deep Learning
import tensorflow as tf
import matplotlib.pyplot as plt
import numpy as np
import json
import platform
import time
import pathlib
import os

# dataset
CACHE_DIR = './tmp'
pathlib.Path(CACHE_DIR).mkdir(exist_ok=True)

dataset_file_name = 'recipes_raw.zip'
dataset_file_origin = 'https://storage.googleapis.com/recipe-box/recipes_raw.zip'

dataset_file_path = tf.keras.utils.get_file(
    fname=dataset_file_name,
    origin=dataset_file_origin,
    cache_dir=CACHE_DIR,
    extract=True,
    archive_format='zip'
)

def load_dataset(silent=False):
    # List of dataset files we want to merge.
    dataset_file_names = [
        'recipes_raw_nosource_ar.json',
        'recipes_raw_nosource_epi.json',
        'recipes_raw_nosource_fn.json',
    ]

    dataset = []

    for dataset_file_name in dataset_file_names:
        dataset_file_path = f'{CACHE_DIR}/datasets/{dataset_file_name}'

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

# Creating Model
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

# Loading model into the architecture
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


# Flask Portion
from flask import Flask, render_template, url_for
from flask import request

posts = [
    {
        'author': 'Corey Schafer',
        'title': 'Blog Post 1',
        'content': 'First post content',
        'date_posted': 'April 20, 2018'
    },
    {
        'author': 'Jane Doe',
        'title': 'Blog Post 2',
        'content': 'Second post content',
        'date_posted': 'April 21, 2018'
    }
]

app = Flask(__name__)

@app.route('/', methods = ["POST", "GET"])
def home():

    if request.method == "POST":

        ans = []

        def generate_combinations(model, ingredients_list):
            recipe_length = 4000
            try_letters = ingredients_list
            try_temperature = [0.6, 1.0, 0.8, 0.4, 0.2]

            for letter in try_letters:
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
                    ans.append({
                        'author': title[2:],
                        'title': ingredients,
                        'content': recipe,
                        'date_posted': 'April 20, 2018'
                    })
                    break

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

        ingredients_l = request.form["ingredients"]
        ingredients_list = [ingredients_l]
        print(ingredients_list)

        generate_combinations(model_simplified, ingredients_list)

        return render_template("home.html",posts=ans)

    else:
        return render_template("home.html",posts=posts)

@app.route('/about')
def about():
    return render_template("about.html", title="About")

if __name__ == "__main__":
    app.run(debug=True)
