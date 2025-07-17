// src/components/ChatRoom.js
import React, { useState, useRef } from 'react';

function ChatRoom({ messages, isTyping, sendMessage, setTyping }) {
  const [messageBody, setMessageBody] = useState('');
  const typingTimeoutRef = useRef(null);

  const handleSendMessage = () => {
    if (messageBody) {
      sendMessage(messageBody); // This will call the function to send a message [cite: 16]
      setMessageBody('');
      // After sending, stop the 'typing' indicator
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      setTyping(false);
    }
  };

  // This function handles the typing presence updates
  const handleInputChange = (e) => {
    setMessageBody(e.target.value);
    
    // Tell the server we are typing [cite: 61]
    setTyping(true);

    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a timeout to signal we've stopped typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
    }, 1000);
  };

  return (
    <div className="chat-room">
      {/* This area will display all messages [cite: 19, 20] */}
      <div className="messages">
        {messages.map((msg, index) => (
          // System messages are styled differently [cite: 53]
          <div key={msg.permId || index} className={msg.isSystemMessage ? 'system-message' : 'user-message'}>
            <strong>{msg.userNickname || 'System'}:</strong> {msg.body}
          </div>
        ))}
      </div>
      {/* Show typing presence when someone is typing in the chat room [cite: 21] */}
      <div className="typing-indicator">
        {isTyping && <p>Someone is typing...</p>}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={messageBody}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatRoom;