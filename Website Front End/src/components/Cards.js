import React, { Component } from 'react';
import './Cards.css';
import CardItem from './CardItem';

<<<<<<< HEAD
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
=======


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
>>>>>>> f03c7ec8a520ebac7a3371bf3cf158a696559988
      </div>
    );
  }


export default Cards;