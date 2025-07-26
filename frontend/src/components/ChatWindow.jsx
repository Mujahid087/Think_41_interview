// // ChatWindow.jsx
// import React from 'react';
// import MessageList from './MessageList';
// import UserInput from './UserInput';
// import { useSelector } from 'react-redux';

// const ChatWindow = () => {
//   const loading = useSelector((state) => state.chat.loading);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-white to-green-200 p-4 flex items-center justify-center">
//       <div className="w-full max-w-3xl h-[80vh] bg-white/40 backdrop-blur-md shadow-2xl rounded-3xl flex flex-col overflow-hidden border border-white">
        
//         <header className="bg-white/30 text-center py-4 text-xl font-bold text-gray-700 border-b">
//           🛒 ShopMate Assistant
//         </header>

//         <main className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-gray-300">
//           <MessageList />
//           {loading && (
//             <div className="text-sm text-center text-gray-600 mt-4 animate-pulse">
//               🤖 Bot is typing...
//             </div>
//           )}
//         </main>

//         <footer className="p-4 bg-white/30 border-t">
//           <UserInput />
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;


import React, { useEffect } from 'react';
import MessageList from './MessageList';
import UserInput from './UserInput';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  addMessage,
  setSessionList,
  setSessionId,
  setMessages,
  setLoading,
} from '../redux/chatSlice';

const ChatWindow = () => {
  const dispatch = useDispatch();
  const { loading, sessionList, sessionId, userId } = useSelector((state) => state.chat);

  // Load previous sessions on mount
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/chat/sessions/${userId}`)
      .then((res) => dispatch(setSessionList(res.data)))
      .catch((err) => console.error('Failed to fetch sessions:', err));
  }, [userId, dispatch]);

  // Load messages for a selected session
  const loadSession = async (session) => {
    dispatch(setLoading(true));
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/messages/${session._id}`);
      dispatch(
        setMessages(
          res.data.map((msg) => ({
            sender: msg.sender,
            text: msg.message,
          }))
        )
      );
      dispatch(setSessionId(session._id));
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Send new user message
  const sendMessage = async (text) => {
    if (!text) return;

    dispatch(addMessage({ sender: 'user', text }));
    dispatch(setLoading(true));

    try {
      const res = await axios.post('http://localhost:5000/api/chat', {
        userId,
        message: text,
        sessionId,
      });

      const { sessionId: newSessionId, botMessage } = res.data;

      if (!sessionId) dispatch(setSessionId(newSessionId));
      dispatch(addMessage({ sender: 'bot', text: botMessage.message }));
    } catch (err) {
      console.error('Error sending message:', err);
      dispatch(addMessage({ sender: 'bot', text: '❌ Bot error. Try again.' }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex h-screen font-sans bg-gradient-to-br from-indigo-200 via-white to-green-200">
      <Sidebar sessions={sessionList} onSelect={loadSession} activeId={sessionId} />
      
      <div className="flex-1 p-4 flex items-center justify-center">
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
            <UserInput onSend={sendMessage} />
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

