import React, { Component,useState, useEffect } from 'react';
import '../App.css';
import { Button } from './Button';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './HeroSection.css';
import ReactDOM from "react-dom";
import Cards from './Cards';

var curr_state = 0;

function ButtonsAndSearchbox(props)
{
     curr_state = props.curr_state1;

     const [recipes, setRecipes] = useState([]);
     const [uploadInput, setUploadInput] = useState();
     const [recipes1, setRecipes1] = useState([]);

     async function handleSubmit (event)
     {
          event.persist();
          console.log("making request");
          console.log(event.target[0].value);
          const response = await fetch('/', {
               method: "POST",
               headers: {
               'Content-type': 'application/json'
               },
               body: JSON.stringify(event.target[0].value),
          });

          const json = await response.json();
          console.log(json);
          setRecipes(json[0]);
     }

     async function handleUploadImage(event) {
          event.persist();
          event.preventDefault();

          const data = new FormData();
          data.append('file', uploadInput.files[0]);

          const response = await fetch('/fb', {
               method: 'POST',
               body: data,
          });

          const json = await response.json();
          console.log(json);
          setRecipes1(json[0]);
     }

     useEffect(() => {}, [recipes]);
     useEffect(() => {}, [uploadInput]);
     useEffect(() => {}, [recipes1]);

     function updateState (new_state)
     {
          curr_state = new_state;
     }
     
     if(curr_state==0)
     {
          return (
               <div>
                    <div className='hero-btns'>
                         <Button
                         className='btns'
                         buttonStyle='btn--outline'
                         buttonSize='btn--large'
                         onClick={() => updateState(1)}
                         >BY INGREDIENTS</Button>

                         <Button
                         className='btns'
                         buttonStyle='btn--outline'
                         buttonSize='btn--large'
                         onClick={() => updateState(2)}
                         >BY IMAGE</Button>

                         <Button
                         className='btns'
                         buttonStyle='btn--outline'
                         buttonSize='btn--large'
                         onClick={() => updateState(3)}
                         >BY CUISINE</Button>
                    </div>
               </div>
          );
     }

     if(curr_state==1)
     {
          return (
               <div>
                    <div className='hero-btns'>
                         <Button
                         className='btns'
                         buttonStyle='btn--outline'
                         buttonSize='btn--large'
                         onClick={() => updateState(1)}
                         >BY INGREDIENTS</Button>

                         <Button
                         className='btns'
                         buttonStyle='btn--outline'
                         buttonSize='btn--large'
                         onClick={() => updateState(2)}
                         >BY IMAGE</Button>

                         <Button
                         className='btns'
                         buttonStyle='btn--outline'
                         buttonSize='btn--large'
                         onClick={() => updateState(3)}
                         >BY CUISINE</Button>
                    </div>

                    <div>
                         <form className="box" action="javascript:void(0);" onSubmit={handleSubmit} method="POST">
                              <input className="hero-input" type="text" name="ingredients" placeholder="Ingredients..." />
                              <button className="hero-button" type="submit"> Submit </button>
                         </form>
                    </div>
               </div>
          );
     }

     if(curr_state==2)
     {
          return (
               <div>
                    <div className='hero-btns'>
                         <Button
                         className='btns'
                         buttonStyle='btn--outline'
                         buttonSize='btn--large'
                         onClick={() => updateState(1)}
                         >BY INGREDIENTS</Button>

                         <Button
                         className='btns'
                         buttonStyle='btn--outline'
                         buttonSize='btn--large'
                         onClick={() => updateState(2)}
                         >BY IMAGE</Button>

                         <Button
                         className='btns'
                         buttonStyle='btn--outline'
                         buttonSize='btn--large'
                         onClick={() => updateState(3)}
                         >BY CUISINE</Button>
                    </div>

                    <div>
                         <form action="javascript:void(0);" onSubmit={handleUploadImage}>
                              <div>
                                   <input ref={(ref) => { setUploadInput(ref) }} type="file" />
                                   <button>Upload</button>
                              </div>
                         </form>
                    </div>
               </div>
          );
     }

     if(curr_state==3)
     {
          return (
               <div>
                    <div className='hero-btns'>
                         <Button
                         className='btns'
                         buttonStyle='btn--outline'
                         buttonSize='btn--large'
                         onClick={() => updateState(1)}
                         >BY INGREDIENTS</Button>

                         <Button
                         className='btns'
                         buttonStyle='btn--outline'
                         buttonSize='btn--large'
                         onClick={() => updateState(2)}
                         >BY IMAGE</Button>

                         <Button
                         className='btns'
                         buttonStyle='btn--outline'
                         buttonSize='btn--large'
                         onClick={() => updateState(3)}
                         >BY CUISINE</Button>
                    </div>
               </div>
          );
     }

}

export default ButtonsAndSearchbox;
export { curr_state };