import React, {useState, useEffect} from "react";
import Cards from "../../../../components/Cards";
import Posts from "../../../../components/feed/posts";
import "./profile.css"
import backImg from "./back-img.jpg"
import userImg from "./user-img.png"
//import "@fortawesome/fontawesome-free/css/all.min.css";

var login = localStorage.getItem('loggedIn');
var userName = localStorage.getItem('username');
var tempImg = "";

function Profile() {
  const[username, setUsername] = useState(userName);
  const[email, setEmail] = useState("");
  const[bio, setBio] = useState("");
  const[bioChange, updateBio] = useState("false");
  const[password, changePassword] = useState("");
  const[passwordChange, updatePassword] = useState("false");
  const[passwordWrong, passwordWrongUpdate] = useState("false");

  const[oldPasswordCorrect, setOldPasswordCorrect] = useState("true");

  const[fetched, setFetched] = useState("false");

  const [recipes, setRecipes] = useState([]);
  const [image, setImage] = useState("");

  const [imageOption, setImageOption] = useState("false");
  const [uploadInput, setUploadInput] = useState();

  const[fetched1, setFetched1] = useState("false");
  const[posts, setPosts] = useState([]);

  async function fetchPosts(){
    //console.log("Ankit");
    const response = await fetch('/fetch-posts', {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(userName),
    });

      var temp = await response.json();
      var temp2= []
      for(var i=0;i<temp[0].length;++i){
        if(temp[0][i].username === userName){
          temp2.push(temp[0][i]);
        }
      }
      setPosts(temp2);
      console.log(temp[0]);
  }

  function fetchPostsCall(){
    if(fetched1 === "false"){
      fetchPosts();
      setFetched1("true");
    }
  }



  // useEffect(() => {
  //
  //   async function fetchUserDetails(){
  //     const response = await fetch('/profile-stats', {
  // 		  method: "POST",
  // 		  headers: {
  // 		    'Content-type': 'application/json'
  // 		  },
  // 		  body: JSON.stringify(username),
  // 		});
  //
  //     	var temp = await response.json();
  //       setEmail(temp.email);
  //       setBio(temp.bio);
  //       setRecipes(temp.fav_recipes);
  //   }
  //
  //   fetchUserDetails();
  //  });

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
      setRecipes(temp.fav_recipes);
      setImage(temp.image);
  }

  function fetchUserDetailsCall(){
    if(fetched === "false"){
      fetchUserDetails();
      setFetched("true");
    }
  }

   useEffect(() => {},[email]);
   useEffect(() => {},[bio]);
   useEffect(() => {},[recipes]); //This line leads to backend request infinite loop
   useEffect(() => {},[imageOption]);

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
          <input type=" type" className="textArea2 center" name="paragraph_text" cols="50" rows="5" required/>
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
  				<input className="input2 password-input2" type="password" name="old-password" placeholder="old password" required/>
  				<input onChange={updateNewPassword} className="input2 password-input2" type="password" name="new-password" placeholder="new password" minlength="6" required/>
  				<input onChange={checkNewPassword} className="input2 password-input2" type="password" name="confirm-password" placeholder="confirm password" required/>
          <div style={{margin:"auto", padding:"5px"}}>{passwordWrong === "true" ? <p style={{color:"red"}}>Password doesn't match.</p> : null}</div>

          <div style={{margin:"auto", padding:"5px"}}>{oldPasswordCorrect === "false" ? <p style={{color:"red"}}>Old Password doesn't match.</p> : null}</div>

          <input type="submit" className="btn btn-outline-secondary center" value="Update Password" />
          </div>
        </div>
      </form>)
    }
  }

  const getBase64 = (file) => {
   return new Promise((resolve,reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
   });
 }

  async function newImage(event){
    event.persist();
    // event.preventDefault();
    const data = new FormData();
    data.append('file', uploadInput.files[0]);

    const file = uploadInput.files[0];

    getBase64(file).then(base64 => {
      setImage(base64);
      const response = fetch('/user-image-change', {
       method: "POST",
       headers: {
         'Content-type': 'application/json'
       },
       body: JSON.stringify({Image:base64, Username:username}),
      });
      console.debug("file stored",base64);
      //console.log("file stored",base64);
    });

    setImageOption("false");
  }

  function changeUserImage(){
    imageOption==="false" ? setImageOption("true") : setImageOption("false");
  }

  const[selected,setSelected] = useState("left");
  //useEffect(() => {},[selected]);

  return (
      <div className="profile-container">
        <div>{<>{fetchUserDetailsCall()}</>}</div>
        <div>
          <img className="back-img" src={backImg} alt="img"/>
        </div>
        <div className="container2">
          <div>
            <img className="user2" src={image} alt="img" onClick={changeUserImage}/>
            {imageOption === "true" ?
              <form action="javascript:void(0);" onSubmit={newImage}>
              <div className="tc" style={{marginLeft:"100px"}}>
                <input className="btn btn-outline-secondary" ref={(ref) => { setUploadInput(ref) }} type="file" accept="image/*" required />
                <button className="btn btn-outline-secondary">Upload</button>
              </div></form> :
              null }
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
          {<>{fetchPostsCall()}</>}
        </div>

        {selected === "left" ?
        <div>
          <div style={{height:"100px"}}>
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 isSelected shadow-5"><h1 className="tc dashboard-favorites">My Favorites</h1></div>
            <div onClick={() => setSelected("right")} className="col-xs-6 col-sm-6 col-md-6 col-lg-6 isNotSelected"><h1 className="tc dashboard-favorites">My Posts</h1></div>
          </div>

          <div style={{width:"97%",margin:"auto", marginTop:"4%"}}>
              {recipes.length === 0 ? <h1 className="tc" style={{padding:"4%",paddingTop:"3%",color:"#202020"}}>You have no Favorite Recipes yet!</h1> : <Cards recipes={recipes}/>}
          </div>
        </div>:

        <div>
          <div style={{height:"100px"}}>
            <div onClick={() => setSelected("left")} className="col-xs-6 col-sm-6 col-md-6 col-lg-6 isNotSelected"><h1 className="tc dashboard-favorites">My Favorites</h1></div>
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 isSelected shadow-5"><h1 className="tc dashboard-favorites">My Posts</h1></div>
          </div>


          <div style={{width:"90%", alignContent:"center", margin:"auto", marginTop:"4%"}}>
              {posts.length === 0 ? <h1 className="tc" style={{padding:"4%",paddingTop:"3%",color:"#202020"}}>You have no Posts yet!</h1> : <Posts posts={posts} hide="true"/>}
          </div>
        </div>}

      </div>
  );
}

export default Profile;
