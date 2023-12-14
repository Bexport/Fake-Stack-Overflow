import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import QuestionTemplate from "../templates/QuestionTemplate.jsx"

export default function HomePage(props){
    const [questionsList, setQuestionsList] = useState([]);
    const [sortedQ, setSortedQ] = useState([]);
    const [questionError, setQuestionError] = useState(false);
    useEffect(()=>{
        axios.get("http://localhost:8000/questions")
            .then((res)=>{
                setQuestionsList(res.data);
            })
            .catch((err)=>{
                console.log("Get question error: ", err);
            });
    }, []);

    const [sortState, setSortState] = useState("newest");
    const [pageNum, setPageNum] = useState(1);


    const handlePostQuestion = () =>{
        props.setPageName("postQuestionPage");
    }

    const handleFilterNewest = () =>{
        setSortState("newest");
    }

    const handleFilterActive = () =>{
        setSortState("active");
    }

    const handleFilterUnanswered = () =>{
        setSortState("unanswered");
    }

    // create copy of all questions list to sorted list
    useEffect(()=>{
        if(props.isFilteredBy){
            setSortedQ(props.filteredQuestionList);
        }
        else{
            let temp = [];
            // display all if no filter
            temp = questionsList;
            if(sortState === "newest"){
                temp = [...questionsList].sort((a,b)=>{
                    return(new Date(b.ask_date_time) - new Date(a.ask_date_time));
                });
            }
            // sort by most recent answer ids
            else if (sortState === "active"){
                temp = [...questionsList].sort((a,b)=>{
                    const getLastAnswerDate = (question) => {
                        const lastAnswer = question.answers.length > 0 ? question.answers[question.answers.length - 1] : null;
                        return lastAnswer ? new Date(lastAnswer.ans_date_time) : new Date(0);
                    };

                    return getLastAnswerDate(b) - getLastAnswerDate(a);
                });
            }
            //find questions with no answers
            else if (sortState === "unanswered"){
                temp = [...questionsList].filter((question)=>question.answers.length===0);
            }
            // return;
            setSortedQ(temp);
        }
    }, [questionsList, sortState, props, setSortedQ]);


    const renderQuestions = (qList) =>{
        //console.log("Check is filtered or not: " + props.isFilteredBy);
        let questionElements = [];
        let pageQuestions = qList.slice((pageNum-1) * 5, pageNum * 5);
        pageQuestions.forEach((q)=>{
            questionElements.push(
                <QuestionTemplate
                    key={q._id}
                    q={q}
                    setCurrentQuestion ={props.setCurrentQuestion}
                    setPageName={props.setPageName}
                    userInfo={props.userInfo}
                    setIsAnswerComment={props.setIsAnswerComment}
                />
            );
        });
        return questionElements;
    }

    const handlePrevPage = () =>{
        if(pageNum > 1){
            setPageNum(pageNum-1);
        }
    }   
    const handleNextPage = () =>{
        if (pageNum < sortedQ.length/5){
            setPageNum(pageNum+1);
        }
    }

    return(
        <div id="homePage">
            <Sidebar
                setPageName = {props.setPageName}
                setIsFilteredBy = {props.setIsFilteredBy}
            />
            <div className="subMain">
                <div className="subHead">
                    <div className="shR1">
                        <h1 className="pageSubTitle">All Questions</h1>
                        <button className={props.userInfo.username === "Guest" ? "hidden" : "postQuestion"} onClick={handlePostQuestion}>
                            Ask Question
                        </button>
                    </div>

                    <div className="shR2">
                        <h3 id="#Qs">
                            {sortedQ.length} questions
                        </h3>
                        <div id="questButt">
                            <button id="newest" onClick={handleFilterNewest}>Newest</button>
                            <button id="active" onClick={handleFilterActive}>Active</button>
                            <button id="unanswer" onClick={handleFilterUnanswered}>Unanswered</button>
                        </div>
                    </div>
                </div>

                {/* Render questions here */}
                <div className={sortedQ.length === 0 ? '' : 'hidden'}>
                    No results found
                </div>
                <div className={questionError ? '' : "hidden"}>
                    Error getting questions, logout and try again
                </div>
                <div id="qContainer">
                    {renderQuestions(sortedQ)}
                </div>
                <div>
                    <button onClick={handlePrevPage}>Previous Page</button>
                    <button onClick={handleNextPage}>Next Page</button>
                </div>
            </div>
        </div>
    );
}