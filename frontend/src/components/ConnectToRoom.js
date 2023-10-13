import React, { useState } from 'react';
import axios from 'axios';

const ConnectToRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [message, setMessage] = useState('');

  const handleRoomNameChange = (e) => {
    setRoomName(e.target.value);
  };

  const handleConnect = () => {
    axios.get(`http://127.0.0.1:8000/get_room/${roomName}`)
      .then(response => {
        console.log('Response:', response);
        setMessage(`Room ${roomName} found. You can connect.`);
        // Redirect to the room details
        window.location.href = `/room/${roomName}`;
      })
      .catch(error => {
        console.error('Error:', error);
        setMessage('Error: Room not found.');
      });
  };

  return (
    <div>
      <h1>Connect to a Room</h1>
      <input
        type="text"
        placeholder="Enter room name"
        value={roomName}
        onChange={handleRoomNameChange}
      />
      <button onClick={handleConnect}>Connect</button>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
};

export default ConnectToRoom;
