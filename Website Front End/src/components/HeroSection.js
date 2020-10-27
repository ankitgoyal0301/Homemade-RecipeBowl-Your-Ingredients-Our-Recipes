import React, { Component } from 'react';
import '../App.css';
import { Button } from './Button';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './HeroSection.css';
import ReactDOM from "react-dom";
import Cards from './Cards';

//import { Form, Input, Button } from 'semantic-ui-react';


// function HeroSection() {

//   const [currentTime, setCurrentTime] = useState({author: 'a',
//                         title: 'b',
//                         content: 'c',
//                         date_posted: 'd'});

//   useEffect(async () => {


//     await fetch('/second').then(res => res.json()).then(data => {
//       setCurrentTime
//       (
//         {
//           author: data.author,
//           title: data.title,
//           content: data.content,
//           date_posted: data.date_posted,
//         }
//       );

//     });
    
//   }, []);

class HeroSection extends Component {

  constructor()
  {
    super();
    this.state = { data: [] };
  }

  render()
  {
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
            BY CUISINE
          </Button>
        </div>

        <form className="box" action="/" method="POST" target="_blank">
    
            <input type="text" name="ingredients" placeholder="Ingredients..." />
            <button type="submit" > Submit </button>

        </form>

        <div>
          <Cards recipes={this.state.data}/>        
        </div>
       
      </div>
    );
  }

  async componentDidMount() {
    // const response = fetch('/second');
    // const json = response.json();
    // this.setState({ data: json[0] });
    // fetch('/')
    //   .then(response => response.json())
    //   .then(data => this.setState({ data: data[0] }));

    const response = await fetch('/second');
    const json = await response.json();
    this.setState({ data: json[0] });
    
  }

  //render called again with updated values
  
}

export default HeroSection;
