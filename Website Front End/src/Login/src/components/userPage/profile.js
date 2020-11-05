import React, {useState, useEffect} from "react";
import "./profile.css"
import backImg from "./back-img.jpg"
import userImg from "./user-img.png"
// import "@fortawesome/fontawesome-free/css/all.min.css";

function Profile() {
  const[username, setUsername] = useState("");
  const[email, setEmail] = useState("");
  const[bio, setBio] = useState("Hey there! I am using RecipeBowl. RecipeBowl is the best Recipe generation website to get the most tasty recipes within seconds.");
  const[bioChange, updateBio] = useState("false");
  const[password, changePassword] = useState("");
  const[passwordChange, updatePassword] = useState("false");
  const[passwordWrong, passwordWrongUpdate] = useState("false");

  function bioSetting(event){
    event.persist()
    if(bioChange === "true"){
      console.log(event.target[0].value);
      setBio(event.target[0].value)
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

  function passwordSetting(event){
    event.persist()
    if(passwordWrong === "true"){
      console.log("Password doesn't match!")
    }
    else if(passwordChange === "true"){
      console.log(event.target[0].value);
      
      updatePassword("false");
    }
    else{
      updatePassword("true");
    }
  }

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
          <input type="submit" className="btn btn-outline-secondary center" value="Update Password" />
          </div>
        </div>
      </form>)
    }
  }

  return (
      <div className="profile-container">
        <img className="back-img" src={backImg} alt="img"/>
        <div className="container2">
          <div>
            <img className="user2" src={userImg} alt="img"/>
            <h2 className="header2">ankit_0301</h2>
            <p className="header-content2">goyalankit3129@gmail.com</p>
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
      </div>
  );
}

export default Profile;
