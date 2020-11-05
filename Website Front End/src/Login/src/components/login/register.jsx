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
            <input className="input4" type="text" name="username" placeholder="username" />
          </div>
          <div className="form-group4">
            <label className="label4" htmlFor="username">Email</label>
            <input className="input4" type="email" name="email" placeholder="email" />
          </div>
          <div className="form-group4">
            <label className="label4" htmlFor="password">Password</label>
            <input className="input4" type="password" name="password" placeholder="password" />
          </div>
          <div className="form-group4">
            <label className="label4" htmlFor="password">Confirm Password</label>
            <input className="input4" type="password" name="confirm-password" placeholder="password" />
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
        <button className="btn" type="submit">Register</button>
        {/*<button type="button" className="btn">
          Register
        </button>*/}
      </div>

      </form>
    </div>
  );
}

export default Register;