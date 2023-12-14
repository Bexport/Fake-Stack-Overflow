import React, { useState, useEffect } from "react";
import '../stylesheets/App.css';
import axios from "axios";

function TitleHeader(props){
    const [allQuestions, setAllQuestions] = useState([]);
    const [allTags, setAllTags] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:8000/questions")
            .then((res) => {
                setAllQuestions(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

        axios.get("http://localhost:8000/tags")
            .then((res) => {
                setAllTags(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    // GOTTA ADD FUNCTION FOR SEARCHING HERE
    const searchFunct = (e) =>{
        if(e.key === "Enter"){
            console.log("SEARCH ENTER PRESSED");
            let userInput = e.target.value
            userInput = userInput.toLowerCase().trim();
            
            // if user searches by [tags]
            let searchTags = [];
            let delimit = userInput.split("[");
            if(delimit[0] != userInput){
                delimit.forEach((word)=>{
                    const tag = word.split("]")[0].trim(); // Trim to remove leading/trailing spaces
                    if (tag !== "") {
                        searchTags.push(tag);
                    }
                });
            }
            console.log("TAGS", searchTags);

            // if the user searches by question title content
            let questionsList = allQuestions;
            userInput = userInput.trim().split(" ");
            questionsList = questionsList.filter((q)=>{
                return(
                    q.title.toLowerCase().includes(userInput) || 
                    q.text.toLowerCase().includes(userInput) || 
                    checkTags(q.tags, searchTags)
                );
            })
            
            props.setFilteredQuestionList(questionsList);
            //console.log("FILTERED SEARCH LIST", questionsList);
            props.setPageName("filteredHome");
        }
    }
    // checks if at least one tag from the array is in the question's tagIds and if we 
    // should include the question in the filtered list
    const checkTags = (questionTags, searchTags) =>{
        console.log("qTags", questionTags);
        console.log("searchTAGS", searchTags);
        return searchTags.some((searchTag) =>
        questionTags.some((questionTag) =>
            questionTag.name.toLowerCase().includes(searchTag.toLowerCase())
            )
        );
    }

    const [logoutError, setLogoutError] = useState(false);
    const handleLogout = async() => {
        props.setUserInfo({
            username: "Guest",
            email: "",
            password: "",
        });
        
        // Send a request to your server to logout
        await axios.get('http://localhost:8000/users/logout')
                .then(props.setPageName("welcomePage"))
                .catch((err)=>{
                    setLogoutError(true);
                    console.log(err);
                });
    };

    const handleShowUserProfile = () =>{
        props.setPageName("userProfilePage");
    }

    return (
        <div id="header">
            <div className="leftHeader">
                <div>
                    <div>Logged in as: {props.userInfo.username}!</div>
                </div>
                <div className={props.userInfo.username === 'Guest' ? 'hidden' : ''}>
                    <button onClick={handleShowUserProfile}>User Profile</button>
                </div>
            </div>

            <h1 id="headerText">Fake Stack Overflow</h1>
            <form id="search" className="search" placeholder="Search..."
                onSubmit={(e) => {e.preventDefault();}}
            >
                <input id="searchBar" type="text" placeholder="Search..." onKeyUp={searchFunct}/>
            </form>
            <div>
                <button id="logoutButt" onClick={handleLogout}>
                    Log Out
                </button>
                <div className={logoutError ? '': 'hidden'}>
                    Problem logging out
                </div>
            </div>
        </div>
    );

}
export default TitleHeader