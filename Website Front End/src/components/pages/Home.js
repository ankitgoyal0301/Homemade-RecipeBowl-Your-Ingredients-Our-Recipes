import React, { Component,useState, useEffect } from 'react';
import '../../App.css';
import HeroSection, { recipes_list } from '../HeroSection';
import Cards from '../Cards';

function Home()
{
	return (
		<div>
			<HeroSection />
		</div>
	);
}

export default Home;
