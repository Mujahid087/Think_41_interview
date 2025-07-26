// src/components/ChatWindow.jsx
import React, { useState } from 'react';
import MessageList from './MessageList';
import UserInput from './UserInput';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (text) => {
    const newMessage = { sender: 'user', text };
    setMessages((prev) => [...prev, newMessage]);

    // Mock bot response
    setTimeout(() => {
      const botMessage = { sender: 'bot', text: `Bot reply to: "${text}"` };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg flex flex-col h-[80vh]">
        <div className="p-4 font-bold text-lg border-b bg-indigo-200 text-indigo-900 rounded-t-lg">
          🛍️ E-commerce Support Chat
        </div>
        <MessageList messages={messages} />
        <UserInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;
