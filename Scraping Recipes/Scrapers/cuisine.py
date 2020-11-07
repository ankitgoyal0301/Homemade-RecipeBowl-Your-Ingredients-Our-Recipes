# -*- coding: utf-8 -*-
"""
Created on Thu Nov  5 14:43:05 2020

@author: Ankit
"""

# Scraping Recipes - All Recipes
import html
from urllib.request import Request,urlopen
from bs4 import BeautifulSoup as soup
import pandas as pd
import numpy as np
import json 
import requests
import urllib.request

import os
from sys import platform
import sqlite3
import time
import datetime

base_url = 'https://www.allrecipes.com/recipes/236/us-recipes/?page='

site_base = "https://www.allrecipes.com"


conn = sqlite3.connect(r'D:/cuisine/usa/usa.db')
# print("Opened database successfully")
conn.execute('CREATE TABLE IF NOT EXISTS Recipes(Id Int,title Varchar,ingredients Varchar,instructions Varchar,picture_link Varchar);')
# conn.execute("DROP TABLE Recipes")
conn.close()


recipe_count = 1

for i in range(2, 20):# 101):
    
    print("Page "+str(i)+" scraping started!!!")
    
    url = base_url + str(i)
    req = Request(url, headers={'User-Agent':'Mozilla/5.0'})
    webpage = urlopen(req).read()
    page_soup = soup(webpage,"html.parser")
    
    recipe_links_on_page = []
    
    page_soup = page_soup.find('main')
    links = page_soup.find_all("a", class_="tout__titleLink")
   
    for link in links:
        if link["href"].startswith("/recipe/"):
            recipe_links_on_page.append(site_base + link["href"])

        
    for recipe_url in recipe_links_on_page:
        req_recipe = Request(recipe_url, headers={'User-Agent':'Mozilla/5.0'})
        webpage_recipe = urlopen(req_recipe).read()
        page_soup_recipe = soup(webpage_recipe,"html.parser")
        
        # Name of Recipe
        name = page_soup_recipe.find('h1',class_='headline heading-content').text
        
        # Ingredients
        ingredients = page_soup_recipe.find_all('span',class_='ingredients-item-name')
        temp_ingredients = []
        
        for ingredient in ingredients:
            temp_ingredients.append(ingredient.text.strip())
        
        # Recipe 
        recipes = page_soup_recipe.find("ul", { "class" : "instructions-section" }).findAll("li", recursive=False)
        temp_recipe = []
        
        for x in range(len(recipes)):
            temp_recipe.append(recipes[x].find('p').text)
    
        # Image
        temp_img = page_soup_recipe.find("div", { "class" : "docked-sharebar-content-container" })
        temp_img = temp_img.find("div",{"class" : "image-container"})
        
        if temp_img.find("div") == None:
            continue
        
        temp_img = temp_img.find("div")
        
        if temp_img.find("img") == None:
            continue
        
        temp_img = temp_img.find("img")["src"]
        
        img_name = r"D:/cuisine/usa/images/" + str(recipe_count) + '.jpg'
        urllib.request.urlretrieve(str(temp_img), img_name)

        # Data to be written 
        dictionary ={ 
            "id" : recipe_count,
            "title" : name, 
            "ingredients" : temp_ingredients, 
            "instructions" : temp_recipe, 
            "picture_link" : temp_img
        }
        
        conn = sqlite3.connect(r'D:/cuisine/usa/usa.db')

        cursor = conn.cursor()
        
        conn.execute('CREATE TABLE IF NOT EXISTS Recipes(Id Int,title Varchar,ingredients Varchar,instructions Varchar,picture_link Varchar);')
        
        query = "INSERT INTO Recipes(Id,title,ingredients,instructions, picture_link) VALUES (?, ?, ?, ?, ?)"
        
        recordTuple = (dictionary["id"], dictionary["title"], str(dictionary["ingredients"]), str(dictionary["instructions"]), dictionary["picture_link"])
        conn.execute(query, recordTuple)
        
        conn.commit()
        conn.close()
        
        # Done with the recipe
        print("Recipe "+str(recipe_count)+" Scrapped")
        recipe_count += 1
        
    print("Page "+str(i)+" Scraped!!!")

"""
conn = sqlite3.connect('D:/cuisine/indian/indian.db')

cursor = conn.cursor()
# print("Opened database successfully")
# conn.execute('CREATE TABLE IF NOT EXISTS Users(Id Int,username Varchar,email Varchar,password Varchar,bio Varchar);')
cursor.execute("select count(*) from Recipes")
rows = cursor.fetchall()

#conn.execute("DROP TABLE Recipes")
conn.close()
"""

