// Message.jsx
import React from 'react';

const Message = ({ sender, text }) => {
  const isUser = sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
      <div className={`flex items-end max-w-[70%]`}>
        {!isUser && (
          <img
            src="/bot.png"
            alt="bot"
            className="w-8 h-8 rounded-full mr-2 border"
          />
        )}
        <div
          className={`px-4 py-3 rounded-2xl text-sm shadow-md ${
            isUser
              ? 'bg-indigo-600 text-white rounded-br-none'
              : 'bg-white text-gray-800 rounded-bl-none'
          }`}
        >
          {text}
        </div>
        {isUser && (
          <img
            src="/user.png"
            alt="user"
            className="w-8 h-8 rounded-full ml-2 border"
          />
        )}
      </div>
    </div>
  );
};

export default Message;
