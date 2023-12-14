import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CommentsTemplate(props){
    const [upvotes, setUpvotes] = useState(null);
    const [isGuest, setIsGuest] = useState(false);
    // CALCULATE TIME DIFFERENCE HERE
    const [timeAgo, setTimeAgo] = useState('');
    const questionDate = props.comment.comment_date_time;
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


    const handleUpvote = async () =>{
        if(props.userInfo.username === "Guest"){
            setIsGuest(true);
        }
        else{
            setUpvotes(upvotes+1);
            props.comment.upvotes+=1;
            await axios.put(`http://localhost:8000/comments/update/${props.comment._id}`,props.comment)
                .then((res)=>{
                    console.log(res.data);
                })
                .catch((err)=>{
                    console.log(err);
                });
        }
    }
    
    return(
        <div className='commentsTemplate'>
            <div>
                <button onClick={handleUpvote} style={{marginTop:'20px'}}>Upvote</button>
                <h4 className="qNumAns">{props.comment.upvotes} upvotes</h4>
                <h4 className={isGuest ? 'Fail' : 'Ok'}>
                    Guests cannot upvote 
                </h4>
            </div>
            
            <div className='cLeft'>{props.comment.text}</div>
            <div className='cRight'>
                <div className='answerPageUandT'>
                    <h4 className="questionAuthor">{props.comment.comment_by}</h4>
                    <h4 className="qTime">commented {timeAgo}</h4>
                </div>
            </div>
        </div>
    );
}