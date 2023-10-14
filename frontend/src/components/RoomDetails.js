import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RoomDetails = () => {
  const { roomName } = useParams();
  const [roomInfo, setRoomInfo] = useState(null);
  const [error, setError] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/messages/${roomName}`);
      const room = response.data;
      console.log(response);
      // Ensure messages array is present
      // if (Array.isArray(room.messages)) {
      //   room.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setRoomInfo(room);
      //   setError('');
      // } else {
      //   setError('Error fetching room details: Invalid data format');
      // } 
    } catch (error) {
      console.error('Error:', error);
      setError('Error fetching room details.');
    }
  };

  useEffect(() => {
    fetchRoomDetails();
  }, [roomName]);

  const handleGetMessages = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/messages/${roomName}`);
      console.log('Messages:', response.data);
    } catch (error) {
      console.error('Error:', error);
      setError('Error fetching messages.');
    }
  };

  const handlePostMessage = async () => {
    if (!messageInput) {
      setError('Message cannot be empty.');
      return;
    }
  
    try {
      await axios.post(`http://127.0.0.1:8000/message/${roomName}`, {
        user: 'User123',
        content: messageInput,
      });
      await fetchRoomDetails();
      setError('');
      setMessageInput('');
    } catch (error) {
      console.error('Error:', error);
      setError('Error posting message.');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [roomInfo]);

  return (
    <div>
      <h1>Room Details for Room ID: {roomName}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {roomInfo ? (
        <div>
          <h2>Room Name: {roomInfo.name}</h2>
          <button onClick={handleGetMessages}>Get Messages</button>
          <h3>Messages:</h3>
          <ul>
            {roomInfo.messages.map((message, index) => (
              <li key={index}>{`${message.user}: ${message.content}`}</li>
            ))}
          </ul>
          <div ref={messagesEndRef}></div>
        </div>
      ) : (
        <p>Loading room details...</p>
      )}
      <div>
        <textarea
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Enter your message"
        />
        <button onClick={handlePostMessage}>Post Message</button>
      </div>
    </div>
  );
};

export default RoomDetails;
