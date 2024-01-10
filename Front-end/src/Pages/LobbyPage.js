import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GameDetails from '../Components/GameDetails';
import Header from '../Components/Header';
import ChatBot from '../Components/Chatbot';
const LobbyPage = () => {
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [duration, setDuration] = useState('');
  const [filteredGames, setFilteredGames] = useState([]);

  useEffect(() => {
    // Filter games based on the selected criteria
    let filteredGames = [];

    if (category) {
      axios
        .post('https://gceak8vzy1.execute-api.us-east-1.amazonaws.com/dev/filteredgames', {
          categoryId: category,
        })
        .then((response) => {
          console.log('POST request successful:', response.data);
          // Update the filteredGames state with the data received from the API
          setFilteredGames(response.data.response);
          setCategory('');
        })
        .catch((error) => {
          console.error('POST request failed:', error);
        }); 
    }

    if (difficulty) {
      axios
        .post('https://gceak8vzy1.execute-api.us-east-1.amazonaws.com/dev/filteredgames', {
          difficulty: difficulty,
        })
        .then((response) => {
          console.log('POST request successful:', response.data);
          // Update the filteredGames state with the data received from the API
          setFilteredGames(response.data.response);
          setDifficulty('');
        })
        .catch((error) => {
          console.error('POST request failed:', error);
        }); 
    }

    if (duration) {
      axios
        .post('https://gceak8vzy1.execute-api.us-east-1.amazonaws.com/dev/filteredgames', {
          duration: duration,
        })
        .then((response) => {
          console.log('POST request successful:', response.data);
          // Update the filteredGames state with the data received from the API
          setFilteredGames(response.data.response);
          setDuration('');
        })
        .catch((error) => {
          console.error('POST request failed:', error);
        }); 
    }
  }, [category, difficulty, duration]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const handleDurationChange = (event) => {
    const selectedDuration = event.target.value;
    const durationInt = parseInt(selectedDuration, 10);

    setDuration(durationInt);
  };

  console.log(filteredGames)

  return (
    <div>
      <Header/>
      <ChatBot/>
    <div className="container mt-4">
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label>Category:</label>
            <select className="form-control" value={category} onChange={handleCategoryChange}>
              <option value="">Select a category</option>
              <option value="DQF9lQHFq4N8zXS6CMpt">Cloud</option>
              <option value="Euw0SWCIL97yPB11ok7C">Fitness</option>
              <option value="TQzoGjwRcJkZPQyQ02bL">Sports</option>
              <option value="rw4PQ5YiX3HeeDe2o38M">Computer Science</option>
              <option value="tSfIYc21C2iuTt5Xtptv">Dance</option>
              <option value="zqctudS2FktOjZdGuS6T">Music</option>
            </select>
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label>Difficulty:</label>
            <select className="form-control" value={difficulty} onChange={handleDifficultyChange}>
              <option value="">Select a difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="difficult">Difficult</option>
            </select>
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label>Duration:</label>
            <select className="form-control" value={duration} onChange={handleDurationChange}>
              <option value="">Select time remaining</option>
              <option value="40">40 minutes</option>
              <option value="80">80 minutes</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        </div>
      </div>
      <GameDetails games={filteredGames} />
    </div>
    </div>
  );
};

export default LobbyPage;
