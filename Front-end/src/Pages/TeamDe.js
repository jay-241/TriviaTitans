import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';

const TeamDetails = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]); 
  const [adminEmailID, setAdmin] = useState('');

  const [joinOrCreateMessage, setJoinOrCreateMessage] = useState('');

  const currentUserEmail = localStorage.getItem('userEmail');
  const [teamName, setTeamName] = useState('');
  const realTeamName = teamName.replace("_", " ")
  

  useEffect(() => {
    const fetchUserTeamName = async () => {
      try {
        const response = await axios.get(`https://wlfhjj5a5a.execute-api.us-east-1.amazonaws.com/game/get-team?emailID=${currentUserEmail}`);
        if (response.status === 200) {
          const teamname = response.data.body;
          localStorage.setItem('teamName', teamname);
          setTeamName(teamname);
        } else {
          setJoinOrCreateMessage('Join or Create a Team');
        }
      } catch (error) {
        console.error('Error fetching user teamname:', error);
      }
    };
    
  
    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(`https://wlfhjj5a5a.execute-api.us-east-1.amazonaws.com/game/team-details?teamname=${teamName.replace(/\s/g, '_')}`);
        const { data } = response;
        // console.log(response.data.body);
        setTeamMembers(data.body.members);
        setAdmin(data.body.admin);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchUserTeamName();
    fetchTeamDetails();
  }, [currentUserEmail, teamName]);
  

  const handlePromoteAdmin = async (emailID) => {
    // Check if the emailID is the admin emailID
    if (emailID === adminEmailID) {
      alert('You cannot promote the admin.');
      return;
    }
    try {
        const messageBody = {
            teamname: realTeamName,
            admin: emailID
          };

        const apiEndpoint = 'https://wlfhjj5a5a.execute-api.us-east-1.amazonaws.com/game/update-team'; // Replace with your actual API endpoint
        const response = await axios.post(apiEndpoint, messageBody);
        console.log('API response:', response.data);
        setTimeout(() => {
            window.location.reload();
          }, 2000);
      } catch (error) {
        console.error(error);
      }
  };

  const handleRemoveMember = async (emailID) => {
    // Check if the emailID is the admin emailID
    if (emailID === adminEmailID) {
      alert('You cannot remove the admin.');
      return;
    }

    try {
        const messageBody = {
            teamname: realTeamName,
            deleteMember: emailID
          };

        const apiEndpoint = 'https://wlfhjj5a5a.execute-api.us-east-1.amazonaws.com/game/update-team'; // Replace with your actual API endpoint
        const response = await axios.post(apiEndpoint, messageBody);
        console.log('API response:', response.data);
        setTimeout(() => {
            window.location.reload();
          }, 2000);
      } catch (error) {
        console.error(error);
      }
  };

  const handleLeaveTeam = async () => {
    // Check if the logged-in user is the admin
    if (currentUserEmail === adminEmailID) {
      alert('Admin cannot leave the team.');
      return;
    }

    try {
        const messageBody = {
            teamname: realTeamName,
            deleteMember: currentUserEmail
          };

        const apiEndpoint = 'https://wlfhjj5a5a.execute-api.us-east-1.amazonaws.com/game/update-team'; // Replace with your actual API endpoint
        const response = await axios.post(apiEndpoint, messageBody);
        console.log('API response:', response.data);
        setTimeout(() => {
            window.location.reload();
          }, 3000);
      } catch (error) {
        console.error(error);
      }
  };



  const handleCreateTeam = () => {
    navigate('/create-team');
  };
  

  const handleReloadPage = () => {
    window.location.reload();
  };

  const handleJoinGame = () => {
    navigate('/join-game');
  };

  const handleTeamStats = () => {
    navigate('/team-stats');
  };


  return (
    <div>
      <Header />
      <div className="container mt-4">
      {joinOrCreateMessage && <p className="text-center">{joinOrCreateMessage}</p>}
        <div className="text-center mb-2">
          <button className="btn btn-primary" onClick={handleCreateTeam}>
            Create Team
          </button> <span/>
          <button className="btn btn-primary" onClick={handleReloadPage}>
            Reload Page
          </button>
        </div>
        <h2 className="text-center mb-4">Team Details: {realTeamName}</h2>
        
        {teamMembers && teamMembers.map((member) => (
          <div key={member} className="card mb-2">
            <div className="card-body d-flex justify-content-between align-items-center">
              <span>{member}</span>
              {adminEmailID === currentUserEmail && (
                <div>
                  <button
                    className='btn btn-success'
                    onClick={() => handlePromoteAdmin(member)}
                  >
                    Promote to Admin
                  </button> <span/> 
                  <button
                    className='btn btn-danger'
                    onClick={() => handleRemoveMember(member)}
                  >Remove Member
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="text-center mt-4">
          <button className="btn btn-warning" onClick={handleLeaveTeam}>
            Leave Team
          </button> <span/>
          <button className="btn btn-primary" onClick={handleJoinGame}>
            Join Game
          </button> <span/>
          {teamName && (
            <>
              <span />
              <button className="btn btn-primary" onClick={handleTeamStats}>
                View Stats
              </button>
            </>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default TeamDetails;
