import React from "react";
import { useState, useEffect} from "react";
import Sidebar from "../components/Sidebar.jsx";
import axios from "axios";

export default function EditQuestionPage(props){
    const [currentQuestData, setCurrentQuestData] = useState(props.currentQuestion);
    //have booelans for all the respective errors that could happen
    const [titleError, setTitleError] = useState(false);
    const [textError, setTextError] = useState(false);
    const [tagsError, setTagsError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [urlError, setUrlError] = useState(false);
    //get all tags 
    const [allTags, setAllTags] = useState([]);
    useEffect(()=>{
        axios.get("http://localhost:8000/tags")
            .then((res)=>{
                setAllTags(res.data);
            })
            .catch((err)=>{
                console.log(err);
            })
    });

    const handleTitleInput=(event)=>{
        currentQuestData.title = event.target.value;
    }
    const handleSummaryInput=(event)=>{
        currentQuestData.text = event.target.value;
    }
    const handleTagsInput=(event)=>{
        currentQuestData.tags = event.target.value.split(" ");
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
        setTitleError(false);
        setTextError(false);
        setTagsError(false);
        setUsernameError(false);
        setUrlError(false);
        let allChecks = true;
        
        //title checks
        if(currentQuestData.title === null || currentQuestData.title.length === 0 || currentQuestData.title.length > 50){
            console.log("INCHECKLIST");
            setTitleError(true);
            allChecks = false;
        }

        //questions checks
        if(currentQuestData.text === null || currentQuestData.text.length === 0 || currentQuestData.text.length > 140){
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
        
        //tag input checks
        if(currentQuestData.tags.length > 5){
            setTagsError(true);
            allChecks = false;
        }

        for(let i=0; i<currentQuestData.tags.length; i++){
            if(currentQuestData.tags[i].length > 10){
                setTagsError(true);
                allChecks = false;
                break;
            }
        }
        return allChecks;
    }

    const editQuestion = async() =>{
        await axios.put(`http://localhost:8000/questions/update/${currentQuestData._id}`, currentQuestData)
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    
    const handleDeleteQuestionButt=async(event)=>{
        event.preventDefault();

        // delete all the answers of the question
        for(const answer of currentQuestData.answers){
            console.log(answer);
            await axios.delete(`http://localhost:8000/answers/delete/${answer._id}`)
                    .then((res) => {
                        console.log(`Answer ${answer._id} deleted successfully`);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
        }

        // then delete question 
        await axios.delete(`http://localhost:8000/questions/delete/${currentQuestData._id}`)
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
                        <h1 className="pageSubTitle">Question Title*</h1>
                        <h4 className="subsubTitle">Limit title to 50 characters or less</h4>
                        <input type="text" className="smallInputBox" id="titleIn" onChange={handleTitleInput} defaultValue={currentQuestData.title}/>

                        <div className={titleError ? "Fail" : "Ok"}>
                            Title cannot be empty or greater than 50 characters
                        </div>


                        <h1 style={{paddingTop:"10px"}} className="pageSubTitle">Question Text*</h1>
                        <h4 className="subsubTitle">Limit summary to 140 characters</h4>
                        <input type="text" className="bigInputBox" id="detailsInIn" onChange={handleSummaryInput} defaultValue={currentQuestData.text}/>

                        <div className={textError ? "Fail" : "Ok"}>
                            Summary can't be empty 
                        </div>
                        <div className={urlError ? "Fail" : "Ok"}>
                            Hyperlink format incorrect. Must being with "https://" or "http://" and has to be valid and non-empty
                        </div>
                       

                        <h1 style={{paddingTop:"10px"}} className="pageSubTitle">Tags*</h1>
                        <h4 className="subsubTitle">Add keywords separated by whitespace</h4>
                        <input type="text" className="smallInputBox" id="titleIn" onChange={handleTagsInput} defaultValue={currentQuestData.tags.map(tag => tag.name).join(' ')}/>

                        <div className={tagsError ? "Fail" : "Ok"}>
                            Must have maximum 5 tags and each tag must be less than 10 characters
                        </div>

                        <div id="bottomDiv">
                            <button className="postQuestion" onClick={handleEditQuestionButt}>
                                Edit Question
                            </button>
                            <button className="postQuestion" onClick={handleDeleteQuestionButt}>
                                Delete Question
                            </button>
                            <h4 style={{color: 'red', margin: '0'}}>* indicates mandatory fields</h4>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}