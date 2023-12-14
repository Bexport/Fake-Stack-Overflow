import { useState } from "react";
import axios from "axios";
//const User = require('../server/models/users.js');
// import bcrypt from "bcryptjs";
// import cors from "cors";

export default function SignIn(props){
    const [loginInfo, setLoginInfo] = useState({
        email: null,
        password: null,
    });

    const handleRegisterUserButt = () => {
        props.setRegisterState(true);
    }
    const handleEmailInput = (event) =>{
        loginInfo.email = event.target.value;
    }
    const handlePasswordInput = (event) => {
        loginInfo.password = event.target.value;
    };

    const [emailLoginFail, setEmailLoginFail] = useState(false);
    const [passwordLoginFail, setPasswordLoginFail] = useState(false);

    const handleLoginUser = async () => {
        try {
          // clear previous error states
          setEmailLoginFail(false);
          setPasswordLoginFail(false);
            
          // Make the login request
          const response = await axios.post(
            "http://localhost:8000/users/login", loginInfo, { withCredentials: true }
          );
      
          const user = response.data;
      
          if (user) {
            // Successful login
            props.setUserInfo(user);
            props.setPageName('homePage');
          } 
        } catch (error) {
          // Handle login error
          console.error("Error during login:", error.message);
          setPasswordLoginFail(true);
          setEmailLoginFail(true);
        }
    };

    return(
        <div id="loginBox">
            <div>
                <button onClick={handleRegisterUserButt}>Register as a New User</button>
            </div>

            <h4 style={{ paddingBottom: '30px' }}>Sign In</h4>
            <form onSubmit={(e) => {e.preventDefault();}}>
                <label htmlFor="email" style={{ paddingRight: '10px' }}>Email</label>
                <input 
                    type="email"
                    name="email"
                    onChange={handleEmailInput}
                />

                <label htmlFor="password" style={{ paddingRight: '10px' }}>Password</label>
                <input
                    type="password"
                    name="password"
                    onChange={handlePasswordInput}
                />

                <button type="submit" onClick={handleLoginUser} style={{display: 'block'}}>
                    Login
                </button>

                <div className={passwordLoginFail || emailLoginFail ? 'pwFail' : 'pwOK'} style={{paddingTop: '10px'}}>
                    Password and/or Email is wrong
                </div>
            </form>
        </div>
    );
}