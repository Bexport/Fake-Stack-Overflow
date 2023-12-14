import React from "react";
import { useState, useEffect} from "react";
import Sidebar from "../components/Sidebar.jsx";
import axios from "axios";

export default function EditQuestionPage(props){
    const [currentQuestData, setCurrentQuestData] = useState(props.currentTag);
    //have booelans for all the respective errors that could happen
    const [textError, setTextError] = useState(false);
    const [tagsError, setTagsError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [urlError, setUrlError] = useState(false);

    
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
        setTagsError(false);
        let allChecks = true;
        
        //tag input checks
        if(props.currentTag.name.length > 10){
            setTagsError(true);
            allChecks = false;
        }
        return allChecks;
    }

    const handleSummaryInput=(event)=>{
        currentQuestData.name = event.target.value;
    }
    const editQuestion = async() =>{
        await axios.put(`http://localhost:8000/tags/update/${currentQuestData._id}`, currentQuestData)
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
        await axios.delete(`http://localhost:8000/tags/delete/${currentQuestData._id}`)
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
                        <h1 style={{paddingTop:"10px"}} className="pageSubTitle">Tag Name*</h1>
                        <input type="text" className="smallInputBox" id="detailsInIn" onChange={handleSummaryInput} defaultValue={currentQuestData.name}/>

                        <h1 className={tagsError?'pwFail':'pwOK'}>

                        </h1>
                        <div id="bottomDiv">
                            <button className="postQuestion" onClick={handleEditQuestionButt}>
                                Edit Tag
                            </button>
                            <button className="postQuestion" onClick={handleDeleteQuestionButt}>
                                Delete Tag
                            </button>
                            <h4 style={{color: 'red', margin: '0'}}>* indicates mandatory fields</h4>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}