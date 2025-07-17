// src/components/ChatRoom.js
import React, { useState, useRef } from 'react';

function ChatRoom({ messages, isTyping, sendMessage, setTyping }) {
  const [messageBody, setMessageBody] = useState('');
  const typingTimeoutRef = useRef(null);

  const handleSendMessage = () => {
    if (messageBody) {
      sendMessage(messageBody);
      setMessageBody('');
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setTyping(false);
    }
  };

  const handleInputChange = (e) => {
    setMessageBody(e.target.value);
    
    setTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
    }, 1000);
  };

  return (
    <div className="chat-room">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={msg.permId || index} className={msg.isSystemMessage ? 'system-message' : 'user-message'}>
            <div className="message-header">
              <strong>{msg.userNickname || 'System'}:</strong>
              <span className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
            <div className="message-body">
              {msg.body}
            </div>
          </div>
        ))}
      </div>
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