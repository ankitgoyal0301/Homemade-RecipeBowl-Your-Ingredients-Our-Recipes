import React, { Component,useState, useEffect } from 'react';
import '../App.css';
import { Button } from './Button';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './HeroSection.css';
import ReactDOM from "react-dom";
import Cards from './Cards';
import Testimonials from "./testimonials";
import Features from "../Login/src/components/about/features"

var cuisine_list = ['African', 'Asian', 'Australian', 'Canadian', 'Chineese', 'European', 'French', 'Indian', 'Italian', 'Japanese', 'Korean', 'American', 'Mediterranean', 'Mexican', 'Eastern', 'Thai', 'USA'];
var temp = JSON.parse(localStorage.getItem('recipe_list')) || [];

function HeroSection()
{
     const [recipes, setRecipes] = useState(temp);
     const [uploadInput, setUploadInput] = useState();
     const [currState, setCurrState] = useState(0);
     const [cuisine, setCuisine] = useState("");
     const [isLoggedIn, setIsLoggedIn] = useState(false);
     const [userName, setUserName] = useState("");
     const [invalid, setInvalid] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
     const [ingInvalidInput, setIngInvalidInput] = useState(false);


     var btn1 = false;
     var btn2 = false;
     var btn3 = false;

    function hasNumber(myString) {
      return /\d/.test(myString);
    }



     async function handleSubmit (event)
     {
        if(event.target[0].value.length === 0 || hasNumber(event.target[0].value)){
            setIngInvalidInput(true);
        }
        else{
            setIngInvalidInput(false);


        localStorage.setItem("recipe_list", JSON.stringify([]));

          setIsLoading(true);
          setInvalid(false);
          event.persist();
          console.log("making request");
          console.log(event.target[0].value);

          const response = await fetch('/ingredient', {
           method: "POST",
           headers: {
             'Content-type': 'application/json'
           },
           body: JSON.stringify(event.target[0].value),
          });

          const json = await response.json();
          console.log(json);

          var temp1 = json[0];


          // localStorage.setItem("recipe_list", JSON.stringify(json[0]));
          // setRecipes(temp1);

          const response2 = await fetch('/ingredient', {
           method: "POST",
           headers: {
             'Content-type': 'application/json'
           },
           body: JSON.stringify(event.target[0].value),
          });

          const json2 = await response2.json();
          console.log(json2);


          temp1 = temp1.concat(json2[0]);
          setRecipes(temp1);

          localStorage.setItem("recipe_list", JSON.stringify(temp1));

          if(temp1.length === 0){
            setInvalid(true);
          }
          setIsLoading(false);
      }
     }

     const getBase64 = (file) => {
      return new Promise((resolve,reject) => {
         const reader = new FileReader();
         reader.onload = () => resolve(reader.result);
         reader.onerror = error => reject(error);
         reader.readAsDataURL(file);
      });
    }

     async function handleUploadImage(event)
     {
       if(ingInvalidInput === true){
        setIngInvalidInput(false);
      }
        localStorage.setItem("recipe_list", JSON.stringify([]));
          setIsLoading(true);
          setInvalid(false);
          event.persist();
          // event.preventDefault();

          const data = new FormData();
          data.append('file', uploadInput.files[0]);

          const file = uploadInput.files[0];
          getBase64(file).then(base64 => {
            localStorage["fileBase64"] = base64;
            console.debug("file stored",base64);
            console.log("file stored",base64);
          });

          const response = await fetch('/image', {
               method: 'POST',
               body: data,
          });

          const json = await response.json();
          console.log(json);
          setRecipes(json[0]);
          localStorage.setItem("recipe_list", JSON.stringify(json[0]));

          if(json[0].length === 0){
            console.log("Invalid")
            setInvalid(true);
          }
          setIsLoading(false);
     }

     async function handleChange (event)
     {
       console.log(cuisine);
       if(cuisine === "blank" || cuisine === ""){
       }
       else{
        setIngInvalidInput(false);
        localStorage.setItem("recipe_list", JSON.stringify([]));
          setIsLoading(true);
          event.persist();
          console.log("making request");
          console.log(cuisine);
          const response = await fetch('/cuisine', {
           method: "POST",
           headers: {
             'Content-type': 'application/json'
           },
           body: JSON.stringify(cuisine),
          });

          const json = await response.json();
          console.log(json);
          setRecipes(json[0]);
          localStorage.setItem("recipe_list", JSON.stringify(json[0]));
          setIsLoading(false);
        }
     }

     function onClickSearchbox()
     {
          if(currState==1)
          {
               return (
                    <div>
                         <form action="javascript:void(0);" onSubmit={handleSubmit} method="POST">
                                <input className="hero-input" type="text" name="ingredients" placeholder="Ingredients..." />
                                <button className="hero-button" type="submit"> Submit </button>
                         </form>
                    </div>
               );
          }

          if(currState==2)
          {

               return (
                    <div>
                       <form action="javascript:void(0);" onSubmit={handleUploadImage}>
                            <div>
                                 <input className="custom-file-input" ref={(ref) => { setUploadInput(ref) }} type="file" accept="image/*" required/>
                                 <button className="hero-button2">Upload</button>
                            </div>
                       </form>
                    </div>
               );
          }

          if(currState==3)
          {
               return (
                    <form onSubmit={handleChange} action="javascript:void(0);" method="POST">
                              <select className='select-class' onChange={onCuisineChange} name="cars" id="cars" required>
                                   <option value="blank" selected="selected">Choose a Cuisine</option>
                                   {cuisine_list.map(ele => (
                                        <option value={ele}>{ele}</option>
                                   ))}
                              </select>
                         <input className="hero-button3" type="submit" value="Submit"/>
                    </form>
               )
          }
     }

     function updateState(new_state)
     {
          setInvalid(false);
          setIngInvalidInput(false);
          setCurrState(new_state);
     }

     function onCuisineChange(event) { setCuisine(event.target.value);}

     useEffect(() => {}, [recipes]);
     useEffect(() => {}, [uploadInput]);
     useEffect(() => {}, [currState]);
     useEffect(() => {}, [cuisine]);
     useEffect(() => {}, [isLoading]);
     useEffect(() => {}, [invalid]);

     return (
          <div>
               <div className='hero-container'>
                    <video src='/videos/video.mp4' autoPlay loop muted />

                    <h1>Your Ingredients</h1>
                    <h1>Our Recipes!</h1>

                    <p>How do you want to search?</p>

                    <div className='hero-btns'>
                         <Button
                         className='btns'
                         buttonStyle='btn--outline'
                         buttonSize='btn--large'
                         onClick={() => updateState(1)}
                         isSelected={btn1}
                         >
                         BY INGREDIENTS
                         </Button>

                         <Button
                         className='btns'
                         buttonStyle='btn--outline'
                         buttonSize='btn--large'
                         onClick={() => updateState(2)}
                         isSelected={btn2}
                         >
                         BY IMAGE
                         </Button>

                         <Button
                         className='btns'
                         buttonStyle='btn--outline'
                         buttonSize='btn--large'
                         onClick={() => updateState(3)}
                         isSelected={btn3}
                         >
                         BY CUISINE
                         </Button>
                    </div>

                    <div>{onClickSearchbox()}</div>
                    <div>
                       {isLoading === true ? <h1 style={{position:"relative" ,paddingTop:"15%" ,color:"white"}} className="tc">Loading...</h1>:null}
                    </div>

                    <div>
                         {ingInvalidInput === true ? <h1 style={{position:"relative" ,paddingTop:"15%" ,color:"white"}} className="tc">Invalid Input!</h1>:null}
                    </div>
                </div>

                <div>
                     {invalid === true ? <h1 className="tc">No Recipes Found!</h1>:null}
                </div>

                <div>
                    {recipes.length>0 ? (
                     <div className="center back-color">
                      <h1 className="testimonial-head">Recipes</h1>
                      <hr className="fancy-line"/>
                    </div>) :null}
                </div>

                <div>
                     <Cards recipes={recipes}/>
                </div>

                <div>
                    <Features/>
                </div>

                <div>
        			<Testimonials />
        		</div>

          </div>
     );
}

export default HeroSection;
