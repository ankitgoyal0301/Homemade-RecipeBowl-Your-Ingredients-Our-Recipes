import React, { Component } from "react";
import "./team.css";
import img1 from "./developers/dv.jpg";
import img2 from "./developers/ankit.png";
import img3 from "./developers/krish.jpg";
import img4 from "./developers/anish.jpg";

function team(){
  return (
    <div className="background-2">
      <div className="center">
        <h1 className="feature-head">Meet Our Team</h1>
        <hr className="fancy-line"/>
      </div>
      <div className="row center col-xs-12 col-sm-6 col-md-6 col-lg-3">
          <img className="developer" src={img1} alt="img"/>
          <h3>Divyanshu Garg</h3>
          <p>Developer</p>
          <a className="linkedin" href="https://in.linkedin.com/in/divyanshu-garg-149b441a9">LinkedIn</a>
      </div>
      <div className="row center col-xs-12 col-sm-6 col-md-6 col-lg-3">
          <img className="developer" src={img2} alt="img"/>
          <h3>Ankit Goyal</h3>
          <p>Developer</p>
          <a className="linkedin" href="https://in.linkedin.com/in/ankit-goyal-07017a182">LinkedIn</a>
      </div>
      <div className="row center col-xs-12 col-sm-6 col-md-6 col-lg-3">
          <img className="developer" src={img3} alt="img"/>
          <h3>Krish Garg</h3>
          <p>Developer</p>
          <a className="linkedin" href="https://in.linkedin.com/in/krish-garg-8a3a11190">LinkedIn</a>
      </div>
      <div className="row center col-xs-12 col-sm-6 col-md-6 col-lg-3">
          <img className="developer" src={img4} alt="img"/>
          <h3>Anish Aggarwal</h3>
          <p>Developer</p>
          <a className="linkedin" href="https://in.linkedin.com/in/anish-aggarwal-4546841a5">LinkedIn</a>
      </div>
    </div>
  );
  }

export default team;
