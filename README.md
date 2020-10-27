# Homemade RecipeBowl:Your Ingredients Our Recipes

## Group - 10
**Mentor** - Poonam Saini, Faculty, Computer Science and Engineering

### Developer Team:

- Divyanshu Garg - 18103035
- Ankit Goyal - 18103018
- Krish Garg - 18103027
- Anish Agarwal - 18103039

## Documentation:

[Homemade RecipeBowl - Documentation](https://docs.google.com/document/d/1m4HwRRv36_pwn7cS87VdmaX4Fl8op--G-5P0T7AZiQU/edit)
[ChefKoch Images Dataset](https://drive.google.com/drive/folders/1uNk_TbVd__8W8HoXop1uI_SNFiRy03ip?usp=sharing)

## Website Snapshot:

<img src="https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Videos/Project%20Demo%20gif%201.gif" alt="Input" width="100%" height="auto"> 

## Instructions:

### For running the Frontend in React:

#### Create a **new folder** for react frontend:

- Installing npm: $npm install -g create-react-app
- Creating react project: $create-react-app \&lt;project\_name\_all\_in\_lower\_case\&gt;
- Copy (by replacing) all the files in the &quot;Website Front End&quot; folder into the newly created react project folder.
- Run the backend server (given below) in a separate command prompt.
- Activating the environment, in &quot;Website Front End\api&quot; folder: $venv\Scripts\activate
- Return to parent folder, i.e., react project folder: $cd ..
- Running react project: $npm start

### For running the Backend server in Flask:

#### In **&quot;Website Front End\api&quot;** folder:

- Creating virtual environment, i.e. venv, : $python -m venv venv (replace already present venv folder in &quot;Website Front End\api&quot;, if prompted)
- Activating environment : $venv\Scripts\activate
- Running flask file: $flask run --no-debugger


## Project Synopsis:

**BACKGROUND:**

Most often, we get into a situation when we want to cook something delicious, however, we are short on ingredients at our home. It also creates a lot of confusion about what to cook with the available ingredients. Further, we might not have accessibility to more ingredients from the nearby market due to various reasons like non-availability or specifically the unprecedented times as Covid which has resulted in shutdowns. Finally, we are bound at home to make the best possible dish from leftover ingredients.

**MOTIVATION:**

Our project aims to make a user aware of the various dishes which can be cooked from the available set of ingredients being input by a user. There may be times when a person desires new, delicious, healthy or maybe presentable cuisines and above all, it necessarily is homemade as the possibilities to get one from outside might be restricted like in the recent pandemic period (Covid-19). An optimal solution to this could be the design of an application wherein the user will be capable of exploring and preparing several new dishes which include those ingredients. Therefore, a system could be designed that could actually take ingredients as the input and generates the best-matched recipe from an exhaustive list of most matching recipes.

In addition, this project would be a great platform for people to learn and expand their knowledge in the field of cooking. Moreover, it will help in exploring and spreading the taste of one region worldwide. It will also bring innovation to the art of cooking. Our motivation is not only restricted to these merits but also includes more information about nutrition for respective recipes. Nutrition and health being the most important aspects of one&#39;s life are also one of the most neglected areas. This project will also ensure that a user is aware of his/her food intake value and thus plan to explore and make healthier meals.

**OBJECTIVE:**

Our objective is to create an application that will assist an end-user to explore a variety of recipes with the available ingredients in one&#39;s kitchen. The steps to be followed are:

1. To explore various related datasets and perform data preprocessing in order to extract the desired attributes.
2. To perform model training using Machine Learning or Deep Learning algorithms to find the best matching recipes corresponding to a given set of ingredients.
3. To classify an input image of any dish and estimate its caloric value.

**WORKPLAN:**

![Flow Chart 1](https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Images/Flow%20chart%201.png)

Fetching Recipes

![Flow Chart 2](https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Images/Flow%20chart%202.png)

Finding Caloric values of Recipes from images

**DELIVERABLES:**

The deliverable will be an application to assist an end-user in order to explore a variety of recipes with the available ingredients in one&#39;s kitchen along with information upon their nutritional value.

## Timelines:

**Week 0:** (28 July 2020 - 9 August 2020)

**Team formation and Mentor Selection:**

- Team Member Formation.
- Choosing the field/technology of interest after a series of meetings with the team members.
- Selecting the appropriate mentor best suited to the technology selected.

---

**Week 1:** (10 August 2020 - 16 August 2020)

**Project Idea Discussion and Synopsis Drafting:**

- Project Ideas explored by all the team members.
- Decided on three project ideas before presenting to our project mentor, Poonam ma&#39;am. The ideas were:
  - A project in which could include single or multiple games(depending on us) in which using detection techniques we could play games like Subway surfers, temple run, etc by doing various body movements like jumping, bending, etc, which would remove the problems in a way people don&#39;t exercise.
  - Blind people face problems while walking, so using detection techniques, we could actually convey to them using voice assistants whether about the objects around.
  - In lockdown, there&#39;re a lot of problems in a way people find while cooking. If you have limited ingredients and you don&#39;t know actually what to make using that, we can develop an application using deep learning where we could give input as ingredients to the website and we get back some suggestions of the recipes on what can be made.
- Ideas were presented to Poonam ma&#39;am in a meeting, where she approved the first and the third ideas mentioned above and explained to us how a lot of work has been done on the second one already.
- Finally, we decided to take up the third idea, as we found it to be a more practical and useful idea. Secondly, the first idea might include issues in using an already existing game(copyright issues), and given the fact that laptop cameras are not up to the mark(quality-wise), we dropped the idea.

---

**Week 2:** (17 August 2020 - 23 August 2020)

**Discovering Project Requirements:**

- Looking onto the existing work in this related field, if done.
- Deciding the further objectives which can be achieved, and which would add a lot of value to the existing project.
- We must have datasets for training purposes of our models to be able to predict the required output.
- Using Google Colab to train our model. (We might later require GPU access to be able to train the model, if colab doesn&#39;t work)
- Deciding on technology for Deep learning depending on the familiarity of the teammates with the technologies:
  - Natural Language Processing(NLP) using Recurrent Neural Networks(RNN) and LSTM.
  - Tensorflow and Keras framework for training the model.
- Deciding on technology for frontend and backend for the website(and parallelly learning them during the training phase):
  - Frontend - React
  - Backend - Flask(decided later)

---

**Week 3** : (24 August 2020 - 30 August 2020)

**Exploring the datasets and websites best for scrapping, if required:**

- Looked up for the existing datasets on the internet.
- Found one dataset by MIT, but the access was not public, and the link where the request for the grant was to be made, wasn&#39;t accessible.
- Could not find any other dataset related to the Recipe name along with ingredients and instructions.
- Created the Github Repository for the project - [Homemade Recipebowl](https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes) (Currently the repository is private)

---

**Week 4** : (31 August 2020 - 6 September 2020)

**Scraping Websites:**

- Started looking up for websites suitable for scraping the recipes.
- Came up with three websites:
  - [Epicurious](http://epicurious.com/)
  - [All Recipes](http://allrecipes.com/)
  - [Food Network](https://www.foodnetwork.com/)
- Explored the websites and checked for whether these can be scrapped or not.
- Created the code for scraping in python.
- Scraped the websites using the BeautifulSoup module in python.

---

**Week 5** : (7 September 2020 - 13 September 2020)

**Deep Learning Course:**

- Took a brief overview of the deep learning course on Coursera by Andrew NG.
- Also referred to some online articles and tutorials regarding NLP.

---

**Week 6** : (14 September 2020 - 20 September 2020)

**Writing code for training the model:**

- Drafted code in python colab for model training on input ingredients and giving recipes as the output.
- Designed the UML Diagrams(Use case and Class Diagrams) of our project model.

---

**Week 7** : (21 September 2020 - 27 September 2020)

**Training and testing of the Model:**

- Trained the deep learning model over 20 epochs to test the working of the code on Google Colab.
- Tested the model and retrieved the output from the model to check for further improvisations in the model.
- Requested Prof. Poonam Saini for PEC&#39;s DGX GPU access for further training as it was not feasible on Google colab due to limited resources.
- Designed the UML Diagrams(Activity, Sequence and Statechart Diagrams) of our project model.

---

**Week 8** : (28 September 2020 - 4 October 2020)

**Training Deep Learning Model on DGX's GPU:**

- Trained and tested our model on PEC&#39;s DGX GPU using docker and Teamviewer and extracted the following models:

![Model's Perfromance Table](https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Images/Models%20Performance%20Table.PNG)

  - Batch Size = 64
  - Loss Function = sparse\_categorical\_crossentropy

**RMSProp\***

VERY LARGE FLUCTUATIONS IN THE LOSS OVER CONSECUTIVE EPOCHS, SO NOT PREFERABLE

---

**Week 9** : (5 October 2020 - 11 October 2020)

**Developed the RecipeBowl Website:**

- Developed the website&#39;s front end using the React framework.
- Developed the website&#39;s backend using the Flask framework of python.
- Finally integrated both the front end and the backend together.

---

## Future Plan

**CURRENT BUGS / CHALLENGES:**

- As of now for viewing the recipe output on submitting the ingredients, the website needs to be reloaded.

**ADDITIONAL FUNCTIONALITY:**

- Enhancement of the frontend of the website.
- Image to recipe functionality.
- Cuisine to recipes functionality.
- Login page.
- Rating of recipe.
