import React, { Component } from "react";
import "./features.css";
import img1 from "./ing2rec.png";
import img2 from "./img2rec.png";
import img3 from "./cuisine.jpg";

function features(){
  return (
    <div className="background">
      <div className="center">
        <h1 className="feature-head">Features</h1>
        <hr className="fancy-line"/>
      </div>
      <div className="row center col-xs-12 col-sm-6 col-md-4 col-lg-4">
          <img className="img" src={img1} alt="img"/>
          <h3>Ingredients to Recipe</h3>
          <p>Do you have limited ingredients, and don't know what to cook?</p>
      </div>
      <div className="row center col-xs-12 col-sm-6 col-md-4 col-lg-4">
          <img className="img" src={img2} alt="img"/>
          <h3>Image to Recipe</h3>
          <p>Do you have an image of a delicious looking dish and want to try it out, and don't know where to start from?</p>
      </div>
      <div className="row center col-xs-12 col-sm-6 col-md-4 col-lg-4">
          <img className="img" src={img3} alt="img"/>
          <h3>Different Cuisines</h3>
          <p>Do you want to try out delicious recipes of your favorite Cuisine?</p>
      </div>
    </div>
  );
  }

export default features;
