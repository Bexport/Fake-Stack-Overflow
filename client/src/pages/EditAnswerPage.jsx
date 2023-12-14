import React from "react";
import { useState, useEffect} from "react";
import Sidebar from "../components/Sidebar.jsx";
import axios from "axios";

export default function EditQuestionPage(props){
    const [currentQuestData, setCurrentQuestData] = useState(props.currentAnswer);
    //have booelans for all the respective errors that could happen
    const [textError, setTextError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [urlError, setUrlError] = useState(false);

    
    const handleSummaryInput=(event)=>{
        currentQuestData.text = event.target.value;
    }

    const handleEditQuestionButt = async (event)=>{
        event.preventDefault();
        if(checklist()){
            setCurrentQuestData(currentQuestData);
            await editQuestion();
            props.setPageName('userProfilePage');
        }
    }

    // check all the errors
    const checklist = () =>{
        // clear previous error states
        setTextError(false);
        let allChecks = true;
        
        if(currentQuestData.text === null || currentQuestData.text.length === 0){
            setTextError(true);
            allChecks = false;
        }

        //double check hyperlinks pattern
        const hyperlinkRegex = /\[([^\]]+)\]\(([^)]+)\)/;
        let linkCheck = hyperlinkRegex.exec(currentQuestData.text)
        //[example.com](https://example.com)
        while(linkCheck !== null){
            let url = linkCheck[2];
            if(!url || !(url.startsWith("http://") || url.startsWith("https://") )){
                setUrlError(true);
                allChecks = false;
                console.log("invalid hyperlink");
                break;
            }
        }
        
        return allChecks;
    }

    const editQuestion = async() =>{
        await axios.put(`http://localhost:8000/answers/update/${currentQuestData._id}`, currentQuestData)
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    const handleDeleteQuestionButt=async(event)=>{
        event.preventDefault();
        // delete answer
        await axios.delete(`http://localhost:8000/answers/delete/${currentQuestData._id}`)
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        props.setPageName("userProfilePage");
    }

    return(
        <div className="editQuestion">
            <Sidebar
                setPageName = {props.setPageName}
                setIsFilteredBy = {props.setIsFilteredBy}
            />
            <div className="subMain">
            <div className="subHead">
                    <form id="questionForm">
                        <h1 style={{paddingTop:"10px"}} className="pageSubTitle">Answer Text*</h1>
                        <input type="text" className="bigInputBox" id="detailsInIn" onChange={handleSummaryInput} defaultValue={currentQuestData.text}/>

                        <div className={textError ? "Fail" : "Ok"}>
                            Summary can't be empty 
                        </div>
                        <div className={urlError ? "Fail" : "Ok"}>
                            Hyperlink format incorrect. Must being with "https://" or "http://" and has to be valid and non-empty
                        </div>
                    
                        <div id="bottomDiv">
                            <button className="postQuestion" onClick={handleEditQuestionButt}>
                                Edit Answer
                            </button>
                            <button className="postQuestion" onClick={handleDeleteQuestionButt}>
                                Delete Answer
                            </button>
                            <h4 style={{color: 'red', margin: '0'}}>* indicates mandatory fields</h4>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}