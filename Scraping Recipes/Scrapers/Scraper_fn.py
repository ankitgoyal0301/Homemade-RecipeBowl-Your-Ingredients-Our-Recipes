# Scraping Recipes - Food Network
import html
from urllib.request import Request,urlopen
from bs4 import BeautifulSoup as soup
import pandas as pd
import numpy as np

base_url = 'https://www.foodnetwork.com/recipes&page='
prefix_url = 'https://www.foodnetwork.com'

recipe_titles = []
recipe_img_links = []
recipe_ingredients = []
recipe_intructions = []

recipe_count = 1

for i in range(1,3):# 3102):
    
    print("Page "+str(i)+" scraping started!!!")
    
    url = base_url + str(i)
    req = Request(url, headers={'User-Agent':'Mozilla/5.0'})
    webpage = urlopen(req).read()
    page_soup = soup(webpage,"html.parser")
    
    recipe_links_on_page = []
    
    recipe_links = page_soup.find_all('h4', {'class': 'hed'})
    
    for link in recipe_links:
        recipe_links_on_page.append(prefix_url + link.find('a')['href'])
        
    
        
    for recipe_url in recipe_links_on_page:
        req_recipe = Request(recipe_url, headers={'User-Agent':'Mozilla/5.0'})
        webpage_recipe = urlopen(req_recipe).read()
        page_soup_recipe = soup(webpage_recipe,"html.parser")
        
        # Name of Recipe
        name = page_soup_recipe.find('h1',itemprop="name").text
        recipe_titles.append(name)
        
        
        # Ingredients
        ingredients = page_soup_recipe.find('div',class_='ingredients-info').find('ol', class_='ingredient-groups').find_all('li', {'class':'ingredient'})
        
        temp_ingredients = []
        
        for ingredient in ingredients:
            temp_ingredients.append(ingredient.text.strip())
        
        recipe_ingredients.append(temp_ingredients)
        
        # Recipe
        recipes = page_soup_recipe.find('div',class_='instructions').find('ol', class_='preparation-groups').find_all('li', {'class':'preparation-step'})
        
        temp_recipe = []
        
        for recipe in recipes:
            temp_recipe.append(recipe.text.strip())
        
        recipe_intructions.append(temp_recipe)
    
        # Image 
        temp_img = page_soup_recipe.find('div',class_='social-img').find('img')['srcset']
        recipe_img_links.append(temp_img)
        
        print("Recipe "+str(recipe_count)+" Scrapped")
        recipe_count += 1
        
    print("Page "+str(i)+" Scraped!!!")
        
dataset_fn = pd.DataFrame(list(zip(recipe_titles, recipe_ingredients, recipe_intructions, recipe_img_links)), 
               columns =['Recipe_name', 'Recipe_ingredients', 'Recipe_instructions', 'Recipe_img_link'])

dataset_fn.to_csv('./Datasets/dataset_fn.csv')
