import React, { Component,useState, useEffect } from 'react';
import './Cards.css';
import CardItem from './CardItem';
import image from "./image.jpg"
//import "@fortawesome/fontawesome-free/css/all.min.css";

var login = localStorage.getItem('loggedIn');
var userName = localStorage.getItem('username');

function Cards (props)
{
    const [refresh, isRefresh] = useState(false);

    async function toggle(recipe)
    {
        if(login!=="true")
        {
            window.open("/sign_up","_self");
        }
        else
        {
            if(recipe.isFavorite === "false")
            {
                recipe.isFavorite = "true";
                recipe.classname = "heartclick";

                console.log("making request");
                console.log(recipe);
                const response = await fetch('/favorites', {
                    method: "POST",
                    headers: {
                     'Content-type': 'application/json'
                    },
                    body: JSON.stringify({username:userName, recipes:recipe, set:"true"}),
                });

                const json = await response.json();
                console.log(json);

                refresh === true ? isRefresh(false) : isRefresh(true);
            }
            else
            {
                recipe.isFavorite = "false";
                recipe.classname = "heart";

                console.log("making request");
                console.log(recipe);
                const response = await fetch('/favorites', {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({username:userName, recipes:recipe, set:"false"}),
                });

                const json = await response.json();
                console.log(json);

                refresh=== true ? isRefresh(false) : isRefresh(true);
            }
        }
    }

    useEffect(() => {}, [refresh]);

    return (
    <div className='cards-container'>
        {props.recipes.map(ele => (
            <div className='tc bg-light-gray br4 pa3 dib bw4 shadow-5 card-new'>
                <div className='row-new'>

                    <div className='avatar-container-new'>
                        <div className='photo-new'>
                            <img className='img-new grow' src={ele.date_posted === "image.jpg" ? localStorage.getItem('fileBase64') : ele.date_posted} alt="img"/>
                            <h3 style={{fontSize:"20px"}}> {ele.isFavorite === "false" ? "Do you like this?" : "Added to Your Favorite Recipes"}</h3>
                            <div onClick={() => toggle(ele)} className={ele.classname}></div>
                        </div>
                    </div>

                    <div className='details-container-new'>
                        <div className='content-new'>
                            <div className='header-new'>
                                <h2>{ele.author}</h2>
                                <hr className="fancy-line"/>
                                <h3>INGREDIENTS:</h3>
                                <p>{ele.title}</p>
                                <h3>INSTRUCTIONS:</h3>
                                <p>{ele.content}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
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
