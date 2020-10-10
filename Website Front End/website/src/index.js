import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'tachyons';
import { FooterContainer } from './containers/footer';
import { GlobalStyles } from './global-styles'



ReactDOM.render(
	<div>
		<App />
		{/*<GlobalStyles /> */}
		<FooterContainer />		
	</div>,
  document.getElementById('root')
);