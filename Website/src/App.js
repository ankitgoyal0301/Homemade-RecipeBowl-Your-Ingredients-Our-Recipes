import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import HeroSection from './components/HeroSection.js';
import Login from "./Login/src/components/login/login";
import About from './Login/src/about.js';
import Signup from './Login/src/App';
import Dashboard from './Login/src/components/userPage/profile.js';
import { FooterContainer } from './containers/footer';
import Testimonials from "./components/testimonials";
import Feed from './components/feed/feed.js';

function App() {

	if(localStorage.getItem("loggedIn")===null)
	{
		localStorage.setItem("loggedIn", "false");
		localStorage.setItem("username", "");
		localStorage.setItem("recipe_list", JSON.stringify([]));
		localStorage.setItem("redirect", "false");
	}

	return (
		<div className='App-container'>
			<Router>
				<div>
					<Navbar />
				</div>

				<div>
				<Switch>
					<Route path='/' exact component={HeroSection} />
					<Route path='/about' exact component={About} />
					<Route path='/sign_up' exact component={Signup} />
					<Route path='/dashboard' exact component={Dashboard} />
					<Route path='/feed' exact component={Feed} />
				</Switch>
				</div>

				<div>
				<FooterContainer />
				</div>

			</Router>
		</div>
	);
}

export default App;
