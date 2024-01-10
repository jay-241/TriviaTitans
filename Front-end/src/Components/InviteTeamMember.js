import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const InviteTeamMember = ({ teamName }) => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState('');
  const [userSelected, setUserSelected] = useState(false);
  const [usersInvited, setUsersInvited] = useState(false);
  const [usersSelected, setUsersSelected] = useState([]);
  const [alreadySelected, setAlreadySelected] = useState(false);
  const [users, setUsers] = useState([]);
  const [inviteWithoutSelection, setInviteWithoutSelection] = useState(false);

  const currentUserEmail = localStorage.getItem('userEmail');
  // console.log(currentUserEmail)
  // const teamName = localStorage.getItem('teamName');
  // console.log(teamName)
  // setTeamName(teamName)

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://xxxaxztrth.execute-api.us-east-1.amazonaws.com/Dev/users');
      const { body } = response.data;
      const users = JSON.parse(body);
      setUsers(users);
      console.log(users)
    } catch (error) {
      console.error(error);
    }
  };

  const handleInviteUsers = async () => {
    // const teamName = localStorage.getItem('teamName');
    // setTeamName(teamName)
    // console.log(team_name)
    try {
      if (usersSelected.length === 0) {
        setInviteWithoutSelection(true);
        return;
      }

      console.log('Sending invitations to:', usersSelected);
      setUsersInvited(true);

      // Construct the message body
      const messageBody = {
        recipients: usersSelected,
        team_name: teamName,
        admin: currentUserEmail
      };

      // Make the POST request to the API with the message body
      const apiEndpoint = 'https://wlfhjj5a5a.execute-api.us-east-1.amazonaws.com/game/create-team'; // Replace with your actual API endpoint
      const response = await axios.post(apiEndpoint, messageBody);
      
      console.log('API response:', response.data);
      navigate('/teams');
      
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserSelection = (event) => {
    const selectedUserInput = event.target.value;
    setSelectedUser(selectedUserInput);
    setUserSelected(false);
    setAlreadySelected(false);
    setUsersInvited(false);

    // Check if the selected user input matches any existing user's name or email
    const matchedUser = users.find(
      (user) =>
        user.name.toLowerCase() === selectedUserInput.toLowerCase() ||
        user.email.toLowerCase() === selectedUserInput.toLowerCase()
    );

    // If a match is found, automatically select the matched user
    if (matchedUser) {
      setSelectedUser(matchedUser.email);
    }
  };

  const handleSelectUser = () => {
    if (!selectedUser) {
      return;
    }

    if (usersSelected.includes(selectedUser)) {
      setAlreadySelected(true);
      return;
    }

    setUsersSelected((prevUsersSelected) => [...prevUsersSelected, selectedUser]);
  };

  return (
    <div className="mt-4">
      <div className="form-group">
        <label htmlFor="userDropdown">
          <FontAwesomeIcon icon={faUsers} className="mr-2" />
          Select User to Invite:
        </label>
        <select
          className="form-control"
          value={selectedUser}
          onChange={handleUserSelection}
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.email} value={user.email}>
              {user.name} - {user.email}
            </option>
          ))}
        </select>
      </div>
      {alreadySelected && (
        <div className="alert alert-warning" role="alert">
          User is already selected.
        </div>
      )}
      <button
        className="btn btn-dark btn-block"
        onClick={handleSelectUser}
        disabled={userSelected || selectedUser === ''}
      >
        {userSelected ? 'User Selected!' : 'Select User'}
      </button>
      {usersSelected.length > 0 && (
        <div className="mt-4">
          <h3 className="text-center">Selected Users:</h3>
          <ul>
            {usersSelected.map((user) => (
              <li key={user}>{user}</li>
            ))}
          </ul>
        </div>
      )}
      <button className="btn btn-success btn-block" onClick={handleInviteUsers}>
        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
        {usersInvited ? 'User Invited!' : 'Invite Users'}
      </button> <span/>
      {inviteWithoutSelection && (
        <div className="alert alert-danger" role="alert">
          Please select users before inviting.
        </div>
      )}
    </div>
  );
};

export default InviteTeamMember;
