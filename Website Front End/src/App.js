import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import Home from './components/pages/Home.js';
import { FooterContainer } from './containers/footer';

function App() {	

	return (
		<div>
			<Router>

				<Navbar />

				<Switch>
					<Route path='/' exact component={Home} />
				</Switch>

				<FooterContainer />

			</Router>
		</div>
	);
}

export default App;
