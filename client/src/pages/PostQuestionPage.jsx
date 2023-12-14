import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar.jsx";

export default function PostQuestionPage(props){
    // do i have to set it as undefined here
    const [newQuestionInfo, setNewQuestionInfo] = useState({
        title: '',
        text: '',
        tags: [],
        answers: [],
        asked_by: props.userInfo.username,
        asked_by_id: props.userInfo._id,
        ask_date_time: new Date(),
        views: 0,
        upvotes: 0,
        downvotes: 0,
        comments: [],
    });
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

    //have booelans for all the respective errors that could happen
    const [titleError, setTitleError] = useState(false);
    const [textError, setTextError] = useState(false);
    const [tagsError, setTagsError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [urlError, setUrlError] = useState(false);

    const handleTitleInput=(event)=>{
        newQuestionInfo.title = event.target.value;
    }
    const handleSummaryInput=(event)=>{
        newQuestionInfo.text = event.target.value;
    }
    const handleTagsInput=(event)=>{
        newQuestionInfo.tags = event.target.value.split(" ");
    }

    // submit the shit
    const handlePostQuestionButt = async (event)=>{
        event.preventDefault();
        if(checklist()){
            newQuestionInfo.tags.forEach(async(tag) => {
                // check if the current tag exists in the tags list
                const hasTag = allTags.some((t) => tag === t.name);
                
                if (hasTag === false && props.userInfo.reputation > 50) {
                    await addNewTag(tag);
                }
            });

            //regrab the tags and shit 
            // let update = await axios.get("http://localhost:8000/tags")
            //                         .then(response => setAllTags(response.data));
            // update = update.data;
            const response = await axios.get("http://localhost:8000/tags");
            setAllTags(response.data);
            let update = response.data;

            console.log("Updated Tags: " + allTags);

            // update the new question info tags
            let tagSet = new Set(newQuestionInfo.tags);
            newQuestionInfo.tags = [];
            newQuestionInfo.tags = update.filter(t => tagSet.has(t.name));
            console.log("Updated Question Tags: " + newQuestionInfo.tags);
            
            setNewQuestionInfo(newQuestionInfo);
            await addNewQuestion();
            props.setPageName('homePage');
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
        if(newQuestionInfo.title === null || newQuestionInfo.title.length === 0 || newQuestionInfo.title.length > 50){
            console.log("INCHECKLIST");
            setTitleError(true);
            allChecks = false;
        }

        //questions checks
        if(newQuestionInfo.text === null || newQuestionInfo.text.length === 0 || newQuestionInfo.title.length > 140){
            setTitleError(true);
            allChecks = false;
        }

        //double check hyperlinks pattern
        const hyperlinkRegex = /\[([^\]]+)\]\(([^)]+)\)/;
        let linkCheck = hyperlinkRegex.exec(newQuestionInfo.text)
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
        if(newQuestionInfo.tags.length > 5){
            setTagsError(true);
            allChecks = false;
        }

        for(let i=0; i<newQuestionInfo.tags.length; i++){
            if(newQuestionInfo.tags[i].length > 10){
                setTagsError(true);
                allChecks = false;
                break;
            }
        }

        return allChecks;
    }

    const addNewTag = async (t) =>{
        console.log("Adding new tag: " + t);
        await axios.post("http://localhost:8000/tags/add", {name: t, asked_by_id: props.userInfo._id})
                    .then((res)=>{
                        console.log(res.data);
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
    }

    const addNewQuestion = async ()=>{
        console.log("Adding new question");
        await axios
            .post("http://localhost:8000/questions/add", newQuestionInfo)
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return(
        <div id="postQuestionPage">
            <Sidebar
                setPageName={props.setPageName}
                setIsFilteredBy={props.setIsFilteredBy}
            />
            <div className="subMain">
                <div className="subHead">
                    <form id="questionForm">
                        <h1 className="pageSubTitle">Question Title*</h1>
                        <h4 className="subsubTitle">Limit title to 50 characters or less</h4>
                        <input type="text" className="smallInputBox" id="titleIn" onChange={handleTitleInput}/>

                        <div className={titleError ? "Fail" : "Ok"}>
                            Title cannot be empty or greater than 50 characters
                        </div>


                        <h1 style={{paddingTop:"10px"}} className="pageSubTitle">Question Text*</h1>
                        <h4 className="subsubTitle">Limit summary to 140 characters</h4>
                        <input type="text" className="bigInputBox" id="detailsInIn" onChange={handleSummaryInput}/>

                        <div className={textError ? "Fail" : "Ok"}>
                            Summary can't be empty 
                        </div>
                        <div className={urlError ? "Fail" : "Ok"}>
                            Hyperlink format incorrect. Must being with "https://" or "http://" and has to be valid and non-empty
                        </div>
                       

                        <h1 style={{paddingTop:"10px"}} className="pageSubTitle">Tags*</h1>
                        <h4 className="subsubTitle">Add keywords separated by whitespace</h4>
                        <input type="text" className="smallInputBox" id="titleIn" onChange={handleTagsInput}/>

                        <div className={tagsError ? "Fail" : "Ok"}>
                            Must have maximum 5 tags and each tag must be less than 10 characters
                        </div>

                        <div id="bottomDiv">
                            <button className="postQuestion" onClick={handlePostQuestionButt}>
                                Post Question
                            </button>
                            <h4 style={{color: 'red', margin: '0'}}>* indicates mandatory fields</h4>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}