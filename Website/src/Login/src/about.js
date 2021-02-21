import React , {useState} from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import "./App.scss";
import Navbar from "./components/Navbar";
import "./components/Navbar.css";
import { FooterContainer } from './containers/footer';
import Section1 from "./components/about/section-1";
import Features from "./components/about/features";
import Info from "./components/about/info";
import Team from "./components/about/team";
import "./about.css"

// function App() {
  //   return (
    //     <div>
    //       <Login />
    //     </div>
    //   );
    // }

function DashBoard(){

    return (
      <div>
        <Router>
          

          <div>
            <Section1/>
          </div>

          <div>
            <Features/>
          </div>

          <div>
            <Info/>
          </div>

          <div>
            <Team/>
          </div>

          
        </Router>
      </div>
    );
}

export default DashBoard;
