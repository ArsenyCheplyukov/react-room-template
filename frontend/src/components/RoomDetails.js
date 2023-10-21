import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

function RoomDetails() {
  const { room_name, client_name } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const webSocketRef = useRef(null);

  useEffect(() => {
    const url = `ws://localhost:8000/ws/${room_name}/${client_name}`;
    const ws = new WebSocket(url);
    webSocketRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (e) => {
      const receivedMessage = JSON.parse(e.data);
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };

    return () => {
      ws.close();
      webSocketRef.current = null;
    };
  }, [room_name, client_name]);

  const sendMessage = () => {
    const ws = webSocketRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ message, client_name }));
      setMessage('');
    } else {
      console.log('WebSocket not open.');
    }
  };

  return (
    <div className="container">
      <h1>Chat</h1>
      <h2>Your client id: {client_name}</h2>
      <div className="chat-container">
        <div className="chat">
          {messages.map((value, index) => (
            <div
              key={index}
              className={
                value.client_name === client_name
                  ? 'my-message-container'
                  : 'another-message-container'
              }
            >
              <div
                className={
                  value.client_name === client_name
                    ? 'my-message'
                    : 'another-message'
                }
              >
                <p className="client">Client id: {value.client_name}</p>
                <p className="message">
                  {JSON.parse(value.message).message}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="input-chat-container">
          <input
            className="input-chat"
            type="text"
            placeholder="Chat message ..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button className="submit-chat" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomDetails;
