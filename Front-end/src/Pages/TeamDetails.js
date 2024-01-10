import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import ChatBot from '../Components/Chatbot';
const TeamDetails = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]); 
  const [adminEmailID, setAdmin] = useState('');

  const [promoteButtonPressed, setPromoteButtonPressed] = useState(false);
  const [removeButtonPressed, setRemoveButtonPressed] = useState(false);
  const [saveChangesButtonPressed, setSaveChangesButtonPressed] = useState(false);
  const [joinOrCreateMessage, setJoinOrCreateMessage] = useState('');
  
  const[newAdmin, updateAdmin] = useState('');
  const[newMembers, updateMembers] = useState('');

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
        updateMembers(data.body.members);
        setAdmin(data.body.admin);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchUserTeamName();
    fetchTeamDetails();
  }, [currentUserEmail, teamName]);
  

  const handlePromoteAdmin = (emailID) => {
    // Check if the emailID is the admin emailID
    if (emailID === adminEmailID) {
      alert('You cannot promote the admin.');
      return;
    }
    updateAdmin(emailID);
    setPromoteButtonPressed(true);
    setRemoveButtonPressed(false);
    setSaveChangesButtonPressed(false);
  };

  const handleRemoveMember = (emailID) => {
    // Check if the emailID is the admin emailID
    if (emailID === adminEmailID) {
      alert('You cannot remove the admin.');
      return;
    }

    // Remove the member from the teamMembers state
    updateMembers((prevMembers) =>
      prevMembers.filter((member) => member!== emailID)
    );

    
    setPromoteButtonPressed(false);
    setRemoveButtonPressed(true);
    setSaveChangesButtonPressed(false);
  };

  const handleLeaveTeam = async () => {
    // Check if the logged-in user is the admin
    if (currentUserEmail === adminEmailID) {
      alert('Admin cannot leave the team.');
      return;
    }

    // Remove the logged-in user from the teamMembers state
    updateMembers((prevMembers) =>
      prevMembers.filter((member) => member!== currentUserEmail)
    );

    try {
      // Create the message body without the member to be removed
      const messageBody = {
        teamname: realTeamName,
        admin: adminEmailID,
        members: newMembers,
        deleteMember: currentUserEmail // Updated members list without the removed member
      };

      if (newAdmin !== adminEmailID) {
        messageBody.admin = newAdmin;
      }

      if (newAdmin !== adminEmailID || JSON.stringify(newMembers) !== JSON.stringify(teamMembers)) {
        const apiEndpoint = 'https://wlfhjj5a5a.execute-api.us-east-1.amazonaws.com/game/update-team'; // Replace with your actual API endpoint
        const response = await axios.post(apiEndpoint, messageBody);
  
        console.log('API response:', response.data);
        setSaveChangesButtonPressed(true);
      } else {
        // Data hasn't changed, do not make the API call
        console.log('No changes to save.');
      }
  
      // const apiEndpoint = 'https://wlfhjj5a5a.execute-api.us-east-1.amazonaws.com/game/update-team'; // Replace with your actual API endpoint
      // const response = await axios.post(apiEndpoint, messageBody);
  
      // console.log('API response:', response.data);
      // setSaveChangesButtonPressed(true);

      setTimeout(() => {
        window.location.reload();
      }, 3000);
      
    } catch (error) {
      console.error(error);
    }
    
  };

  const handleSaveDetails = async () => {
    try {
      // Create the message body with the original data
      const messageBody = {
        teamname: realTeamName,
        admin: adminEmailID,
        members: teamMembers,
      };
  
      // Add the newAdmin to the message body only if it's different from the original data
      if (newAdmin !== adminEmailID) {
        messageBody.admin = newAdmin;
      }
  
      // Add the newMembers to the message body only if they are different from the original data
      if (JSON.stringify(newMembers) !== JSON.stringify(teamMembers)) {
        messageBody.members = newMembers;
      }

      // console.log(messageBody)
  
      // Make the POST request to the API with the message body if there are any changes
      if (newAdmin !== adminEmailID || JSON.stringify(newMembers) !== JSON.stringify(teamMembers)) {
        const apiEndpoint = 'https://wlfhjj5a5a.execute-api.us-east-1.amazonaws.com/game/update-team'; // Replace with your actual API endpoint
        const response = await axios.post(apiEndpoint, messageBody);
  
        console.log('API response:', response.data);
        setSaveChangesButtonPressed(true);
      } else {
        // Data hasn't changed, do not make the API call
        console.log('No changes to save.');
      }
  
      // Reload the page after 1 second
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
      <ChatBot />
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
                    className={`btn ${promoteButtonPressed ? 'btn-success' : 'btn-primary'} mr-2`}
                    onClick={() => handlePromoteAdmin(member)}
                  >
                    {promoteButtonPressed ? 'Admin Promoted' : 'Promote to Admin'}
                  </button>
                  <button
                    className={`btn ${removeButtonPressed ? 'btn-success' : 'btn-danger'}`}
                    onClick={() => handleRemoveMember(member)}
                  >
                    {removeButtonPressed ? 'Member Removed' : 'Remove Member'}
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
          <button className={`btn ${saveChangesButtonPressed ? 'btn-success' : 'btn-warning'}`} onClick={handleSaveDetails}>
            {saveChangesButtonPressed ? 'Changes Saved' : 'Save Changes'}
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
