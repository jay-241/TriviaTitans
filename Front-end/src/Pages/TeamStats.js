import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Components/Header';

const TeamStats = () => {
  const [teamDetails, setTeamDetails] = useState([]);
  const [joinOrCreateMessage, setJoinOrCreateMessage] = useState('');

  useEffect(() => {
    // Fetch team details from the API
    const fetchTeamDetails = async () => {
      try {
        const teamName = localStorage.getItem('teamName');
        if (!teamName) {
          setJoinOrCreateMessage('Create or Join a Team');
        } else {
          const response = await axios.get(`https://wlfhjj5a5a.execute-api.us-east-1.amazonaws.com/game/team-stats?TeamName=${teamName.replace(/\s/g, '_')}`);
          setTeamDetails(response.data.body);
          console.log(response.data.body);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeamDetails();
  }, []);

  return (
    <div>
      <Header />

      <div className="container mt-4">
        {joinOrCreateMessage ? (
          <p className="text-center">{joinOrCreateMessage}</p>
        ) : teamDetails && Object.keys(teamDetails).length > 0 ? (
          <>
            <h2 className="text-center mb-4">{teamDetails.TeamName}</h2>
            <div className="card mb-4">
              <div className="card-header">
                <h4>Members</h4>
              </div>
              <div className="card-body">
                <ul className="list-group">
                  {teamDetails.Members &&
                    teamDetails.Members.map((member) => (
                      <li key={member} className="list-group-item">
                        {member}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div className="card mb-4">
              <div className="card-header">
                <h4>Games Played</h4>
              </div>
              <div className="card-body">
                <p>Number of Games Played: {teamDetails.NumberOfGamesPlayed}</p>
              </div>
            </div>
            <div className="card mb-4">
              <div className="card-header">
                <h4>Total Score</h4>
              </div>
              <div className="card-body">
                <p>Total Score: {teamDetails.TotalScore}</p>
              </div>
            </div>
          </>
        ) : (
          <p>Loading team details...</p>
        )}
      </div>
    </div>
  );
};

export default TeamStats;
