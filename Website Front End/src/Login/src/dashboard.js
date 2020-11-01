import React from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import "./App.scss";
import Login from "./components/login/login";
import Register from "./components/login/register";
import Navbar from "./components/Navbar";
import "./components/Navbar.css";
import { FooterContainer } from './containers/footer';
import Profile from "./components/userPage/profile";

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
          <div >
            <Navbar/>
          </div>

          <div style={{marginBottom:"700px"}}>
            <Profile/>
          </div>

          <div>
            <FooterContainer/>
          </div>
        </Router>
      </div>
    );
}

export default DashBoard;
