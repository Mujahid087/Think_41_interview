// src/components/UserInput.jsx
import React, { useState } from 'react';

const UserInput = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === '') return;
    onSend(text);
    setText('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center border-t p-2 bg-indigo-50"
    >
      <input
        className="flex-1 p-2 border rounded-md outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
      />
      <button
        type="submit"
        className="ml-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        Send
      </button>
    </form>
  );
};

export default UserInput;
