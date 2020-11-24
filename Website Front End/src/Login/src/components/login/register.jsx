import React, {useState, useEffect} from "react";
import loginImg from "../../login.svg";
import Login from "./login"

function Register() {

  const [value, setValue] = useState({auth:"true"});
  const [success, setSuccess] = useState({auth:"false"});
  const [passwordWrong, passwordWrongUpdate] = useState("false");
  const [password, changePassword] = useState("");

	var json;
	async function handleSubmit(event) {

    if(passwordWrong === "true"){
      console.log("Password Doesn't match!")
    }
    else{

  		const url = '/register'

  		console.log("making request")

  		const response = await fetch('/register', {
  		  method: "POST",
  		  headers: {
  		    'Content-type': 'application/json'
  		  },
  		  body: JSON.stringify({ "username": event.target[0].value,"email": event.target[1].value ,"password": event.target[2].value }),
  		});
      json = await response.json();
  		console.log(json);

  		setValue(json);
      setSuccess(json);
    }

		event.preventDefault();
	}

  function redirect() {
    if(success==="true") window.open("/sign_up","_self");
  }

	useEffect(() => {
		console.log(value);
	},[value])


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

  useEffect(() => {},[passwordWrong]);
  useEffect(() => {},[password]);

  return (
    <div className="base-container4">
    <div className="header4">Register</div>
    <form onSubmit={handleSubmit} action="javascript:void(0);" method="POST">
      <div className="content4">
        <div className="image4">
          <img src={loginImg} alt="img" />
        </div>
        <div className="form4">
          <div className="form-group4">
            <label className="label4" htmlFor="username">Username</label>
            <input className="input4" type="text" name="username" placeholder="username" required/>
          </div>
          <div className="form-group4">
            <label className="label4" htmlFor="username">Email</label>
            <input className="input4" type="email" name="email" placeholder="email" required/>
          </div>
          <div className="form-group4">
            <label className="label4" htmlFor="password">Password</label>
            <input onChange={updateNewPassword} className="input4" type="password" name="password" placeholder="password" required/>
          </div>
          <div className="form-group4">
            <label className="label4" htmlFor="password">Confirm Password</label>
            <input onChange={checkNewPassword} className="input4" type="password" name="confirm-password" placeholder="password" required/>
          </div>
        </div>
        <div>
  				{value.auth === "false" ? <p style={{color:"red"}}>This username or email isn't available</p> :null}
  			</div>
        <div>
  				{success.auth === "true" ? <p style={{color:"green"}}>Registered successfully! Login into your profile.</p> :null}
  			</div>
        <div>
  				{passwordWrong === "true" ? <p style={{color:"red"}}>Password doesn't match.</p> :null}
  			</div>
        <div>
  				{password.length <6 && password.length>0 ? <p style={{color:"red"}}>Password should be atleast 6 characters long.</p> :null}
  			</div>
      </div>
      <div className="footer">
        <button className="btn" type="submit" onClick={redirect}>Register</button>
        {/*<button type="button" className="btn">
          Register
        </button>*/}
      </div>

      </form>
    </div>
  );
}

export default Register;
