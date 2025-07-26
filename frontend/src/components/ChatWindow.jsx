// ChatWindow.jsx
import React from 'react';
import MessageList from './MessageList';
import UserInput from './UserInput';
import { useSelector } from 'react-redux';

const ChatWindow = () => {
  const loading = useSelector((state) => state.chat.loading);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-white to-green-200 p-4 flex items-center justify-center">
      <div className="w-full max-w-3xl h-[80vh] bg-white/40 backdrop-blur-md shadow-2xl rounded-3xl flex flex-col overflow-hidden border border-white">
        
        <header className="bg-white/30 text-center py-4 text-xl font-bold text-gray-700 border-b">
          🛒 ShopMate Assistant
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-gray-300">
          <MessageList />
          {loading && (
            <div className="text-sm text-center text-gray-600 mt-4 animate-pulse">
              🤖 Bot is typing...
            </div>
          )}
        </main>

        <footer className="p-4 bg-white/30 border-t">
          <UserInput />
        </footer>
      </div>
    </div>
  );
};

export default ChatWindow;
