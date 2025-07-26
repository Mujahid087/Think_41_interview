const express = require('express');
const router = express.Router();
const ChatUser = require('../models/ChatUser');
const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { userId, message, sessionId } = req.body;

    // 1. Create a new session if sessionId is not provided
    let session;
    if (!sessionId) {
      session = new ChatSession({ userId });
      await session.save();
    } else {
      session = await ChatSession.findById(sessionId);
      if (!session) return res.status(404).json({ error: 'Session not found' });
    }

    // 2. Save user's message
    const userMessage = new ChatMessage({
      sessionId: session._id,
      sender: 'user',
      message,
    });
    await userMessage.save();

    // 3. Generate AI response (Dummy for now)
    const aiResponseText = `You said: "${message}". Here's a helpful answer.`; // Placeholder

    const botMessage = new ChatMessage({
      sessionId: session._id,
      sender: 'bot',
      message: aiResponseText,
    });
    await botMessage.save();

    // 4. Return both messages
    res.json({
      sessionId: session._id,
      userMessage,
      botMessage,
    });
  } catch (error) {
    console.error('Error handling chat:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
