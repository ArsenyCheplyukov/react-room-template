import React, { useState } from 'react';
import axios from 'axios';

const ConnectToRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [message, setMessage] = useState('');

  const handleRoomNameChange = (e) => {
    setRoomName(e.target.value);
  };

  const handlePlayerNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  const handleConnect = async () => {
    if (!roomName || !playerName) {
      setMessage('Both room name and player name are required.');
      return;
    }

    const response = await axios.post(`http://localhost:8000/connect_room/`, {
      name: roomName,
      connected: playerName,
    })
      .then(response => {
        console.log('Response:', response);
        setMessage(`Room ${roomName} found. You can connect.`);
        // Redirect to the room details
        window.location.href = `/room/${roomName}/${playerName}`;
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
      <input
        type="text"
        placeholder="Enter your player name"
        value={playerName}
        onChange={handlePlayerNameChange}
      />
      <button onClick={handleConnect}>Connect</button>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
};

export default ConnectToRoom;
