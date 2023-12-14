import TitleHeader from './TitleHeader.jsx';
// import Sidebar from './Sidebar.jsx';
import { useState } from 'react';
import AnswersPage from '../pages/AnswersPage.jsx';
import PostAnswerPage from '../pages/PostAnswerPage.jsx';
import TagsPage from '../pages/TagsPage.jsx';
import WelcomePage from '../pages/WelcomePage.jsx';
import HomePage from '../pages/HomePage.jsx';
import PostQuestionPage from '../pages/PostQuestionPage.jsx';
import PostCommentPage from '../pages/PostCommentPage.jsx';
import CommentsPage from '../pages/CommentsPage.jsx';
import UserProfilePage from '../pages/UserProfilePage.jsx';
import EditQuestionPage from '../pages/EditQuestionPage.jsx';
import EditAnswerPage from '../pages/EditAnswerPage.jsx';
import EditTagPage from '../pages/EditTagPage.jsx';
import PostAnsCommentPage from '../pages/PostAnsCommentPage.jsx';
import AdminUserPage from '../pages/AdminUserPage.jsx';

export default function FakeStackOverflow() {
  const [pageName, setPageName] = useState("welcomePage");

  // variable to contain the list of "filtered questions" to be displayed
  const [filteredQuestionList, setFilteredQuestionList] = useState(null);
  
  // state to see if we have to filter anything (tags, newest, user, etc.)
  const [isFilteredBy, setIsFilteredBy] = useState(false);
  const [isAnswerComment, setIsAnswerComment] = useState(false);

  // need a state to hold onto the current question for the answers page or comment or other shit
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [currentTag, setCurrentTag] = useState(null);

  // hold onto user info with default being a "GUEST"
  const [userInfo, setUserInfo] = useState({
    username: "Guest",
    email: "",
    password: "",
    reputation: 0,
});
const [currentUser, setCurrentUser] = useState(null);

  // conditional function for "switching" pages
  const loadPage = () =>{
    if(pageName === "welcomePage"){
      return(<WelcomePage
          setPageName={setPageName}
          setUserInfo={setUserInfo}
      />);
    }
    else if (pageName === "homePage"){
      return(<HomePage
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          setPageName={setPageName}
          isFilteredBy={isFilteredBy}
          setIsFilteredBy={setIsFilteredBy}
          setCurrentQuestion={setCurrentQuestion}
          setIsAnswerComment={setIsAnswerComment}
          isAnswerComment={isAnswerComment}
      />);
    }
    else if(pageName === "postQuestionPage"){
      return(<PostQuestionPage
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          setPageName={setPageName}
          setIsFilteredBy={setIsFilteredBy}
      />);
    }
    else if(pageName === "answersPage"){
      return(<AnswersPage
          userInfo={userInfo}
          setPageName={setPageName}
          currentQuestion={currentQuestion}
          currentAnswer={currentAnswer}
          isAnswerComment={isAnswerComment}
          setIsAnswerComment={setIsAnswerComment}
          setCurrentAnswer={setCurrentAnswer}
          setIsFilteredBy={setIsFilteredBy}
      />);
    }
    else if(pageName === "postAnswerPage"){
      return(<PostAnswerPage
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          setPageName={setPageName}
          pageName={pageName}
          currentQuestion={currentQuestion}
          setIsFilteredBy={setIsFilteredBy}
      />);
    }
    else if(pageName === "tagsPage"){
      return(<TagsPage
          userInfo={userInfo}
          setPageName={setPageName}
          setIsFilteredBy={setIsFilteredBy}
          isFilteredBy={isFilteredBy}
          setFilteredQuestionList={setFilteredQuestionList}
      />);
    }
    else if(pageName === "postCommentPage"){
      return(<PostCommentPage
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          setPageName={setPageName}
          isFilteredBy={isFilteredBy}
          setIsFilteredBy={setIsFilteredBy}
          currentAnswer={currentAnswer}
          currentQuestion={currentQuestion}
      />);
    }
    else if(pageName === "postAnsCommentPage"){
      return(<PostAnsCommentPage
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          setPageName={setPageName}
          isFilteredBy={isFilteredBy}
          setIsFilteredBy={setIsFilteredBy}
          currentAnswer={currentAnswer}
          currentQuestion={currentQuestion}
      />);
    }
    else if(pageName === "commentsPage"){
      return(<CommentsPage
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          setPageName={setPageName}
          isFilteredBy={isFilteredBy}
          setIsFilteredBy={setIsFilteredBy}
          isAnswerComment={isAnswerComment}
          setIsAnswerComment={setIsAnswerComment}
          currentAnswer={currentAnswer}
          currentQuestion={currentQuestion}
      />);
    }
    else if(pageName === "userProfilePage"){
      return(<UserProfilePage
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          setPageName={setPageName}
          pageName={pageName}
          isFilteredBy={isFilteredBy}
          setIsFilteredBy={setIsFilteredBy}
          currentAnswer={currentAnswer}
          setCurrentAnswer={setCurrentAnswer}
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          setFilteredQuestionList={setFilteredQuestionList}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          currentTag={currentTag}
          setCurrentTag={setCurrentTag}
      />);
    }
    else if(pageName === "adminUserPage"){
      return(<AdminUserPage
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          setPageName={setPageName}
          isFilteredBy={isFilteredBy}
          setIsFilteredBy={setIsFilteredBy}
          currentAnswer={currentAnswer}
          setCurrentAnswer={setCurrentAnswer}
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          setFilteredQuestionList={setFilteredQuestionList}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          currentTag={currentTag}
          setCurrentTag={setCurrentTag}
      />);
    }
    else if(pageName === "editQuestionPage"){
      return(<EditQuestionPage
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          setPageName={setPageName}
          isFilteredBy={isFilteredBy}
          setIsFilteredBy={setIsFilteredBy}
          currentAnswer={currentAnswer}
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          setFilteredQuestionList={setFilteredQuestionList}
      />);
    }
    else if(pageName === "editAnswerPage"){
      return(<EditAnswerPage
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          setPageName={setPageName}
          isFilteredBy={isFilteredBy}
          setIsFilteredBy={setIsFilteredBy}
          currentAnswer={currentAnswer}
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          setFilteredQuestionList={setFilteredQuestionList}
      />);
    }
    else if(pageName === "editTagPage"){
      return(<EditTagPage
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          setPageName={setPageName}
          isFilteredBy={isFilteredBy}
          setIsFilteredBy={setIsFilteredBy}
          currentAnswer={currentAnswer}
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          setFilteredQuestionList={setFilteredQuestionList}
          currentTag={currentTag}
          setCurrentTag={setCurrentTag}
      />);
    }
    // This is the modified home page to redirect to with the filtered questions 
    // i.e whenever you press "newest", "active", a tag name, or the search function will redirect here
    else if(pageName === "filteredHome"){
      return(<HomePage
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          setCurrentQuestion={setCurrentQuestion}
          setPageName={setPageName}
          isFilteredBy={true}
          setIsFilteredBy={setIsFilteredBy}
          filteredQuestionList={filteredQuestionList}
          setFilteredQuestionList={filteredQuestionList}
      />);
    }
  }
  return (
    <div id="pageContainer">
      {pageName === "welcomePage" ? null : (
        <TitleHeader
          pageName = {pageName}
          setPageName = {setPageName}
          setUserInfo = {setUserInfo}
          userInfo={userInfo}
          reputation={userInfo.reputation}
          setIsFilteredBy={setIsFilteredBy}
          setFilteredQuestionList={setFilteredQuestionList}
        />
      )}
      {loadPage()}
    </div>
  );
}
