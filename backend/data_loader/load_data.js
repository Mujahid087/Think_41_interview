// const mongoose = require('mongoose');
// const fs = require('fs');
// const path = require('path');
// const csv = require('csv-parser');

// // Import models
// const Product = require('../models/Product');
// const InventoryItem = require('../models/InventoryItem');
// const Order = require('../models/Order');
// const OrderItem = require('../models/OrderItem');
// const User = require('../models/User');
// const DistributionCenter = require('../models/DistributionCenter');

// async function loadCSV(Model, filePath, transformer = row => row) {
//   return new Promise((resolve, reject) => {
//     const results = [];

//     // Check if file exists
//     if (!fs.existsSync(filePath)) {
//       console.error(`❌ File not found: ${filePath}`);
//       reject(new Error(`File not found: ${filePath}`));
//       return;
//     }

//     console.log(`📂 Loading ${Model.modelName} from ${filePath}...`);

//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on('data', row => {
//         try {
//           const transformedRow = transformer(row);
//           results.push(transformedRow);
//         } catch (err) {
//           console.warn(`⚠️ Skipping invalid row in ${Model.modelName}:`, err.message);
//         }
//       })
//       .on('end', async () => {
//         try {
//           if (results.length === 0) {
//             console.log(`📝 No valid records found in ${Model.modelName}`);
//             resolve();
//             return;
//           }

//           // Clear existing data (optional - remove if you want to append)
//           await Model.deleteMany({});
//           console.log(`🗑️ Cleared existing ${Model.modelName} data`);

//           await Model.insertMany(results);
//           console.log(`✅ Loaded ${results.length} records into ${Model.modelName}`);
//           resolve();
//         } catch (err) {
//           console.error(`❌ Failed to load ${Model.modelName}:`, err);
//           reject(err);
//         }
//       })
//       .on('error', (err) => {
//         console.error(`❌ Error reading ${filePath}:`, err);
//         reject(err);
//       });
//   });
// }

// async function main() {
//   try {
//     // Assuming MongoDB connection is already established elsewhere
//     console.log('📊 Starting data loading process...');
    
//     // Updated path to your CSV folder
//     const basePath = path.join(__dirname, '../../../Think_41_interview/backend/csv');
    
//     console.log(`📁 CSV files directory: ${basePath}`);

//     await loadCSV(DistributionCenter, `${basePath}/distribution_centers.csv`, row => ({
//       id: row.id,
//       name: row.name,
//       latitude: parseFloat(row.latitude) || 0,
//       longitude: parseFloat(row.longitude) || 0
//     }));

//     await loadCSV(Product, `${basePath}/products.csv`, row => ({
//       id: row.id,
//       cost: parseFloat(row.cost) || 0,
//       category: row.category || '',
//       name: row.name || '',
//       brand: row.brand || '',
//       retail_price: parseFloat(row.retail_price) || 0,
//       department: row.department || '',
//       sku: row.sku || '',
//       distribution_center_id: row.distribution_center_id || ''
//     }));

//     await loadCSV(User, `${basePath}/users.csv`, row => ({
//       id: row.id,
//       first_name: row.first_name || '',
//       last_name: row.last_name || '',
//       email: row.email || '',
//       age: parseInt(row.age) || 0,
//       gender: row.gender || '',
//       state: row.state || '',
//       street_address: row.street_address || '',
//       postal_code: row.postal_code || '',
//       city: row.city || '',
//       country: row.country || '',
//       latitude: parseFloat(row.latitude) || 0,
//       longitude: parseFloat(row.longitude) || 0,
//       traffic_source: row.traffic_source || '',
//       created_at: row.created_at ? new Date(row.created_at) : new Date()
//     }));

//     await loadCSV(InventoryItem, `${basePath}/inventory_items.csv`, row => ({
//       id: row.id,
//       product_id: row.product_id || '',
//       created_at: row.created_at ? new Date(row.created_at) : new Date(),
//       sold_at: row.sold_at ? new Date(row.sold_at) : null,
//       cost: parseFloat(row.cost) || 0,
//       product_category: row.product_category || '',
//       product_name: row.product_name || '',
//       product_brand: row.product_brand || '',
//       product_retail_price: parseFloat(row.product_retail_price) || 0,
//       product_department: row.product_department || '',
//       product_sku: row.product_sku || '',
//       product_distribution_center_id: row.product_distribution_center_id || ''
//     }));

//     await loadCSV(Order, `${basePath}/orders.csv`, row => ({
//       order_id: row.order_id,
//       user_id: row.user_id || '',
//       status: row.status || '',
//       gender: row.gender || '',
//       created_at: row.created_at ? new Date(row.created_at) : new Date(),
//       returned_at: row.returned_at ? new Date(row.returned_at) : null,
//       shipped_at: row.shipped_at ? new Date(row.shipped_at) : null,
//       delivered_at: row.delivered_at ? new Date(row.delivered_at) : null,
//       num_of_item: parseInt(row.num_of_item) || 1
//     }));

//     await loadCSV(OrderItem, `${basePath}/order_items.csv`, row => ({
//       id: row.id,
//       order_id: row.order_id || '',
//       user_id: row.user_id || '',
//       product_id: row.product_id || '',
//       inventory_item_id: row.inventory_item_id || '',
//       status: row.status || '',
//       created_at: row.created_at ? new Date(row.created_at) : new Date(),
//       shipped_at: row.shipped_at ? new Date(row.shipped_at) : null,
//       delivered_at: row.delivered_at ? new Date(row.delivered_at) : null,
//       returned_at: row.returned_at ? new Date(row.returned_at) : null
//     }));

//     console.log('\n🎉 All data loaded successfully!');
//     console.log('\n📈 Data loading summary completed.');
    
//   } catch (error) {
//     console.error('\n❌ Error loading data:', error);
//     throw error; // Re-throw to let calling function handle it
//   }
// }

// // Export the main function for use in other files
// module.exports = { main, loadCSV };

// // Only run directly if this file is executed directly
// if (require.main === module) {
//   main().catch(error => {
//     console.error('❌ Unhandled error:', error);
//     process.exit(1);
//   });
// }

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

    // Validate required fields - make userId optional for anonymous chat
    if (!message) {
      console.error('❌ Missing required fields');
      return res.status(400).json({ 
        error: 'Missing required field: message is required' 
      });
    }

    // Use anonymous user ID if not provided
    const effectiveUserId = userId || 'anonymous_' + Date.now();

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
        session = new ChatSession({ userId: effectiveUserId });
        await session.save();
      }
    } else {
      console.log('🆕 Creating new session');
      session = new ChatSession({ userId: effectiveUserId });
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