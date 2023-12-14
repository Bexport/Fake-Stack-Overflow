import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../components/Sidebar.jsx";

export default function PostAnsCommentPage(props){
    const [newCommentInfo, setNewCommentInfo] = useState({
        text:'',
        comment_by: props.userInfo.username,
        comment_date_time:new Date(),
        upvotes:0,
        downvotes:0,
    });
    const [commentError, setCommentError] = useState(false);
    const [reputationError, setReputationError] = useState(false);

    const handleSummaryInput =(event)=>{
        newCommentInfo.text = event.target.value;
    }

    const handleSubmitComment = async (event) =>{
        event.preventDefault();
        if(checklist()){
            // push to comments db
            setNewCommentInfo(newCommentInfo);
            await axios.post("http://localhost:8000/comments/add", newCommentInfo)
                .then((res) => {
                    console.log(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
            props.currentAnswer.comments.push(newCommentInfo);

            // update answer
            await axios.put(`http://localhost:8000/answers/update/${props.currentAnswer._id}`,props.currentAnswer)
                .then((res) => {
                    console.log(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
            props.setPageName("commentsPage");
        }
    }

    const checklist = () =>{
        //reset
        setCommentError(false);
        setReputationError(false);

        if(!newCommentInfo.text || newCommentInfo.text.length === 0 || newCommentInfo.text.length > 140){
            setCommentError(true);
            return false;
        }
        if(props.userInfo.reputation <= 50){
            setReputationError(true);
            return false;
        }
        return true;
    }
    return(
        <div id="postCommentPage">
            <SideBar
                setPageName={props.setPageName}
                setIsFilteredBy={props.setIsFilteredBy}
            />
            <div className="subMain">
                <div className="subHead">
                    <form id="newCommentForm">
                        <h1 style={{paddingTop:"10px"}} className="pageSubTitle">Answer Comment Text*</h1>
                        <h4 className="subsubTitle">Limit comment to 140 characters</h4>
                        <input type="text" className="bigInputBox" id="detailsInIn" onChange={handleSummaryInput}/>
                   
                        <div className={commentError ? "Fail" : "Ok"}>
                            Comment can not be empty or more than 140 characters
                        </div>
                        <div className={reputationError ? 'Fail':'Ok'}>
                            User must have greater than 50 reputation to add a new comment
                        </div>

                        <div id="bottomDiv">
                            <button id="postQuestion" onClick={handleSubmitComment}>
                                Post Comment
                            </button>
                            <h4 style={{color: 'red', margin: '0'}}>* indicates mandatory fields</h4>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}