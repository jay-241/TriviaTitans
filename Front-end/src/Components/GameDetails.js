import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios library for making API calls
import '../Styles/styles.css';
import { useNavigate } from 'react-router-dom';

const GameDetails = ({ games }) => {

  const navigate = useNavigate();

  const currentUserEmail = localStorage.getItem('userEmail');
  const teamName = localStorage.getItem('teamName');
  // const realTeamName = teamName.replace("_", " ");

  const calculateTimeRemaining = (startTime) => {
    const currentTime = new Date();
    const gameStartTime = new Date(startTime);
    const timeDifference = gameStartTime.getTime() - currentTime.getTime();
    const timeRemainingInSeconds = Math.max(0, Math.floor(timeDifference / 1000));
    return timeRemainingInSeconds;
  };

  const handleJoinGame = async (teamName, gameID) => {
    try {
      // Create the message body for the POST request
      const messageBody = {
        teamname: teamName,
        gameID: gameID,
      };

      // Make the POST request to join the game
      const apiEndpoint = 'https://wlfhjj5a5a.execute-api.us-east-1.amazonaws.com/game/join-game'; // Replace with your actual API endpoint
      const response = await axios.post(apiEndpoint, messageBody);
      localStorage.setItem("gameID", gameID)
      navigate('/quiz')
      // Handle the response if needed (optional)
      console.log('Join game API response:', response.data);

      

      // You can add any additional logic here, for example, showing a success message to the user.
    } catch (error) {
      // Handle the error if the POST request fails (optional)
      console.error('Error joining game:', error);
    }
  };

  // Format the time remaining in a human-readable format
  const formatTimeRemaining = (timeRemaining) => {
    if (timeRemaining >= 86400) {
      // Display in days
      const days = Math.floor(timeRemaining / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    } else if (timeRemaining >= 3600) {
      // Display in hours
      const hours = Math.floor(timeRemaining / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else if (timeRemaining >= 60) {
      // Display in minutes
      const minutes = Math.floor(timeRemaining / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    } else {
      // Display in seconds
      return `${timeRemaining} ${timeRemaining === 1 ? 'second' : 'seconds'}`;
    }
  };

  return (
    <div>
      {games.map((game) => (
        <div key={game.gameId} className="event-details-container">
          <div className="row">
            <div className="col-sm-4">
              <p className="game-info">
                <span className="game-info-label">Category:</span> {game.categoryName}
              </p>
            </div>
            <div className="col-sm-4">
              <p className="game-info">
                <span className="game-info-label">Duration:</span> {game.duration}
              </p>
            </div>
            <div className="col-sm-4">
              <p className="game-info">
                <span className="game-info-label">Difficulty:</span> {game.difficulty}
              </p>
            </div>
          </div>
          <h3 className="event-name">{game.title}</h3>
          <div className="row">
            <div className="col-sm-6">
              <p className="participants">Participants: {game.participants}</p>
            </div>
            <div className="col-sm-6">
              <p className="time-remaining">Time Remaining: {formatTimeRemaining(calculateTimeRemaining(game.startTime))}</p>
            </div>
          </div>
          {/* <p className="description">{game.Description}</p> */}
          <div className="col text-center">
            <button
              className="btn btn-primary btn-join"
              onClick={() => handleJoinGame(teamName, game.gameId)}
            >
              Join
            </button>
          </div>
        </div>
      ))}
    </div>
  );
    
};

export default GameDetails;
