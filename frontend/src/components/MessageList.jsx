// MessageList.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import Message from './Message';

const MessageList = () => {
  const messages = useSelector((state) => state.chat.messages);

  return (
    <div className="flex flex-col space-y-3">
      {messages.map((msg, index) => (
        <Message key={index} sender={msg.sender} text={msg.text} />
      ))}
    </div>
  );
};

export default MessageList;
