import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import Home from './components/pages/Home.js';

function App() {

	const [currentTime, setCurrentTime] = useState(0);

	  useEffect(() => {
	    fetch('/api/time').then(res => res.json()).then(data => {
	      setCurrentTime(data.time);
	    });
	  }, []);

	return (
		<>
		<Router>
			<Navbar />
			<Switch>

			{/*}

				<Route path='/' exact component={Home}>	          
	                <p>The current time is {currentTime}.</p>
            	</Route>

            */}

				<Route path='/' exact component={Home} />
			</Switch>
		</Router>
		</>
	);
}

export default App;