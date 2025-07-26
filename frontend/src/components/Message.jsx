import React from 'react';

const Message = ({ sender, text }) => {
  const isUser = sender === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-md px-4 py-3 rounded-lg shadow 
          ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
      >
        <p className="text-xs font-bold mb-1">{isUser ? 'You' : 'Bot'}</p>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default Message;
