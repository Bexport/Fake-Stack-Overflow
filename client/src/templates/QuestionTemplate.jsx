import { React, useState, useEffect } from "react";
import axios from "axios";
import CommentsTemplate from "./CommentsTemplate.jsx";

export default function QuestionElement(props){
    const [upvotes, setUpvotes] = useState(null);
    const [downvotes, setDownvotes] = useState(null);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);

    const handleUpvote = async () =>{
        setUpvotes(upvotes+1);
        props.q.upvotes+=1;
        props.userInfo.reputation+=5
        await axios.put(`http://localhost:8000/questions/update/${props.q._id}`,props.q)
            .then((res)=>{
                console.log(res.data);
            })
            .catch((err)=>{
                console.log(err);
            });
    }
    const handleDownvote = async () =>{
        setDownvotes(downvotes+1);
        props.q.downvotes+=1;
        if(props.userInfo.reputation-10 >= 0){
            props.userInfo.reputation-=10;
        }
        await axios.put(`http://localhost:8000/questions/update/${props.q._id}`,props.q)
            .then((res)=>{
                console.log(res.data);
            })
            .catch((err)=>{
                console.log(err);
            });
    }

    const findQTags = () =>{
        let temp = [];
        props.q.tags.forEach((t)=>{
            temp.push(<h4 className="qTag" key={t._id}>{t.name}</h4>);
        });
        return temp;
    }

    // CALCULATE TIME DIFFERENCE HERE
    const [timeAgo, setTimeAgo] = useState('');
    const questionDate = props.q.ask_date_time;
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
            setTimeAgo(questionDate.toString());
        }
        };
        calcTimeDiff();
        //you can update the time every minute or so
        const intervalId = setInterval(() => {
            calcTimeDiff();
        }, 60 * 1000);
    
        return () => clearInterval(intervalId);
    }, [questionDate]);


    const handleQuestionTitle = async () =>{
        props.q.views+=1;
        await axios.put(`http://localhost:8000/questions/update/${props.q._id}`,props.q)
            .then((res)=>{
                console.log(res.data);
            })
            .catch((err)=>{
                console.log(err);
            });
        
        // set current question variable state and change to the specific answers page
        props.setCurrentQuestion(props.q);
        props.setPageName("answersPage");
    }

    const handleAddComment = () =>{
        console.log("Add Comment to Question: " + props.q);
        props.setIsAnswerComment(false);
        props.setCurrentQuestion(props.q);
        props.setPageName("postCommentPage");
    }

    const handleViewComments = () =>{
        props.setIsAnswerComment(false);
        props.setCurrentQuestion(props.q);
        props.setPageName("commentsPage");
    }

    return(
        <div className="question">
            <div className="numCounts">
                <h4 className="qNumAns">{props.q.answers.length} answers</h4>
                <h4 className="qNumViews">{props.q.views} views</h4>

                <button onClick={handleUpvote} style={{marginTop:'20px'}}>Upvote</button>
                <h4 className="qNumAns">{props.q.upvotes} upvotes</h4>
                <button onClick={handleDownvote}>Downvote</button>
                <h4 className="qNumAns">{props.q.downvotes} downvotes</h4>
            </div>
            <div className="TitandTags">
                <div className="questionTitle" onClick={handleQuestionTitle}>
                    {props.q.title}
                </div>
                <div className="qTagContainer">
                    {findQTags()}
                </div>
                <div style={{marginTop: '20px'}}>
                    <button onClick={handleAddComment} style={{marginRight:'10px'}}>Add new comment</button>
                    <button onClick={handleViewComments}>View/Hide all comments</button>
                </div>
            </div>
            <div className="UsAndTime">
                <h4 className="questionAuthor">{props.q.asked_by}</h4>
                <h4 className="qTime">asked {timeAgo}</h4>
            </div>
            {/* <div className="commentsContainer">{comments}</div> */}
        </div>
    );
}