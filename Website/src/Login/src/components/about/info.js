import React, { Component } from "react";
import "./info.css";
import img1 from "./info.jpg";

function Info(){
  return (
    <div className="background-1">
      <div className="row center col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <img src={img1} alt="img"/>
      </div>
      <div className="row left col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <h1 className="info-head">About Us</h1>
        <hr className="fancy-line-1"/>
        <p className="text">Most often, we get into a situation when we want to cook something delicious, however, we are short on ingredients at our home. Many times we see an image of a delicious looking dish and want to try it out, but we don't know how to cook it.<br/><br/>We, at RecipeBowl, aim to make a user aware of the various dishes which can be cooked from available set of ingredients being input by a user. There may be times when a person desires for new, delicious, healthy, or maybe presentable cuisines and above all it necessarily be homemade as the possibilities to get one from outside might be restricted like in recent pandemic period (Covid-19).</p>
      </div>
    </div>
  );
  }

export default Info;
