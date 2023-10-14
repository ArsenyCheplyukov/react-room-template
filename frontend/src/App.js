import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import CreateRoom from './components/CreateRoom';
import ConnectToRoom from './components/ConnectToRoom';
import RoomDetails from './components/RoomDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/connect" element={<ConnectToRoom />} />
        <Route path="/room/:roomName" element={<RoomDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
