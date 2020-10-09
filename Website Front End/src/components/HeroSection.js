import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';

function HeroSection() {
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
    </div>
  );
}

export default HeroSection;
