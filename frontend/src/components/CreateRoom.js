import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleRoomNameChange = (e) => {
    setRoomName(e.target.value);
  };

  const handlePlayerNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  const handleCreateRoom = async () => {
    if (!roomName) {
      setError('Room name cannot be empty.');
      return;
    }

    if (!playerName) {
      setError('Player name cannot be empty.');
      return;
    }

    const response = await axios.post('http://localhost:8000/create_room/', {
      name: String(roomName),
      creator: String(playerName), // Pass the player's nickname as the creator
    })
      .then(response => {
        console.log('Response:', response);
        setError(''); // Clear any previous errors
        setSuccessMessage('Room created successfully.');
        // Redirect to the connection to room page
        // Assuming you have a function to handle the redirection
        redirectToRoom(roomName, playerName);
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Error creating room. Please try again.');
      });
  };

  const redirectToRoom = (room_name, player_name) => {
    navigate(`/room/${room_name}/${player_name}`);
  };

  return (
    <div className="create-room-container">
      <div className="create-room-header">
        <h1>Create a Room</h1>
      </div>
      <div className="create-room-form">
        <input
          type="text"
          placeholder="Enter room name"
          value={roomName}
          onChange={handleRoomNameChange}
          className="create-room-input"
        />
        <input
          type="text"
          placeholder="Enter your player name"
          value={playerName}
          onChange={handlePlayerNameChange}
          className="create-room-input"
        />
        <button onClick={handleCreateRoom} className="create-room-button">
          Create Room
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default CreateRoom;
