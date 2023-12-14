import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import '../stylesheets/App.css';
import CommentsTemplate from "../templates/CommentsTemplate.jsx";

export default function CommentsPage(props){
    const [pageNum, setPageNum] = useState(1);

    const displayComments = () =>{
        let comments;
        if(props.isAnswerComment){
            comments = props.currentAnswer.comments;
        }
        else{
            comments = props.currentQuestion.comments;
        }
        let indexCom = comments.slice((pageNum - 1) * 3, pageNum*3);

        let temp=[];
        indexCom.forEach((c)=>{
            temp.push(
                <CommentsTemplate
                    key={c._id}
                    comment={c}
                    setPageName={props.setPageName}
                    setCurrentAnswer={props.setCurrentAnswer}
                    userInfo={props.userInfo}
                />
            )
        });
        if (temp.length === 0) {
            return (
                <div>No comments found</div>
            );
        }
        //console.log("weughfaiuwehf", ansElements)
        return temp;
    }

    const handlePostComment = () => {
        //e.preventDefault();
        if(props.isAnswerComment){
            props.setPageName("postAnsCommentPage");
        }else{
            props.setPageName("postCommentPage");
        }
    }

    const handlePreviousPage = () =>{
        if (pageNum > 1) {
            setPageNum(pageNum - 1);
        }
    }

    const handleNextPage = () =>{
        if (pageNum < props.currentQuestion.answers.length / 3) {
            setPageNum(pageNum + 1);
        }
    }

    return(
        <div id="commentsPage">
            <Sidebar
                setPageName = {props.setPageName}
                setIsFilteredBy = {props.setIsFilteredBy}
            />
            <div className="subMain">
                <div className="subHead">
                    <div className="shR1"> 
                        <h1 className="pageSubTitle" id="numAs">{props.isAnswerComment ? props.currentAnswer.comments.length : props.currentQuestion.comments.length} comments</h1>
                    </div>
                    <div className="shR2">
                        <div className="pageSubTitle" id="answerPageViews">
                            {/* This conditional is used as a guard or conditional check to ensure that access to propertys is not defined */}
                            <div className={props.isAnswerComment ? 'hidden':''}>
                                {props.currentQuestion.views} question views
                            </div>
                        </div>
                        <div className="answerPageQuestionText">
                            {props.isAnswerComment ? props.currentAnswer.text : props.currentQuestion.text}
                        
                        </div>
                        <div className="answerPageUandT">
                            <h4 className="questionAuthor">{props.isAnswerComment ? props.currentAnswer.ans_by : props.currentQuestion.asked_by}</h4>
                            <h4 className="qTime"> {props.isAnswerComment ? props.currentAnswer.ans_date_time.toString() :props.currentQuestion.ask_date_time.toString()}</h4>
                        </div>
                    </div>
                </div>

                <div id="commentsContainer">
                    {displayComments()}
                </div>
                <div id="postAns">
                    <button id="postAnsButt" onClick={handlePostComment}>Post Comment</button>
                    <button onClick={handlePreviousPage}>Previous Page</button>
                    <button onClick={handleNextPage}>Next Page</button>
                </div>
            </div>
        </div>
    );
}