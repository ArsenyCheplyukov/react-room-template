import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="header">
        <h1>Room Connection</h1>
      </div>
      <div className="button-container">
        <Link to="/connect" className="join-button">
          Join Room
        </Link>
        <Link to="/create" className="create-button">
          Create Room
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
