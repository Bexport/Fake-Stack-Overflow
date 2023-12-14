import React from "react";

export default function Sidebar(props){
    // MAKE SURE TO ADD FUNCTIONS AND SHIT AFTER

    const handleQuestionsButton = () => {
        props.setIsFilteredBy(false);
        props.setPageName("homePage");
    };
    const handleTagsButton = () => {
        props.setPageName("tagsPage");
    };

    return(
        <div id = 'sideBorder'>
            <button className="sidebarButton" id="questionsButton" onClick={handleQuestionsButton}>Questions</button>
            <button className="sidebarButton" id="tagsButton" onClick={handleTagsButton}>Tags</button>
        </div>
    );
}