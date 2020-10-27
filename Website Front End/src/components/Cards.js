import React, { Component } from 'react';
import './Cards.css';
import CardItem from './CardItem';

const Cards = ({recipes}) =>
  {
    return (
      <div className='cards'>
        <div className='cards__container'>
          <div className='cards__wrapper'>
            {
              recipes.map(ele => (
              <ul className='cards__items'>
                <CardItem
                  src='images/i1.png'
                  text='{ele.title}qqqqqqqqqqqqqqq'
                  label='{ele.author}'
                  path='/services'
                />
              </ul>
              ))    
            }
          </div>
        </div>          
      </div>
    );
  }


export default Cards;