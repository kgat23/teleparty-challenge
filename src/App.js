// src/App.js
import React, { useState, useMemo } from 'react';
import './App.css';
import { TelepartyClient, SocketMessageTypes } from 'teleparty-websocket-lib'; // Imports from the library documentation 
import JoinScreen from './components/JoinScreen';
import ChatRoom from './components/ChatRoom';

function App() {
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // useMemo ensures the client is initialized only once.
  const teleparty = useMemo(() => {
    // The event handler is where you process all incoming socket events 
    const eventHandler = {
      onConnectionReady: () => { // This function is called when the connection is established 
        setIsConnected(true);
        console.log('Connection has been established');
      },
      onClose: () => { // This function is called when the socket connection closes [cite: 82, 92]
        setIsConnected(false);
        alert('Socket has been closed. Please reload.');
      },
      onMessage: (message) => { // This function receives all messages from the server [cite: 40, 92]
        // Process messages based on their type
        switch (message.type) {
          case SocketMessageTypes.SEND_MESSAGE: // Type for receiving chat messages [cite: 41]
            setMessages((prev) => [...prev, message.data]);
            break;
          case SocketMessageTypes.SET_TYPING_PRESENCE: // Type for receiving typing updates [cite: 69]
            setIsTyping(message.data.anyoneTyping);
            break;
          case 'message-list': // Type for loading previous messages [cite: 59]
            setMessages(message.data.messages);
            break;
          case 'session-joined':
            setSession(message.data);
            break;
          default:
            break;
        }
      },
    };

    // Initialize the client with our event handler 
    return new TelepartyClient(eventHandler);
  }, []);

  // Function to create a chat room, as specified in the docs 
  const createSession = async (nickname) => {
    try {
      const newSession = await teleparty.createChatRoom(nickname, null); // Pass null for the optional userIcon
      setSession(newSession);
      alert(`Room created! Your Room ID is: ${newSession.sessionId}`);
    } catch (error) {
      console.error('Failed to create chat room:', error);
      alert('Error: Could not create room.');
    }
  };

  // Function to join a chat room, as specified in the docs 
  const joinSession = (sessionId, nickname) => {
    teleparty.joinChatRoom(nickname, sessionId, null); // Pass null for the optional userIcon
  };

  // Function to send a chat message, as specified in the docs [cite: 32, 92]
  const sendMessage = (body) => {
    teleparty.sendMessage(SocketMessageTypes.SEND_MESSAGE, {
      body: body, // The data format for sending a message [cite: 35, 37]
    });
  };

  // Function to update typing presence, as specified in the docs [cite: 61, 92]
  const setTyping = (isUserTyping) => {
    teleparty.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
      typing: isUserTyping, // The data format for updating typing presence [cite: 63, 64]
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Teleparty Challenge</h1>
        {!isConnected ? (
          // Wait for the Connection to be ready before attempting to create/join a room [cite: 80]
          <p>Connecting to server...</p>
        ) : !session ? (
          <JoinScreen createSession={createSession} joinSession={joinSession} />
        ) : (
          <ChatRoom
            messages={messages}
            isTyping={isTyping}
            sendMessage={sendMessage}
            setTyping={setTyping}
          />
        )}
      </header>
    </div>
  );
}

export default App;