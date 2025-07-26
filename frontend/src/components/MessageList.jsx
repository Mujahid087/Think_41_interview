// MessageList.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const MessageList = () => {
  const messages = useSelector((state) => state.chat.messages);

  if (!messages || !Array.isArray(messages)) return null;

  return (
    <div className="space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.sender === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`px-4 py-2 rounded-lg max-w-[80%] text-white ${
              msg.sender === 'user' ? 'bg-blue-600' : 'bg-gray-500'
            }`}
          >
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
