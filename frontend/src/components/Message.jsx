// src/components/Message.jsx
import React from 'react';

const Message = ({ sender, text }) => {
  const isUser = sender === 'user';
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`px-4 py-2 rounded-lg max-w-sm ${
          isUser
            ? 'bg-indigo-500 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default Message;
