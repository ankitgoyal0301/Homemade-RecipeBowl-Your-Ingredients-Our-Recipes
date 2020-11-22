import React, {useState, useEffect} from "react";
import Cards from "../../../../components/Cards";
import "./profile.css"
import backImg from "./back-img.jpg"
import userImg from "./user-img.png"
//import "@fortawesome/fontawesome-free/css/all.min.css";

var login = localStorage.getItem('loggedIn');
var userName = localStorage.getItem('username');

function Profile() {
  const[username, setUsername] = useState(userName);
  const[email, setEmail] = useState("");
  const[bio, setBio] = useState("");
  const[bioChange, updateBio] = useState("false");
  const[password, changePassword] = useState("");
  const[passwordChange, updatePassword] = useState("false");
  const[passwordWrong, passwordWrongUpdate] = useState("false");

  const[oldPasswordCorrect, setOldPasswordCorrect] = useState("true");

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {

    async function fetchUserDetails(){
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
        setRecipes(temp.fav_recipes);
    }

    fetchUserDetails();
   });

   useEffect(() => {},[email]);
   useEffect(() => {},[bio]);
   useEffect(() => {},[recipes]); //This line leads to backend request infinite loop 

  function bioSetting(event){
    event.persist()
    if(bioChange === "true"){
      console.log(event.target[0].value);

      if(event.target[0].value.length === 0){
        console.log("Empty Bio not allowed!");
      }
      else{
        fetch('/set-bio', {
    		  method: "POST",
    		  headers: {
    		    'Content-type': 'application/json'
    		  },
    		  body: JSON.stringify({Username:username, Bio: event.target[0].value }),
    		});
        setBio(event.target[0].value);

      }
      updateBio("false");
    }
    else{
      updateBio("true");
    }
  }

  function bioFunction(){

    if(bioChange === "false"){
      return <button onClick={bioSetting} type="button" className="btn btn-outline-secondary">Change bio</button>
    }
    else{
      return (<form onSubmit={bioSetting} action="javascript:void(0);" method="POST">
          <div className="form2">
          <div className="form-group2">
          <input type=" type" className="textArea2 center" name="paragraph_text" cols="50" rows="5"/>
          <input type="submit" className="btn btn-outline-secondary center" value="Update bio" />
          </div>
        </div>
      </form>)
    }
  }

  async function passwordSetting(event){
    event.persist()

    if(password.length === 0){
      updatePassword("false");
      setOldPasswordCorrect("true");
    }

    if(passwordWrong === "true"){
      console.log("Password doesn't match!")
    }
    else if(passwordChange === "true"){
      console.log(event.target[0].value);
      console.log(event.target[1].value);

      const response = await fetch('/change-password', {
  		  method: "POST",
  		  headers: {
  		    'Content-type': 'application/json'
  		  },
  		  body: JSON.stringify({ Username:username,"old": event.target[0].value, "new": event.target[1].value }),
  		});

      var json = await response.json();

      if(json.auth === "true"){
        console.log("Successful")
        updatePassword("false");
        setOldPasswordCorrect("true");
      }
      else{
        setOldPasswordCorrect("false");
      }

    }
    else{
      updatePassword("true");
    }
  }

  useEffect(() => {},[oldPasswordCorrect]);

  function updateNewPassword(event){
    event.persist()
    changePassword(event.target.value);
  }

  function checkNewPassword(event){
    event.persist()
    if(event.target.value === password){
      passwordWrongUpdate("false");
    }
    else{
      passwordWrongUpdate("true");
    }
  }

  function passwordFunction(){

    if(passwordChange === "false"){
      return <button onClick={passwordSetting} type="button" className="btn btn-outline-secondary">Change Password</button>
    }
    else{
      return (<form onSubmit={passwordSetting} action="javascript:void(0);" method="POST">
          <div className="form2">
          <div className="form-group2">
  				<input className="input2 password-input2" type="password" name="old-password" placeholder="old password" />
  				<input onChange={updateNewPassword} className="input2 password-input2" type="password" name="new-password" placeholder="new password" />
  				<input onChange={checkNewPassword} className="input2 password-input2" type="password" name="confirm-password" placeholder="confirm password" />
          <div style={{margin:"auto", padding:"5px"}}>{passwordWrong === "true" ? <p style={{color:"red"}}>Password doesn't match.</p> : null}</div>

          <div style={{margin:"auto", padding:"5px"}}>{oldPasswordCorrect === "false" ? <p style={{color:"red"}}>Old Password doesn't match.</p> : null}</div>

          <input type="submit" className="btn btn-outline-secondary center" value="Update Password" />
          </div>
        </div>
      </form>)
    }
  }

  return (
      <div className="profile-container">
        <div>
          <img className="back-img" src={backImg} alt="img"/>
        </div>
        <div className="container2">
          <div>
            <img className="user2" src={userImg} alt="img"/>
            <h2 className="header2">{username}</h2>
            <p className="header-content2">{email}</p>
            <div className="city2 header-content2">
              <i className="city2 header-content2 fas fa-map-marker-alt mr-2 text-lg text-gray-500"></i>{" "}
              Chandigarh, India
            </div>
            <div className="button-css2">
              {<>{passwordFunction()}</>}
            </div>
            <hr className="fancy-line"/>
            <div className="bio">
              <p>{bio}</p>
            </div>
            <div className="button-css2">
              {<>{bioFunction()}</>}
            </div>
          </div>
        </div>

        <div>
          <h1 className="tc dashboard-favorites">My Favorites</h1>
          <hr className="fancy-line" style={{marginBottom:"1%"}}/>
        </div>

        <div>
            {recipes.length === 0 ? <h1 className="tc" style={{padding:"4%",paddingTop:"3%",color:"#202020"}}>You have no Favorite Recipes yet!</h1> : <Cards recipes={recipes}/>}
        </div>

      </div>
  );
}

export default Profile;
