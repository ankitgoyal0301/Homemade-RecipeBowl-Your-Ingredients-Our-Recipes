import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './section-1.css';
import ReactDOM from "react-dom";

function Section1(){
  return (
    <div className='new-container'>
      <video src='/videos/video.mp4' autoPlay loop muted />

      <h1 className="website-name">RecipeBowl</h1>
      <h1 className="tagline">Your Ingredients</h1>
      <h1 className="tagline">Our Recipes!</h1>

      {/*<p>Do you have limited ingredients, and don't know what to cook?<br/> Do you have an image of a delicious looking dish and want to cook it, and don't know where to start from?</p>
      <p>Don't worry, You are at the right place! Provide us with the ingredients or the image of recipe, and we will generate the tastiest resipes for you!</p>*/}
    </div>
  );
}


export default Section1;
