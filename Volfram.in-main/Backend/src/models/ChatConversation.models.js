const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const chatConversationSchema = new mongoose.Schema({
  customerInfo: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  messages: {
    type: [chatMessageSchema],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('ChatConversation', chatConversationSchema);