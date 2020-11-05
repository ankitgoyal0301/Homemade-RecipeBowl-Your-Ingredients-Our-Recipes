import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import Home from './components/pages/Home.js';
import About from './Login/src/about.js';
import Signup from './Login/src/App.js';
import Dashboard from './Login/src/components/userPage/profile.js';
import { FooterContainer } from './containers/footer';

function App() {	
	return (
		<div>
			<Router>

				<Navbar />

				<Switch>
					<Route path='/' exact component={Home} />
					<Route path='/about' exact component={About} />
					<Route path='/sign_up' exact component={Signup} />
					<Route path='/dashboard' exact component={Dashboard} />
				</Switch>

				<FooterContainer />

			</Router>
		</div>
	);
}

export default App;
