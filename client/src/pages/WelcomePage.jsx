import { useState } from 'react';
import SignIn from '../templates/SignIn.jsx';
import Register from '../templates/Register.jsx';

export default function WelcomePage(props){
    // check if we're trying to login or register
    // ****assume the user is trying to register
    const [registerState, setRegisterState] = useState(true);    

    const handleGuest = () =>{
        props.setPageName('homePage');
    }

    return(
        <div id='welcomePage'>
            <h1>Welcome to Fake Stack Overflow</h1>
            <div>
                <button onClick={handleGuest}>Continue as Guest</button>
            </div>

            {registerState ? (
                <Register 
                    setRegisterState={setRegisterState} 
                />
                ) : (
                <SignIn
                    setRegisterState={setRegisterState}
                    setPageName={props.setPageName}
                    setUserInfo={props.setUserInfo}
                />
            )}

        </div>
    );
}