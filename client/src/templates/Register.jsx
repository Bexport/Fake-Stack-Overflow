import { useState } from "react";
import axios from "axios";
// import bcrypt from "bcryptjs";
// import cors from "cors";

export default function Register(props){
    const [newUserData, setNewUserData] = useState({
        username: undefined,
        email: undefined,
        password: undefined,
    });

    // update the data fields from the enter events
    const [emailValidFail, setEmailValidFail] = useState(false);
    const isEmailValid = (email) => {
        // Regular expression for basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        // Test if the email matches the regex
        return emailRegex.test(email);
    };
    const handleEmailInput = (event) => {
         newUserData.email = event.target.value;
    };
    const handleUsernameInput = (event) => {
        newUserData.username = event.target.value;
    };
    const handlePasswordInput = (event) => {
        newUserData.password = event.target.value;
    };

    const [passwordCheck, setPasswordCheck] = useState(null);
    const handleConfirmPasswordInput = (event) => {
        setPasswordCheck(event.target.value);
    };

    const [passwordFail, setPasswordFail] = useState(false);
    const handleToLoginBox = () => {
        props.setRegisterState(false);
    };

    const [passwordContains, setPasswordContains] = useState(false);
    // Validation function to check if the password contains either the username or email
    const isPasswordValid = () => {
        const { username, email, password } = newUserData;

        // Check if the password contains either the username or email
        return (
            !password.includes(username) && !password.includes(email)
        );
    };


    const handleRegisterNewUser = async () =>{
        //check if pw contains username or email
        if(!isPasswordValid()){
            setPasswordContains(true);
            return;
        }

        // Check if passwords match
        if (newUserData.password !== passwordCheck) {
            setPasswordFail(true);
            return;
        }

        //check email form validitiy
        if (!isEmailValid(newUserData.email)) {
            // console.log("Invalid email format");
            setEmailValidFail(true);
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/users/registerUser", newUserData);
            const registeredUser = response.data;

            if (registeredUser.email === newUserData.email) {
                handleToLoginBox();
            } 
            else {
            // Handle other scenarios based on the server response if needed
            console.error("unexpected server response:", registeredUser);
            }
        } catch (error) {
            console.error("registration error");
        }
    };

    const handleLoginSwitch = () =>{
        props.setRegisterState(false);
    }

    return(
        <div id="registerBox">
            <div>
                <button onClick={handleLoginSwitch}>Login</button>
            </div>

            <h4 style={{ paddingBottom: '30px' }}>Register as a New User</h4>

            <form onSubmit={(e) => {e.preventDefault();}}>
                <label htmlFor="email" style={{ paddingRight: '10px' }}>Email</label>
                <input 
                    type="email"
                    name="email"
                    onChange={handleEmailInput}
                />

                <label htmlFor="username" style={{ paddingRight: '10px' }}>Username</label>
                <input
                    type="text"
                    name="username"
                    onChange={handleUsernameInput}
                />

                <label htmlFor="password" style={{ paddingRight: '10px' }}>Password</label>
                <input
                    type="password"
                    name="password"
                    onChange={handlePasswordInput}
                />

                <label htmlFor="password" style={{ paddingRight: '10px' }}>Confirm Password</label>
                <input
                    type="password"
                    name="password"
                    onChange={handleConfirmPasswordInput}
                />

                <button type="submit" onClick={handleRegisterNewUser} style={{display: 'block'}}>
                    Register as New User
                </button>

                <div className={passwordFail ? 'pwFail' : 'pwOK'} style={{paddingTop: '10px'}}>
                    PASSWORDS ARE NOT MATCHING
                </div>

                <div className={passwordContains ? 'pwFail' : 'pwOK'} style={{paddingTop: '10px'}}>
                    PASSWORDS CAN'T CONTAIN USERNAME OR EMAIL
                </div>

                <div className={emailValidFail ? 'pwFail' : 'pwOK'} style={{paddingTop: '10px'}}>
                    INVALID EMAIL FORM
                </div>
            </form>
        </div>
    );
}