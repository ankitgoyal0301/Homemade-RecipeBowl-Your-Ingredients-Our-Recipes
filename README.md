# Homemade RecipeBowl:Your Ingredients Our Recipes

## Group - 10
**Mentor** - Poonam Saini, Faculty, Computer Science and Engineering

### Developer Team:

- Ankit Goyal - 18103018
- Krish Garg - 18103027
- Divyanshu Garg - 18103035
- Anish Agarwal - 18103039

## Documentation:

[Homemade RecipeBowl - Documentation](https://drive.google.com/file/d/1rF9SbxljkF8EDAXWviv0STYPlrrwL4gI/view?usp=sharing)

[ChefKoch Images - Dataset](https://drive.google.com/drive/folders/1uNk_TbVd__8W8HoXop1uI_SNFiRy03ip?usp=sharing)

[Cuisine Dataset - Dataset](https://drive.google.com/drive/folders/1hq0B1OVlEVXvA_ChwQVHGJD9vp7A5CKi?usp=sharing)

## Website Snapshot:

<img src="https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Videos/Project%20Demo%20gif%201.gif" alt="Input" width="100%" height="auto"> 

## Instructions:

### For running the Frontend in React:

#### Create a **new folder** for react frontend:

- Installing npm: $npm install -g create-react-app
- Creating react project: $create-react-app \&lt;project\_name\_all\_in\_lower\_case\&gt;
- Copy (by replacing) all the files in the &quot;Website&quot; folder into the newly created react project folder.
- Run the backend server (given below) in a separate command prompt.
- Activating the environment, in &quot;Website\api&quot; folder: $venv\Scripts\activate
- Return to parent folder, i.e., react project folder: $cd ..
- Running react project: $npm start

### For running the Backend server in Flask:

#### In **&quot;Website Front End\api&quot;** folder:

- Creating virtual environment, i.e. venv, : $python -m venv venv (replace already present venv folder in &quot;Website\api&quot;, if prompted)
- Activating environment : $venv\Scripts\activate
- Running flask file: $flask run --no-debugger


## Project Synopsis:

**BACKGROUND:**

Most often, we get into a situation when we want to cook something delicious, however, we are short on ingredients at our home. It also creates a lot of confusion about what to cook with the available ingredients. Further, we might not have accessibility to more ingredients from the nearby market due to various reasons like non-availability or specifically the unprecedented times as Covid which has resulted in shutdowns. Finally, we are bound at home to make the best possible dish from leftover ingredients. Our project aims to make a user aware of the various dishes which can be cooked from the available set of ingredients being input by a user.

<img src="https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Images/Cook.jpg" width="50%" height="50%">

**MOTIVATION:**

Our project aims to make a user aware of the various dishes which can be cooked from the available set of ingredients being input by a user. There may be times when a person desires new, delicious, healthy or maybe presentable cuisines and above all, it necessarily is homemade as the possibilities to get one from outside might be restricted like in the recent pandemic period (Covid-19). An optimal solution to this could be the design of an application wherein the user will be capable of exploring and preparing several new dishes which include those ingredients. Therefore, a system could be designed that could actually take ingredients as the input and generates the best-matched recipe from an exhaustive list of most matching recipes.

In addition, this project would be a great platform for people to learn and expand their knowledge in the field of cooking. Moreover, it will help in exploring and spreading the taste of one region worldwide. It will also bring innovation to the art of cooking. Our motivation is not only restricted to these merits but also includes more information about nutrition for respective recipes. Nutrition and health being the most important aspects of one&#39;s life are also one of the most neglected areas. This project will also ensure that a user is aware of his/her food intake value and thus plan to explore and make healthier meals.

**What is Homemade RecipeBowl:**

<img src="https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Images/Homemade-Recipebowl.png" width="35%" height="35%">

We aim to make a user aware of the various dishes which can be cooked from available set of ingredients or an input image given by a user.
Thus, systems like this never get their place in real life. We’ve developed a Recipe Generation model by applying Neural Network on it. The tools used for developing the project are Python, React, CSS, JavaScript & Flask.
- A dynamic website incorporating machine learning techniques.
- Search options:
  - Search by Ingredients
  - Search by food image
  - Search by cuisine
- Output: self generated recipes
- It is a recipe generator system and not a recommender system!!!
- An additional feature for sharing food related content in the form of posts.

**Problem Statement**

A lot of times, we are in a situation when we want to cook something delicious but we are short on ingredients at our home and we are confused about what to cook with the ingredients we have. We might be in a situation where either we don’t have any means to get ingredients from the market, or we are bound to stay at home. Just as we did in this COVID-19 pandemic situation, where we stayed in our homes for months in complete lockdown. We feel helpless in such a situation.

<img src="https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Images/Cook-confused.jpg" width="20%" height="20%">

In such a situation we keep on searching for recipes that match our ingredients online, but hardly get any results and that too takes a lot of time, and ultimately we return to our kitchen disappointed. There’s a need for a system that could actually take ingredients as the input and give us the list of most matching recipes that could help us make delicious food at our homes.
- What already exists:
  - Recipes-by-name search system
  - Recipes recommender search system
- Existing Problems:
  - No Recipes-by-Ingredients search system
  - No Recipes-by-Images search system
  - No Ingredients-Recipe and Image-Recipe datasets.
- Our Contribution:
  - Scraped Ingredients-Recipe and Image-Recipe datasets.
  - Training Image-to recipes model using Convolutional Neural Network
  - Recipe generator using character-level RNN text generation ML technique.

Following is our approach divided into different phases about the solution of the problem.

<img src="https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Images/Workflow.PNG">

<img src="https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Images/Flow%20chart%201.png">

## WEB APPLICATION:

**Website Homepage:**

The website first opens up the homepage, which is the central point of use for the user. There are three options available here: Recipe by Ingredients, Recipe by Image & Recipe by Cuisine.

<img src="https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Images/Homepage1.png">
<img src="https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Images/Homepage2.png">

**Login:**

The user can login with his Username and Password.

<img src="https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Images/login1.png">

Also, they can sign up or register if they don’t have an account already.

<img src="https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Images/login2.png">

**Dashboard:**

After user login, we can open the dashboard. Here the user can change the profile picture, change password, change bio, and view his/her favorite Recipes and his/her posts.

<img src="https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Images/dashboard1.png">
<img src="https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Images/dashboard2.png">
<img src="https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Images/dashboard3.png">

**Feed for Sharing your Ideas, recipes and many more in the form of Posts:**

Now here’s something which made our project even more interesting. As you all must have seen feed in all social media platforms, we thought why not to add the same in our website, but in a different context. Here, people can share food related memes, recipes, images, and can also comment on one-another's post. A Random recipe is also shown in the feed using an API.

<img src="https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Images/feed1.png">
<img src="https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Images/feed2.png">

**Prediction Time:**

Now let’s give ingredients input to the website and get the generated recipes as output.

<img src="https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Images/prediction-time.png">

After getting the desired results:

<img src="https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Images/prediction-time2.png">
<img src="https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes/blob/master/Documentation/Images/prediction-time3.png">

## DISCUSSION:

Through this project, we have made a system that has the potential to generate recipes out of the given set of ingredients. Also, this project has the potential to get implemented in different parts of the world helping users with making delicious recipes at their disposal.

Also, the image to recipe feature can be widely used to help generate the recipes of the most delicious looking recipe images.

Also, As you all must have seen feed in all social media platforms, we thought why not to add the same in our website, but in a different context. Here, people can share food related memes, recipes, images, and can also comment on one-another's post.


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
- Created the Github Repository for the project - [Homemade Recipebowl](https://github.com/ankitgoyal0301/Homemade-RecipeBowl-Your-Ingredients-Our-Recipes)

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

**Week 10** : (12 October 2020 - 18 October 2020)

**Developing the Website backend and Integrating with front end:**

- Developing the website’s backend using the Flask framework of python.
- Started integrating the frontend and the backend.
- Continued with the frontend of the website.
- Updated the Project SRS according to further scope of the project.

---

**Week 11** : (19 October 2020 - 25 October 2020)

**Exploring Image-to-Recipe datasets and websites for scrapping (if required):**

- Could not get the most diverse MIT dataset from the given portal (portal wasn’t working).
- Tried exploring some other websites which could help us with the Image to Recipes training process.
    - Chefkoch (has multiple images for many single recipes)
- Started the scraping of the dataset

---

**Week 12** : (26 October 2020 - 1 November 2020)

**Completed scrapping and started preparing model training code:**

- Completed the scrapping process of ChefKoch website.
- Started development of the model training code using CNNs for image identification and RNNs for recipe generation, and achieved an accuracy of about 93.56% using our ChefKoch scraped dataset.
- Continued development of website by adding certain features to it(login page).
- Started scraping websites to get dataset for Cuisine-to-Recipe.

---

**Week 13-14** : (2 November 2020 - 15 November 2020)

**Added features like Login page and user dashboard:**

- Developed the website’s front end using the React framework.
- Added additional features like login page & user dashboard.
- Integrated front end components with each other.
- Integrated front end with image-to-recipe and cuisine-to-recipe feature.

---

**Week 15-16** : (16 November 2020 - 29 November 2020)

**Added User Favourite Recipes feature and fixed some minor bugs:**

- Developed the website’s front end using the React framework.
- Added features like favourite recipe bookmark and about us section.
- Fixed minor bugs like automatic page refreshing in Image-to-recipe feature, state update in the React component and many more.

---

**Week 17-18** : (30 November 2020 - 13 December 2020)

**Developed the feed feature which contains self and other user’s posts:**

- Created a left panel having shortcuts to jump to components like My Posts, My Favorites, My Dashboard and Change Password.
- Designed the right panel of the feed which contains the posts of the other users along with the current user.
- Added the facility to upload a relevant image along with the text.
- Added a feature to comment on the posts.

---

## Future Plan

**CURRENT BUGS / CHALLENGES:**

- The Ingredients-to-Recipe generator produces some irrelevant outputs sometimes.

**FURTHER SCOPE:**

- Getting access of MIT dataset and training the Ingredients-to-Recipe generator to improve it further.
- The Post’s feed can be further developed to recommend posts based on user’s choices.
- Discussion forum for Q/A among the users.
- Peer to peer direct chat communication.
