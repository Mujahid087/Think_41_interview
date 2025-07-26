const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  userId: {
    // type: mongoose.Schema.Types.ObjectId, 
    type:String,
    ref: 'ChatUser',   // Referencing the ChatUser model
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatMessage',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ChatSession', chatSessionSchema);
