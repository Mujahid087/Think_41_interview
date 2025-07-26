// UserInput.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setInput, addMessage, setLoading } from '../redux/chatSlice';

const UserInput = () => {
  const dispatch = useDispatch();
  const input = useSelector((state) => state.chat.input);

  const handleSend = async () => {
    if (!input.trim()) return;

    dispatch(addMessage({ sender: 'user', text: input }));
    dispatch(setInput(''));
    dispatch(setLoading(true));

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      dispatch(addMessage({ sender: 'bot', text: data.response }));
    } catch (e) {
      dispatch(addMessage({ sender: 'bot', text: 'Something went wrong 😢' }));
    }

    dispatch(setLoading(false));
  };

  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        value={input}
        onChange={(e) => dispatch(setInput(e.target.value))}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        className="flex-1 p-3 bg-white/70 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
        placeholder="Type a message..."
      />
      <button
        onClick={handleSend}
        className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 shadow"
      >
        Send
      </button>
    </div>
  );
};

export default UserInput;
