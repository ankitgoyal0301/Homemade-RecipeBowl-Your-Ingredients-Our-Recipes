import React, { useState, useEffect } from 'react';
import '../App.css';
import { Button } from './Button';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './HeroSection.css';
//import { Form, Input, Button } from 'semantic-ui-react';

function HeroSection() {


  const [currentTime, setCurrentTime] = useState({author: 'a',
                        title: 'b',
                        content: 'c',
                        date_posted: 'd'});

  useEffect(async () => {


    await fetch('/second').then(res => res.json()).then(data => {
      setCurrentTime
      (
        {
          author: data.author,
          title: data.title,
          content: data.content,
          date_posted: data.date_posted,
        }
      );

    });
    
  }, []);

  
 
  
  return (

    <div className='hero-container'>
      <video src='/videos/video.mp4' autoPlay loop muted />

      <h1>Your Ingredients</h1>
      <h1>Our Recipes!</h1>

      <p>How do you want to search?</p>

      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          BY INGREDIENTS
        </Button>

        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          BY IMAGE
        </Button>

        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          BY COUSINE
        </Button>
        </div>

        <div className='box'>      


        <form  action="/" method="post" target="_blank">
    
            <input type="text" name="ingredients" placeholder="Ingredients" />
            <button type="submit"> Go </button>

        </form>

        
            <div className='hero-container-2'>
            
              <p>The current time is {currentTime.author}.</p>
              <p>The current time is {currentTime.title}.</p>
            </div>
          

      </div>
    </div>
  );
}

export default HeroSection;
