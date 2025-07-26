// src/components/MessageList.jsx
import React from 'react';
import Message from './Message';

const MessageList = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-white">
      {messages.map((msg, index) => (
        <Message key={index} text={msg.text} sender={msg.sender} />
      ))}
    </div>
  );
};

export default MessageList;
