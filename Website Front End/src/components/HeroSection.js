import React, { Component,useState, useEffect } from 'react';
import '../App.css';
import { Button } from './Button';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './HeroSection.css';
import ReactDOM from "react-dom";
import Cards from './Cards';


var recipes_list = [];

function HeroSection()
{
  const [recipes, setRecipes] = useState([]);

  async function handleSubmit (event)
  {
    event.persist();
    console.log("making request");
    console.log(event.target[0].value);
    const response = await fetch('/', {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(event.target[0].value),
    });

    const json = await response.json();
    console.log(json);
    setRecipes(json[0]);
  }

  useEffect(() => {
    
  }, [recipes]);

  return (
    <div>
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
            BY CUISINE
          </Button>
        </div>

        <form className="box" action="javascript:void(0);" onSubmit={handleSubmit} method="POST">
    
            <input className="hero-input" type="text" name="ingredients" placeholder="Ingredients..." />
            <button className="hero-button" type="submit"> Submit </button>

        </form>
      </div>
      <div>
        <Cards recipes={recipes}/>
      </div>
    </div>
  );
}

export default HeroSection;
export { recipes_list };


// class HeroSection extends Component {

//   constructor()
//   {
//     super();
//     this.state = { data: [] };
//   }

//   const handleSubmit = async (event) => {
//     console.log("making request");
//     //console.log(event.target[0].value)
//     const response = await fetch('/', {
//       method: "POST",
//       headers: {
//         'Content-type': 'application/json'
//       },
//       body: JSON.stringify(event.target.value),
//     });

//     const json = await response.json();
//     console.log(json);
//   }

//   render()
//   {
//     recipes = [...this.state.data];
//     console.log(this.state.data);
//     console.log(recipes);
//     return (

//       <div className='hero-container'>
//         <video src='/videos/video.mp4' autoPlay loop muted />
        
//         <h1>Your Ingredients</h1>
//         <h1>Our Recipes!</h1>

//         <p>How do you want to search?</p>

//         <div className='hero-btns'>
//           <Button
//             className='btns'
//             buttonStyle='btn--outline'
//             buttonSize='btn--large'
//           >
//             BY INGREDIENTS
//           </Button>

//           <Button
//             className='btns'
//             buttonStyle='btn--outline'
//             buttonSize='btn--large'
//           >
//             BY IMAGE
//           </Button>

//           <Button
//             className='btns'
//             buttonStyle='btn--outline'
//             buttonSize='btn--large'
//           >
//             BY CUISINE
//           </Button>
//         </div>

//         <form className="box" onSubmit=handleSubmit method="POST" target="_blank">
    
//             <input type="text" name="ingredients" placeholder="Ingredients..." />
//             <button type="submit"> Submit </button>

//         </form>

//       </div>
//     );
//   }

//   async componentDidMount() {
//     // const response = fetch('/second');
//     // const json = response.json();
//     // this.setState({ data: json[0] });
//     // fetch('/')
//     //   .then(response => response.json())
//     //   .then(data => this.setState({ data: data[0] }));

//     // const response = await fetch('/second');
//     // const json = await response.json();
//     // this.setState({ data: json[0] });
    
    
//   }

//   //render called again with updated values
  
// }






//import { Form, Input, Button } from 'semantic-ui-react';


// //   useEffect(async () => {
  //   await fetch('/second').then(res => res.json()).then(data => {
  //     setCurrentTime
  //     (
  //       {
  //         author: data.author,
  //         title: data.title,
  //         content: data.content,
  //         date_posted: data.date_posted,
  //       }
  //     );

  //   });
    
  // }, []);