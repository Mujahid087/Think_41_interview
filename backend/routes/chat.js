const express = require('express');
const router = express.Router();
const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');
const Order = require('../models/Order');
const groqLLM = require('../utils/groqLLM.JS');

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { userId, message, sessionId } = req.body;

    // 1. Get or create session
    let session = sessionId
      ? await ChatSession.findById(sessionId)
      : new ChatSession({ userId });
    if (!sessionId) await session.save();

    // 2. Save user message
    const userMsg = new ChatMessage({
      sessionId: session._id,
      sender: 'user',
      message,
    });
    await userMsg.save();

    // 3. Gather previous messages
    const historyDocs = await ChatMessage.find({ sessionId: session._id }).sort({ timestamp: 1 });
    const messageHistory = historyDocs.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.message,
    }));

    // 4. Add current user message
    messageHistory.push({ role: 'user', content: message });

    // 5. LLM generates a reply
    let aiReply = await groqLLM(messageHistory);

    // 6. If LLM determines an order ID is mentioned, try to fetch it
    const orderIdMatch = message.match(/order\s*#?(\w+)/i);
    if (orderIdMatch) {
      const orderId = orderIdMatch[1];
      const order = await Order.findOne({ orderId });

      if (order) {
        aiReply = `🔍 Order #${orderId} is currently **${order.status}**. Expected delivery: **${order.deliveryDate.toDateString()}**.`;
      } else {
        aiReply = `Sorry, I couldn't find any order with ID **${orderId}**. Can you double-check it?`;
      }
    }

    // 7. Save bot message
    const botMsg = new ChatMessage({
      sessionId: session._id,
      sender: 'bot',
      message: aiReply,
    });
    await botMsg.save();

    // 8. Respond
    res.json({
      sessionId: session._id,
      userMessage: userMsg,
      botMessage: botMsg,
    });
  } catch (err) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
