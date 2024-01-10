import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/Quiz.css';
import Header from '../Components/Header';
import ChatRoom from '../Components/ChatRoom';

const Quiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [userSelectedAnswer, setUserSelectedAnswer] = useState('');
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(60);
  const [categories, setCategories] = useState([]);
  const [difficulty, setDifficulty] = useState([]);
  const [categoryName, setCategoryName] = useState(''); // New state for category name
  const countdownRef = useRef();
  const navigate = useNavigate();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const gamesId = localStorage.getItem('gameID');
  const teamName = localStorage.getItem('teamName');
  // const gamesId = 'W0hUiYQlR3nu5UesQ4wy';

  const chatboxStyle = {
    position: 'fixed',
    bottom: '15px',
    right: '15px',
    width: '500px',
    height: '500px',
    // border: '1px solid #ccc', 
    // overflow: 'hidden' 
};

  useEffect(() => {

    if (localStorage.getItem('token')) {
            setIsLoggedIn(true);     
    }

    const fetchData = async () => {
      try {
        const response = await axios.post(
          'https://gceak8vzy1.execute-api.us-east-1.amazonaws.com/dev/gamesquestions',
          {
            gamesId: gamesId,
          }
        );

        setQuizData(response.data.results);
        setSelectedOptions(new Array(response.data.results.length).fill([]));

        // Assuming the API response contains categories and difficulty for each question
        // Update the state using the correct keys
        const categories = response.data.results.map((question) => question.categories);
        const difficulty = response.data.results.map((question) => question.difficulty);

        setCategories(categories);
        setDifficulty(difficulty);

        // Get the category name from the API response for the current game
        const filteredGameResponse = await axios.post(
          'https://gceak8vzy1.execute-api.us-east-1.amazonaws.com/dev/filteredgames',
          {
            gameId: gamesId,
          }
        );
        const categoryInfo = filteredGameResponse.data.response.find(
          (game) => game.gameId === gamesId
        );
        if (categoryInfo) {
          setCategoryName(categoryInfo.categoryName);
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchData();
  }, [gamesId]);

  
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0));
    }, 1000);

    return () => clearInterval(countdownRef.current);
  }, [currentQuestionIndex]);

  const handleOptionClick = (questionIndex, optionIndex) => {
    setUserSelectedAnswer(quizData[questionIndex].options[optionIndex]);

    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[questionIndex] = [optionIndex];
    setSelectedOptions(updatedSelectedOptions);
  };

  const handleSubmitAnswer = () => {
    if (countdown > 0) {
      setCorrectAnswer(quizData[currentQuestionIndex]?.correctAns[0] || '');
      setAnswerSubmitted(true);

      if (userSelectedAnswer === quizData[currentQuestionIndex]?.correctAns[0]) {
        setScore((prevScore) => prevScore + 10);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCountdown(60);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setCorrectAnswer('');
      setUserSelectedAnswer('');
      setAnswerSubmitted(false);
    }
  };

 

  const handleSubmitQuiz = async () => {
    // Perform the actions before submitting the quiz
    try {
      // API 1: Create table with teamname
      await axios.post(
        'https://d6x5p3bllk.execute-api.us-east-1.amazonaws.com/prod/createtable',
        {
          teamname: teamName,
        }
      );
      console.log('Table created successfully with teamname');
  
  
      // Additional API 1: Update team table
      await axios.post(
        'https://d6x5p3bllk.execute-api.us-east-1.amazonaws.com/prod/updateteamtable',
        {
          teamName: teamName,
          categoryName: categoryName, 
          score: score,
        }
      );
      console.log('Team table updated successfully');
  

        //Store Game Stats -- @Mudra

        const messageBody = {
          teamname: teamName,
          gameID: gamesId,
          score: score
        };
        // Make the POST request to join the game
        const apiEndpoint = 'https://wlfhjj5a5a.execute-api.us-east-1.amazonaws.com/game/join-game'; // Replace with your actual API endpoint
        const response = await axios.post(apiEndpoint, messageBody);
        // Handle the response if needed (optional)
        console.log('Game Stored: ', response.data);



      console.log('User score table updated successfully');
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    }
    navigate('/team-stats');
  };
  
  

  const currentQuestion = quizData[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizData.length - 1;

  return (
    <>
    {isLoggedIn?
    <div>
        <Header />
      <div className="quiz-container">
      <h1>{teamName}</h1>

      <div className="score-container">
        <h2>Current Score</h2>
        <p>You scored: {score}</p>
      </div>

      {/* Display categories and difficulty */}
      {categories.length > 0 && difficulty.length > 0 && (
        <div className="question-info">
          <p>Category: {categoryName}</p>
          <p>Difficulty: {difficulty[currentQuestionIndex]}</p>
        </div>
      )}

      {currentQuestion && (
        <div className="question-container">
          <p>Time remaining: {countdown}</p>
          <h2>Question {currentQuestionIndex + 1}</h2>
          <p>{currentQuestion.subject}</p>
          <ul>
            {currentQuestion.options.map((option, optionIndex) => (
              <li key={optionIndex}>
                <button
                  onClick={() => handleOptionClick(currentQuestionIndex, optionIndex)}
                  className={
                    selectedOptions[currentQuestionIndex]?.includes(optionIndex)
                      ? 'selected-option'
                      : ''
                  }
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
          {correctAnswer && <p>Correct Answer: {correctAnswer}</p>}
          {userSelectedAnswer && <p>Your selected answer: {userSelectedAnswer}</p>}
          {isLastQuestion ? (
            <div>
              {!answerSubmitted && (
                <button
                  onClick={handleSubmitAnswer}
                  className="submit-answer-btn"
                  disabled={!userSelectedAnswer} // Button is disabled if no answer is selected
                >
                  Submit Answer
                </button>
              )}
              <button onClick={handleSubmitQuiz} className="submit-quiz-btn">
                Submit Quiz
              </button>
            </div>
          ) : (
            <div>
              {!answerSubmitted && (
                <button
                  onClick={handleSubmitAnswer}
                  className="submit-answer-btn"
                  disabled={!userSelectedAnswer} // Button is disabled if no answer is selected
                >
                  Submit Answer
                </button>
              )}
              <button onClick={handleNextQuestion} className="next-question-btn">
                Next Question
              </button>
            </div>
          )}
        </div>
      )}
    </div>
    <div style={chatboxStyle}>
                <ChatRoom />
            </div>
    </div> : null}
    </>
  );
};

export default Quiz;
