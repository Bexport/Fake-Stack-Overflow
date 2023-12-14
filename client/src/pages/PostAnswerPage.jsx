import React from "react";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import axios from "axios";
// import {Answer} from "../models/model.js";

export default function PostAnswerPage(props){
    // data for answers to be uploaded (just copy the ans fields to be pushed)
    const [answerData, setAnswerData] = useState({
        text: null,
        ans_by: props.userInfo.username,
        ans_by_id: props.userInfo._id,
        ans_date_time: null,
        upvotes: 0,
        downvotes: 0,
        comments: [],
    });
    const [invalidAns, setInvalidAns] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const handleAnswerTextInput = (event) => {
        answerData.text = event.target.value;
    };

    // function for when the Post Ansewr Button is pressed
    const handlePostAnswerButton = async (event) =>{
        event.preventDefault();
        // check if what the user inputed is not empty
        if (answerData.text.length === 0 || answerData.text === null){
            setInvalidAns(true);
        }
        // new date
        answerData.ans_date_time = new Date();
        setAnswerData(answerData);

        // axios to push data into the DB
        await axios.post("http://localhost:8000/answers/add", answerData)
                    .then((res) => {
                        console.log(res.data);
                    })
                    .catch((err)=>{
                        console.log(err);
                        setErrorMsg(true);
                    });
        //console.log("res data",res.data);
        // we have to update the current question by adding the new answer to it
        props.currentQuestion.answers.push(answerData);
        await axios.put(`http://localhost:8000/questions/update/${props.currentQuestion._id}`, props.currentQuestion)
            .then((res) => {
                console.log(res.data);
            })
            .catch((err)=>{
                console.log(err);
                setErrorMsg(true);
            })

        // axios.post("http://localhost:8000/answers/add", answerData)
        //     .then((res) => {
        //         const newAnswer = res.data;
        //         updateQuestionWithNewAnswer(newAnswer);
        //     })
        //     .catch((error) => {
        //         console.error("Error creating new answer:", error);
        //     });
        props.setPageName("answersPage");
    }; 

    const updateQuestionWithNewAnswer = (newAnswer) => {
        // Assume you have access to the current question object (props.currentQuestion)
        const updatedQuestion = {
          ...props.currentQuestion,
          answers: [...props.currentQuestion.answers, newAnswer],
        };
      
        // Send a PUT request to update the question
        axios.put(`http://localhost:8000/questions/update/${props.currentQuestion._id}`, updatedQuestion)
          .then((response) => {
            console.log("Question updated successfully:", response.data);
          })
          .catch((error) => {
            console.error("Error updating question:", error);
          });
      };

    return(
        <div id="postAnswerPage">
            <Sidebar
                setPageName = {props.setPageName}
                setIsFilteredBy = {props.setIsFilteredBy}
            />
            <div className="subMain">
                <div className="subHead">
                    <form action="" id="answerForm">
                        <h1 style={{paddingTop: "10px"}} className="pageSubTitle">Answer Text*</h1>
                        <input type="text" className="bigInputBox" placeholder="Details . . ." id="answerIn"onChange={handleAnswerTextInput}/>
                        <div className={invalidAns ? "error" : "hidden"}>
                            Answer can not be empty
                        </div>

                        <div className={errorMsg ? 'Fail' : 'Ok'}style={{ color: 'red', padding: '10px', backgroundColor: 'lightyellow', border: '1px solid darkred' }}>
                            System or communication failure. Please try again later.
                        </div>

                        {/* bottom div for button and text */}
                        <div id="bottomDiv">
                            <button id="postAnswerForm" onClick={handlePostAnswerButton}>Post Answer</button>
                            <h4 style={{color: 'red', margin: 0}}>* indicates mandatory fields</h4>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}