import React from "react";
import '../stylesheets/App.css';

export default function TagTemplate(props){
    // find the questions that have this tag associated
    const findQwithT = () =>{
        let temp = []
        let allQ = props.questions;
        allQ.forEach((q)=>{
            //console.log(q, props.tag.tid);
            q.tags.forEach((t)=>{
                if (t.name === props.tag.name){
                    temp.push(q);
                }
            });
        });
        return temp;
    }

    // When the tag name is pressed, it'll bring us to the "home" page with questions 
    // that have that tag. I have a variable that contains the set of "filtered" questions
    const handleTagClick = () =>{
        props.setIsFilteredBy(true);
        props.setFilteredQuestionList(findQwithT());
        console.log(findQwithT());
        //console.log("tag q filter", findQwithT());
        props.setPageName("filteredHome");
    }

    const handleTagEdit = (tag) =>{
        props.setCurrentTag(tag);
        props.setPageName("editTagPage");
    }

    return(
        <div className="tag">
            <div className="tagname" style={{color:"blue"}}
                onClick={handleTagClick}
            >
                {props.tag.name}
            </div>
            <h4 className="numOfTag">
                {findQwithT().length} questions
            </h4>
            <button className={props.pageName===('userProfilePage' || 'adminUserPage') ? '' : 'hidden'}
                    onClick={()=>{handleTagEdit(props.tag)}}>
                Edit Tag
            </button>
        </div>
    );
}