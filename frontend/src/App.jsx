// src/App.jsx
import React from 'react';
import ChatWindow from './components/ChatWindow';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-200 to-indigo-100 flex items-center justify-center">
      <ChatWindow />
    </div>
  );
};

export default App;
