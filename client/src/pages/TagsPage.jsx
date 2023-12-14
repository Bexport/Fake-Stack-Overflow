import React from "react";
import Sidebar from "../components/Sidebar";
import TagTemplate from "../templates/TagTemplate.jsx";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TagsPage(props){
    // manage state here after grabbing data from axios(?)
    const [questions, setQuestions] = useState([]);
    const [tags, setTags] = useState([]);
    const [errorMsg, setErrorMsg] = useState(false);
    
    // use axios here to get the right data
    useEffect(()=>{
        axios.get("http://localhost:8000/questions")
        .then((res) => {
            setQuestions(res.data);
        })
        .catch((err)=>{
            console.log(err);
            setErrorMsg(true);
        })

        axios.get("http://localhost:8000/tags")
            .then((res) => {
                setTags(res.data);
            })
            .catch((err)=>{
                console.log(err);
                setErrorMsg(true);
            })
    },[]);

    //function to display tags
    const displayTags = () =>{
        let tagsContainer = [];
        tags.forEach((tag) => {
            tagsContainer.push(
                <TagTemplate
                    key={tag._id}
                    tag={tag}
                    questions={questions}
                    setFilteredQuestionList={props.setFilteredQuestionList}
                    setPageName={props.setPageName}
                    setIsFilteredBy={props.setIsFilteredBy}
                />
            );
        });
        return tagsContainer;
    };

    // function to change the "page" to post question form
    const handlePostQuestion = () => {
        props.setPageName("postQuestionPage");
    };

    return(
        <div id="tagsPage">
            <Sidebar
                setPageName = {props.setPageName}
                setIsFilteredBy = {props.setIsFilteredBy}
            />
            <div className="subMain">
                <div className="subHead">
                    <div className="shR1">
                        <h1 className="pageSubTitle" id="#Ts">{tags.length} tags</h1>
                        <h1 className="pageSubTitle">All Tags</h1>

                        <button 
                        id="postQuestion" 
                        onClick={handlePostQuestion}
                        className={props.userInfo.username === "Guest" ? "hidden" : ""}>
                            Ask Question
                        </button>
                    </div>
                </div>

                <div id="tagsContainer">
                    {displayTags()}
                </div>

                <div className={errorMsg ? 'Fail' : 'Ok'}style={{ color: 'red', padding: '10px', backgroundColor: 'lightyellow', border: '1px solid darkred' }}>
                    System or communication failure. Please try again later.
                </div>
            </div>
        </div>
    );

}