import React, { Component } from 'react';
import './Cards.css';
import CardItem from './CardItem';



function Cards() {
  return (
    <div className='cards'>
      <h1>Check Out These Fabulous Cuisines!</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>

          <ul className='cards__items'>
            <CardItem
              src='images/i1.png'
              text='This is dummy card as of now. Further functionality will be added soon'
              label='NORTH INDIAN'
              path='/services'
            />
            <CardItem
              src='images/i2.png'
              text='This is dummy card as of now. Further functionality will be added soon'
              label='SOUTH INDIAN'
              path='/services'
            />
          </ul>
         
          <ul className='cards__items'>
            <CardItem
              src='images/i4.png'
              text='This is dummy card as of now. Further functionality will be added soon'
              label='CHINESE'
              path='/services'
            />

            <CardItem
              src='images/i3.png'
              text='This is dummy card as of now. Further functionality will be added soon'
              label='ITALIAN'
              path='/products'
            />
            <CardItem
              src='images/i5.png'
              text='This is dummy card as of now. Further functionality will be added soon'
              label='CARIBBEAN'
              path='/sign-up'
            />
          </ul>

         
         
        </div>
      </div>
    </div>
  );
}

export default Cards;