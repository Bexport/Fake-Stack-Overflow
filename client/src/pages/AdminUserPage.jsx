import React from "react";
import { useState, useEffect} from "react";
import Sidebar from "../components/Sidebar.jsx";
import axios from "axios";
import QuestionTemplate from "../templates/QuestionTemplate.jsx"
import TagTemplate from "../templates/TagTemplate.jsx"
import AnswersTemplate from "../templates/AnswersTemplate.jsx"

export default function AdminUserPage(props){
    const [adminGetUsersInfo, setAdminGetUsersInfo] = useState(props.currentUser);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [tags, setTags] = useState([]);

    // get user info, questions, and tags
    useEffect(()=>{
        // axios.get(`http://localhost:8000/users/`)
        //     .then((res)=>{
        //         setAdminGetUsersInfo(res.data);
        //     })
        //     .catch((err)=>{
        //         console.log(err);
        //     });

        axios.get(`http://localhost:8000/users/userQuestions/${props.currentUser._id}`)
            .then((res)=>{
                //console.log(res.data);
                setQuestions(res.data);
            })
            .catch((err)=>{
                console.log(err);
            });

        axios.get(`http://localhost:8000/users/userAnswers/${props.currentUser._id}`)
            .then((res)=>{
                console.log(res.data);
                setAnswers(res.data);
            })
            .catch((err)=>{
                console.log(err);
            });

        axios.get(`http://localhost:8000/users/userTags/${props.currentUser._id}`)
            .then((res)=>{
                //console.log("User Tags"+res.data);
                setTags(res.data);
            })
            .catch((err)=>{
                console.log(err);
            });
        
    },[props.userInfo._id]);

    const [timeAgo, setTimeAgo] = useState('');
    const questionDate = props.currentUser.account_created_date_time;
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

    //filter by newest
    useEffect(()=>{
        let temp = [];
        temp = questions;
        // Use a temporary variable to avoid modifying the state directly
        temp = [...questions].sort((a, b) => {
            return new Date(b.ask_date_time) - new Date(a.ask_date_time);
        });
        setQuestions(temp);
    }, [, props, setQuestions]);
    
    // similar to render questions 
    const displayQuestions = () =>{
        let questionElements = [];
        questions.forEach((q)=>{
            questionElements.push(
                <div>
                    <QuestionTemplate
                        key={q._id}
                        q={q}
                        setCurrentQuestion ={props.setCurrentQuestion}
                        setPageName={props.setPageName}
                    />
                    <button onClick={()=>{handleQuestionEdit(q)}}>
                        Edit Question
                    </button>
                </div>
            );
        });
        return questionElements;
    }

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
    }

    const displayAnswers = () =>{
        let temp = [];
        answers.forEach((answer)=>{
            //console.log(a)
            temp.push(
                <div>
                    <AnswersTemplate
                        key={answer._id}
                        answer={answer}
                        setPageName={props.setPageName}
                        setCurrentAnswer={props.setCurrentAnswer}
                        userInfo={props.userInfo}
                        setCurrentQuestion={props.setCurrentQuestion}
                    />
                    <button onClick={()=>{handleAnswerEdit(answer)}}>
                            Edit Answer
                    </button>
                </div>
            )
        });
        return temp;
    }

    const handleQuestionEdit = (quest) =>{
        props.setCurrentQuestion(quest);
        props.setPageName("editQuestionPage");
    };

    const handleAnswerEdit = (ans) =>{
        props.setCurrentAnswer(ans);
        props.setPageName("editAnswerPage");
    }

    const displayAllUsers = () =>{
        if(props.userInfo.admin === true){
            return(
                <div className="allUsersContainer">
                    {/* use question template classname */}
                    {getAdminUserInfo()}
                </div>
            );
        }
        else{
            return <></>;
        }
    };
    const getAdminUserInfo = () => {
        let temp = [];
        for(let i = 0; i < adminGetUsersInfo.length ; i++){
            temp.push(
                <div key={adminGetUsersInfo[i]._id} className="question">
                    <div className="userDetails">
                        <div>
                            <h3>Username: {adminGetUsersInfo[i].username}</h3>
                            <h3>Email: {adminGetUsersInfo[i].email}</h3>
                            <h3>Reputation points: {adminGetUsersInfo[i].reputation}</h3>
                            <h3>Account age: {adminGetUsersInfo[i].account_created_date_time}</h3>
                        </div>
                    </div>
                    <div>
                        <button onClick={()=>{handleViewUserInfo(adminGetUsersInfo[i])}}>
                            View User Info
                        </button>
                        <button onClick={()=>{handleDeleteUser(adminGetUsersInfo[i])}}>
                            Delete User
                        </button>
                    </div>
                </div>
            );
        };
        return temp;
    };

    const handleViewUserInfo = (userInfoFromAdmin) =>{
        console.log(userInfoFromAdmin);
        props.setCurrentUser(userInfoFromAdmin);
        props.setPageName("userProfilePage");
    }

    const handleDeleteUser = async(userInfoFromAdmin) =>{
        //pop up confirmation window first on pressed
        let delWindow = window.confirm("Would you like to delete this user");
        if(delWindow){
            await axios.delete(`http://localhost:8000/users/delUser/${userInfoFromAdmin._id}`)
                .then((res) => {
                    console.log(res);
                    //window.location.reload();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        props.setPageName("userProfilePage");
    }


    return(
        <div id="userProfile">
            <Sidebar
                setPageName = {props.setPageName}
                setIsFilteredBy = {props.setIsFilteredBy}
            />
            <div className="subMain">
                <div className="userDetails">
                    <div>
                        <h1>User Profile</h1>
                        <h3>Username: {props.currentUser.username}</h3>
                        <h3>Email: {props.currentUser.email}</h3>
                        <h3>Reputation points: {props.currentUser.reputation}</h3>
                        <h3>Account age: {timeAgo}</h3>
                    </div>
                </div>

                {/* If admin run show all the users */}
                <div className={props.userInfo.admin === true ? "adminUsers" : 'hidden'}>
                    <h1 style={{marginTop: "20px"}}>All Users</h1>
                    <h3>{adminGetUsersInfo.length} Users</h3>
                    {displayAllUsers()}
                </div>

                <div className="userOverview">
                    <h1 style={{marginTop: "20px"}}>User Overview</h1>

                    <h3>{questions.length} questions</h3>
                    <div className="userQuestionsContainer">
                        {displayQuestions()}
                    </div>

                    <h3>{answers.length} answers</h3>
                    <div className="userAnswersContainer">
                        {displayAnswers()}
                    </div>

                    <h3>{tags.length} tags</h3>
                    <div id="tagsContainer">
                        {displayTags()}
                    </div>
                </div>
            </div>
        </div>
    );
}