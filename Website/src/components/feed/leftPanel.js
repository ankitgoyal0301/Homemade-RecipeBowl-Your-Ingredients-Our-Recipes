import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { StickyContainer, Sticky } from 'react-sticky';

var login = localStorage.getItem('loggedIn');
var userName = localStorage.getItem('username');

function LeftPanel() {

	const[username, setUsername] = useState(userName);
  const[email, setEmail] = useState("");
  const[bio, setBio] = useState("");
	const[fetched, setFetched] = useState("false");
	const [image, setImage] = useState("");

	const[randomRecipe, setRandomRecipe] = useState({});

	async function fetchUserDetails(){
    //console.log("Ankit");
    const response = await fetch('/profile-stats', {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(username),
    });

      var temp = await response.json();
      setEmail(temp.email);
      setBio(temp.bio);
      setImage(temp.image);

			// fetch("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/jokes/random", {
			// 	"method": "GET",
			// 	"headers": {
			// 		"x-rapidapi-key": "4d6291d918mshcdd8a00f2f0e5fap1f304fjsn8ae41089f22d",
			// 		"x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
			// 	}
			// })
			// .then(response => {
			// 	console.log(response);
			// })
			// .catch(err => {
			// 	console.error(err);
			// });
			var tempRec = "";
			var tempName = "";
			do{
				const response1 = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
	      const json1 = await response1.json();
	      console.log(json1["meals"][0]);

				tempRec = json1["meals"][0]["strYoutube"];
				tempName = json1["meals"][0]["strMeal"];
				if(tempRec.length > 0 && tempName.length <=20){
						setRandomRecipe(json1["meals"][0]);
				}
			}while(tempRec.length <= 0 || tempName.length >20);
  }

  function fetchUserDetailsCall(){
    if(fetched === "false"){
      fetchUserDetails();
      setFetched("true");
    }
  }

	return (
		<div style={{paddingTop:"20%"}}>
			<div>{<>{fetchUserDetailsCall()}</>}</div>
			<img className="user3" src={image} alt="img"/>
			<h2 className="header2">{username}</h2>
			<p className="header-content2">{}</p>
			<hr className="fancy-line"/>

			<div className="my-profile-redirect">
				<Link to="/dashboard" className="my-profile-redirect-2">My Posts</Link>
			</div>
			<div className="my-profile-redirect">
				<Link to="/dashboard" className="my-profile-redirect-2">My Profile</Link>
			</div>
			<div className="my-profile-redirect">
				<Link to="/dashboard" className="my-profile-redirect-2">My Favorites</Link>
			</div>
			<div className="my-profile-redirect">
				<Link to="/dashboard" className="my-profile-redirect-2">Change Password</Link>
			</div>

			<div className="tc random-recipe-class" style={{paddingTop:"50%"}}>
				<h3 style={{fontSize:"30px"}}>Random Recipe</h3>
				<hr className="fancy-line"/>
				<div>
					<p style={{fontSize:"22px", paddingBottom:"0px", paddingTop:"5%", color:"black", fontFamily: "'Open Sans', sans-serif"}}>{randomRecipe["strMeal"]}</p>
					<p style={{fontSize:"1.15em"}}>Category: {randomRecipe["strCategory"]}</p>
					<a href={randomRecipe["strYoutube"]} target="_blank">
					<img className="shadow-5 random-recipe-api" style={{marginTop:"0px", borderRadius:"10%", height:"90%", width:"90%"}} src={randomRecipe["strMealThumb"]} alt="Img"/>
					</a>
				</div>
			</div>

		</div>
	)
}

export default LeftPanel;
