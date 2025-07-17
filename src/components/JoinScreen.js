// src/components/JoinScreen.js
import React, { useState } from 'react';

function JoinScreen({ createSession, joinSession }) {
  const [nickname, setNickname] = useState('');
  const [sessionId, setSessionId] = useState('');

  // Handler to create a room if a nickname is provided
  const handleCreate = () => {
    if (nickname) {
      createSession(nickname);
    } else {
      alert('Please enter a nickname!');
    }
  };

  // Handler to join a room if nickname and Room ID are provided
  const handleJoin = () => {
    if (nickname && sessionId) {
      joinSession(sessionId, nickname);
    } else {
      alert('Please enter a nickname and a Room ID!');
    }
  };

  return (
    <div>
      <h2>Join or Create a Chat Room</h2>
      {/* Users should be able to set their nickname when joining or creating a chat room [cite: 18] */}
      <input
        type="text"
        placeholder="Enter your nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <div>
        {/* Users should be able to press a button in order to create a chat room [cite: 13] */}
        <button onClick={handleCreate}>Create Room</button>
      </div>
      <hr />
      <div>
        {/* Users should be able to enter an ID in order to join a chat room [cite: 14] */}
        <input
          type="text"
          placeholder="Enter Room ID to join"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
        />
        <button onClick={handleJoin}>Join Room</button>
      </div>
    </div>
  );
}

export default JoinScreen;