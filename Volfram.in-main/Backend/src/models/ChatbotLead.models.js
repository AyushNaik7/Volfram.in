const mongoose = require('mongoose');

const chatbotMessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const chatbotLeadSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Register', default: null, index: true },
  customerName: { type: String, trim: true, default: '' },
  customerEmail: { type: String, trim: true, lowercase: true, default: '' },
  customerPhone: { type: String, trim: true, default: '' },
  quoteDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
  quoteSubmitted: { type: Boolean, default: false },
  messages: { type: [chatbotMessageSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('ChatbotLead', chatbotLeadSchema, 'chatbotleads');