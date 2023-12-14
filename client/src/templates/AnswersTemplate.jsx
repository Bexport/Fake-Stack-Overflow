import React from "react";
import '../stylesheets/App.css';
import axios from "axios";
import {useState, useEffect} from "react";
import CommentsTemplate from "./CommentsTemplate.jsx";

export default function AnswersTemplate(props){
    const [upvotes, setUpvotes] = useState(null);
    const [downvotes, setDownvotes] = useState(null);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState([]);

    // CALCULATE TIME DIFFERENCE HERE
    const [timeAgo, setTimeAgo] = useState('');
    const questionDate = props.answer.ans_date_time;
    useEffect(() => {
        const calcTimeDiff = () => {
        const currentDate = new Date();
        const questionDateTime = new Date(questionDate);
        const timeDifference = currentDate - questionDateTime;
    
        const secondsDifference = Math.floor(timeDifference / 1000);
        const minutesDifference = Math.floor(secondsDifference / 60);
        const hoursDifference = Math.floor(minutesDifference / 60);
        const daysDifference = Math.floor(hoursDifference / 24);
        const yearsDifference = Math.floor(daysDifference / 365);
    
        if (secondsDifference < 60) {
            setTimeAgo(`${secondsDifference} seconds ago`);
        } else if (minutesDifference < 60) {
            setTimeAgo(`${minutesDifference} minutes ago`);
        } else if (hoursDifference < 24) {
            setTimeAgo(`${hoursDifference} hours ago`);
        } else if (daysDifference < 365) {
            setTimeAgo(`${daysDifference} days ago`);
        } else {
            // More than a year ago
            setTimeAgo(questionDate);
        }
        };
        calcTimeDiff();
        //you can update the time every minute or so
        const intervalId = setInterval(() => {
            calcTimeDiff();
        }, 60 * 1000);
    
        return () => clearInterval(intervalId);
    }, [questionDate]);

    const handleUpvote = async () =>{
        setUpvotes(upvotes+1);
        props.answer.upvotes+=1;
        props.userInfo.reputation+=5;
        await axios.put(`http://localhost:8000/answers/update/${props.answer._id}`,props.answer)
            .then((res)=>{
                console.log(res.data);
            })
            .catch((err)=>{
                console.log(err);
            });
    }
    const handleDownvote = async () =>{
        setDownvotes(downvotes+1);
        props.answer.downvotes+=1;
        if(props.userInfo.reputation-10 >= 0){
            props.userInfo.reputation-=10;
        }
        await axios.put(`http://localhost:8000/answers/update/${props.answer._id}`,props.answer)
            .then((res)=>{
                console.log(res.data);
            })
            .catch((err)=>{
                console.log(err);
            });
    }

    const handleAddComment = () =>{
        //console.log("Add Comment to Answer: " + props.answer);
        props.setIsAnswerComment(true);
        props.setCurrentAnswer(props.answer);
        props.setPageName("postAnsCommentPage");
    }

    const handleViewComments = () =>{
        props.setIsAnswerComment(true);
        props.setCurrentAnswer(props.answer);
        props.setPageName("commentsPage");
    }

    return(
        <div className="answer">
            <div style={{marginRight: '10px'}}>
                <button onClick={handleUpvote} className="upDownButt">Upvote</button>
                <h4 className="qNumAns">{props.answer.upvotes} upvotes</h4>
            </div>
            <div style={{marginRight: '10px'}}>
                <button onClick={handleDownvote} className="upDownButt">Downvote</button>
                <h4 className="qNumAns">{props.answer.downvotes} downvotes</h4>
            </div>

            <div>
                <div className="ansText">{props.answer.text}</div>
                <button onClick={handleAddComment} style={{marginRight:'10px'}}>Add new comment</button>
                <button onClick={handleViewComments} style={{marginRight:'10px'}}>View/Hide all comments</button>
            </div>

            <div className="answerPageUandT">
                <h4 className="questionAuthor">{props.answer.ans_by}</h4>
                <h4 className="qTime">answered {timeAgo}</h4>
            </div>
            <div className="qComments">{comments}</div>
        </div>
    );
}