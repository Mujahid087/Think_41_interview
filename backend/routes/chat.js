const express = require('express');
const router = express.Router();
const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');
const Order = require('../models/Order');
const groqLLM = require('../utils/groqLLM');

router.post('/', async (req, res) => {
  try {
    console.log('🚀 Chat endpoint called');
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));

    const { userId, message, sessionId } = req.body;

    // Validate required fields
    if (!userId || !message) {
      console.error('❌ Missing required fields');
      return res.status(400).json({ 
        error: 'Missing required fields: userId and message are required' 
      });
    }

    if (typeof message !== 'string' || message.trim() === '') {
      console.error('❌ Invalid message format');
      return res.status(400).json({ 
        error: 'Message must be a non-empty string' 
      });
    }

    console.log('✅ Input validation passed');

    // 1. Get or create session
    let session;
    if (sessionId) {
      console.log('🔍 Looking for existing session:', sessionId);
      session = await ChatSession.findById(sessionId);
      if (!session) {
        console.log('⚠️ Session not found, creating new one');
        session = new ChatSession({ userId });
        await session.save();
      }
    } else {
      console.log('🆕 Creating new session');
      session = new ChatSession({ userId });
      await session.save();
    }

    console.log('✅ Session ready:', session._id);

    // 2. Save user message
    console.log('💾 Saving user message');
    const userMsg = new ChatMessage({
      sessionId: session._id,
      sender: 'user',
      message: message.trim(),
    });
    await userMsg.save();
    console.log('✅ User message saved:', userMsg._id);

    // 3. Check for order status queries first (before AI call)
    let aiReply = null;
    const orderIdMatch = message.match(/order\s*#?(\w+)/i);
    
    if (orderIdMatch) {
      console.log('🔍 Order query detected:', orderIdMatch[1]);
      const orderId = orderIdMatch[1];
      
      try {
        const order = await Order.findOne({ orderId });
        if (order) {
          aiReply = `🔍 Order #${orderId} is currently **${order.status}**. Expected delivery: **${order.deliveryDate.toDateString()}**.`;
          console.log('✅ Order found, status provided');
        } else {
          aiReply = `Sorry, I couldn't find any order with ID **${orderId}**. Can you double-check it?`;
          console.log('❌ Order not found');
        }
      } catch (orderError) {
        console.error('❌ Error fetching order:', orderError);
        aiReply = `There was an error looking up order #${orderId}. Please try again.`;
      }
    }

    // 4. If not an order query, use AI
    if (!aiReply) {
      console.log('🤖 Generating AI response');
      
      // Gather previous messages (limit to last 10 for context)
      const historyDocs = await ChatMessage.find({ sessionId: session._id })
        .sort({ timestamp: 1 })
        .limit(20); // Limit history to avoid token limits
      
      console.log('📚 Found message history:', historyDocs.length, 'messages');

      const messageHistory = historyDocs.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.message,
      }));

      // Add system message for better context
      const systemMessage = {
        role: 'system',
        content: 'You are a helpful customer service assistant for an e-commerce platform. Be friendly, concise, and helpful. If you don\'t know something, say so politely.'
      };

      const fullHistory = [systemMessage, ...messageHistory];
      
      console.log('🚀 Calling Groq LLM with history length:', fullHistory.length);
      
      try {
        aiReply = await groqLLM(fullHistory);
        console.log('✅ AI response received:', aiReply ? 'Success' : 'Empty response');
      } catch (aiError) {
        console.error('❌ AI service error:', aiError.message);
        aiReply = "I'm sorry, I'm having trouble generating a response right now. Please try again.";
      }
    }

    // 5. Validate AI reply
    if (!aiReply || aiReply.trim() === "") {
      console.log('⚠️ Empty AI reply, using fallback');
      aiReply = "I'm sorry, I couldn't understand that. Could you please rephrase your question?";
    }

    console.log('💬 Final AI reply:', aiReply);

    // 6. Save bot reply
    console.log('💾 Saving bot message');
    const botMsg = new ChatMessage({
      sessionId: session._id,
      sender: 'bot',
      message: aiReply,
    });
    await botMsg.save();
    console.log('✅ Bot message saved:', botMsg._id);

    // 7. Response to client
    const response = {
      success: true,
      sessionId: session._id,
      userMessage: {
        id: userMsg._id,
        message: userMsg.message,
        timestamp: userMsg.timestamp
      },
      botMessage: {
        id: botMsg._id,
        message: botMsg.message,
        timestamp: botMsg.timestamp
      }
    };

    console.log('✅ Sending response to client');
    res.json(response);

  } catch (err) {
    console.error('❌ Error in /api/chat:', err);
    console.error('Stack trace:', err.stack);
    
    res.status(500).json({ 
      success: false,
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  }
});

// Add a test endpoint to check if everything is working
router.get('/test', async (req, res) => {
  try {
    console.log('🧪 Testing chat service');
    
    // Test database connection
    const sessionCount = await ChatSession.countDocuments();
    const messageCount = await ChatMessage.countDocuments();
    
    // Test Groq API with simple message
    const testMessages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Say hello in one word.' }
    ];
    
    const testResponse = await groqLLM(testMessages);
    
    res.json({
      success: true,
      database: {
        sessions: sessionCount,
        messages: messageCount
      },
      groq: {
        working: !!testResponse,
        response: testResponse
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasGroqKey: !!process.env.GROQ_API_KEY
      }
    });
    
  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;