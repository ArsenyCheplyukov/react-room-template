import React, { useState } from 'react';
import axios from 'axios';

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRoomNameChange = (e) => {
    setRoomName(e.target.value);
  };

  const handleCreateRoom = () => {
    if (!roomName) {
      setError('Room name cannot be empty.');
      return;
    }

    axios.post('http://localhost:8000/create_room/', { name: String(roomName) })
      .then(response => {
        console.log('Response:', response);
        setError(''); // Clear any previous errors
        setSuccessMessage('Room created successfully.');
        // Redirect to the connection to room page
        // Assuming you have a function to handle the redirection
        // Replace 'redirectToRoom' with your actual function to redirect
        redirectToRoom(roomName);
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Error creating room. Please try again.');
      });
  };

  // Function to handle redirection to the connection to room page
  const redirectToRoom = (roomName) => {
    // Redirect to the connection to room page
    // You can use window.location or your preferred routing mechanism
    // Replace with the actual route you want to redirect to
    window.location.href = `/room/${roomName}`;
  };

  return (
    <div>
      <h1>Create a Room</h1>
      <input
        type="text"
        placeholder="Enter room name"
        value={roomName}
        onChange={handleRoomNameChange}
      />
      <button onClick={handleCreateRoom}>Create Room</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default CreateRoom;
