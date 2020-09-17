# Scraping Recipes - All Recipes
import html
from urllib.request import Request,urlopen
from bs4 import BeautifulSoup as soup
import pandas as pd
import numpy as np
import json 

base_url = 'https://www.allrecipes.com/recipes/?page='

recipe_titles = []
recipe_img_links = []
recipe_ingredients = []
recipe_intructions = []

recipes_dict = dict()

recipe_count = 1

for i in range(2, 3):# 417):
    
    print("Page "+str(i)+" scraping started!!!")
    
    url = base_url + str(i)
    req = Request(url, headers={'User-Agent':'Mozilla/5.0'})
    webpage = urlopen(req).read()
    page_soup = soup(webpage,"html.parser")
    
    recipe_links_on_page = []
    
    anchors = page_soup.find_all('a', {'class': 'recipeCard__imageLink', 'href': True})

    for anchor in anchors:
        recipe_links_on_page.append(anchor['href'])
        
    for recipe_url in recipe_links_on_page:
        req_recipe = Request(recipe_url, headers={'User-Agent':'Mozilla/5.0'})
        webpage_recipe = urlopen(req_recipe).read()
        page_soup_recipe = soup(webpage_recipe,"html.parser")
        
        # Name of Recipe
        name = page_soup_recipe.find('h1',class_='headline heading-content').text
        recipe_titles.append(name)
        
        # Ingredients
        ingredients = page_soup_recipe.find_all('span',class_='ingredients-item-name')
        temp_ingredients = []
        
        for ingredient in ingredients:
            temp_ingredients.append(ingredient.text.strip())
        
        recipe_ingredients.append(temp_ingredients)
        
        # Recipe 
        recipes = page_soup_recipe.find("ul", { "class" : "instructions-section" }).findAll("li", recursive=False)
        temp_recipe = []
        
        for i in range(len(recipes)):
            temp_recipe.append(recipes[i].find('p').text)
        
        recipe_intructions.append(temp_recipe)
    
        # Image
        temp_img = page_soup_recipe.find("div", { "class" : "docked-sharebar-content-container" })
        temp_img = temp_img.find("div",{"class" : "image-container"})
        temp_img = temp_img.find("div")
        
        recipe_img_links.append(temp_img["data-src"])

        # Data to be written 
        dictionary ={ 
            "title" : recipe_titles[recipe_count], 
            "ingredients" : recipe_ingredients[recipe_count], 
            "instructions" : recipe_intructions[recipe_count], 
            "picture_link" : recipe_img_links[recipe_count]
        }

        # Done with the recipe
        print("Recipe "+str(recipe_count)+" Scrapped")
        recipe_count += 1

        # Adding to recipe_dict
        recipe_dict[recipe_count] = dictionary
        
    print("Page "+str(i)+" Scraped!!!")
         
# Storing Dataframe to JSON file format for training
# Serializing json  
json_object = json.dumps(dictionary, indent = 4) 
  
# Writing to dataset_ar.json 
with open("dataset_ar.json", "w") as outfile: 
    outfile.write(json_object)

# Storing in CSV File
dataset_ar = pd.DataFrame(list(zip(recipe_titles, recipe_ingredients, recipe_intructions, recipe_img_links)), 
               columns =['title', 'ingredients', 'instructions', 'picture_link'])

dataset_ar.to_csv('./Datasets/dataset_ar.csv')
