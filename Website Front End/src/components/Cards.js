import React, { Component } from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards (props)
{
  return (
    props.recipes.map(ele => (
      <div className='card'>
        <div className='header'>
          <h2>{ele.author}</h2>
        </div>

        <div className='row'>

          <div className='avatar-container'>
            <div className='photo'>
              <img className='img' src='images/i1.png' />
            </div>
          </div>

          <div className='details-container'>
            <div className='content'>
              <h3>INGREDIENTS:</h3>
              <p>{ele.title}</p>
            </div>
          </div>

        </div>
      </div>
    ))
    
  );
}


export default Cards;

// <div className='cards'>
//   <div className='cards__container'>
//     <div className='cards__wrapper'>
//       {
//         props.recipes.map(ele => (
//         <ul className='cards__items'>
//           <CardItem
//             src='images/i1.png'
//             text='{ele.title}qqqqqqqqqqqqqqq'
//             label='{ele.author}'
//             path='/services'
//           />
//         </ul>
//         ))    
//       }
//     </div>
//   </div>          
// </div>