import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import AnswersTemplate from "../templates/AnswersTemplate.jsx";
import '../stylesheets/App.css';

// *** GRAB ONE QUESTION FIRST JUST FOR TESTING ***// 
export default function AnswersPage(props){
    const [pageNum, setPageNum] = useState(1);
    //const [extractedAns, setExtractedAns] = useState([]);

    // function to create answer elements and display (copy from JS)
    const displayAnswers = () =>{
        //console.log(props.questions[0].ansIds);
        let ids = props.currentQuestion.answers;
        let indexAns = ids.slice((pageNum - 1) * 5, pageNum*5);
        
        let temp = [];
        indexAns.forEach((answer)=>{
            //console.log(a)
            temp.push(
                <AnswersTemplate
                    key={answer._id}
                    answer={answer}
                    setPageName={props.setPageName}
                    setCurrentAnswer={props.setCurrentAnswer}
                    userInfo={props.userInfo}
                    currentQuestion={props.currentQuestion}
                    setCurrentQuestion={props.setCurrentQuestion}
                    setIsAnswerComment={props.setIsAnswerComment}
                />
            )
        });
        //set state array
        // setExtractedAns(temp);
        if (temp.length === 0) {
            return (
                <div>No answers found</div>
            );
        }
        //console.log("weughfaiuwehf", ansElements)
        return temp;
    }

    // function to change the "page" name to post question form
    const handlePostQuestion = () => {
        props.setPageName("postQuestionPage");
    }
    const handlePostAnswer = () => {
        //e.preventDefault();
        props.setPageName("postAnswerPage");
    }

    const handlePreviousPage = () =>{
        if (pageNum > 1) {
            setPageNum(pageNum - 1);
        }
    }

    const handleNextPage = () =>{
        if (pageNum < props.currentQuestion.answers.length / 5) {
            setPageNum(pageNum + 1);
        }
    }

    return(
        <div id = "answersPage">
            <Sidebar
                setPageName = {props.setPageName}
                setIsFilteredBy = {props.setIsFilteredBy}
            />
            <div className="subMain">
                <div className="subHead">
                    <div className="shR1">
                        <h1 className="pageSubTitle" id="numAs">{props.currentQuestion.answers.length} answers</h1>
                        <h1 className="pageSubTitle">{props.currentQuestion.title}</h1>
                        <button className={props.userInfo.username === "Guest" ? "hidden" : "postQuestion"} onClick={handlePostQuestion}>Ask Question</button>
                    </div>
                    <div className="shR2">
                        <div className="pageSubTitle" id="answerPageViews">
                            {/* This conditional is used as a guard or conditional check to ensure that access to propertys is not defined */}
                            {props.currentQuestion.views} views
                            {/* TEMP views */}
                        </div>
                        <div className="answerPageQuestionText">
                            {props.currentQuestion.text}
                            {/* TEMP text */}
                        </div>
                        <div className="answerPageUandT">
                            <h4 className="questionAuthor">{props.currentQuestion.asked_by}</h4>
                            <h4 className="qTime">asked {props.currentQuestion.ask_date_time.toString()}</h4>
                        </div>
                    </div>
                </div>

                {/* Display the answers with the answerIds here */}
                <div id="answersContainer">
                    {/* {extractedAns.length === 0 ? (<div>No answers available.</div>) 
                    :(
                        displayAnswers()
                    )} */}
                    {displayAnswers()}
                </div>

                {/* Footer div for post answers page button */}
                <div id="postAns">
                    <button id="postAnsButt" onClick={handlePostAnswer}>Answer Question</button>
                    <button onClick={handlePreviousPage}>Previous Page</button>
                    <button onClick={handleNextPage}>Next Page</button>
                </div>
            </div>
        </div>
    );
}