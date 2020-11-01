import React, {useState, useEffect} from "react";
import loginImg from "../../login.svg";
import Login from "./login"

function Register() {

  const [value, setValue] = useState({auth:"true"});
  const [success, setSuccess] = useState({auth:"false"});

	var json;
	async function handleSubmit(event) {
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

		event.preventDefault();
	}

	useEffect(() => {
		console.log(value);
	},[value])

  return (
    <div className="base-container">
    <div className="header">Register</div>
    <form onSubmit={handleSubmit} action="javascript:void(0);" method="POST">
      <div className="content">
        <div className="image">
          <img src={loginImg} alt="img" />
        </div>
        <div className="form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" placeholder="username" />
          </div>
          <div className="form-group">
            <label htmlFor="username">Email</label>
            <input type="email" name="email" placeholder="email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" placeholder="password" />
          </div>
        </div>
        <div>
  				{value.auth === "false" ? <p style={{color:"red"}}>This username or email isn't available</p> :null}
  			</div>
        <div>
  				{success.auth === "true" ? <p style={{color:"green"}}>Registered successfully! Login into your profile.</p> :null}
  			</div>
      </div>
      <div className="footer">
        <input className="btn" type="submit" value="Register" />
        {/*<button type="button" className="btn">
          Register
        </button>*/}
      </div>

      </form>
    </div>
  );
}

export default Register;
