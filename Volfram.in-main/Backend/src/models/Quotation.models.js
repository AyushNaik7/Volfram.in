const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatConversation', required: true },
  customerId: { type: String, default: '' },
  customerInfo: { type: mongoose.Schema.Types.Mixed, default: null },
  quotationNumber: { type: String, required: true, unique: true },
  productDetails: { type: mongoose.Schema.Types.Mixed, default: null },
  calculations: { type: mongoose.Schema.Types.Mixed, default: {} },
  totalPrice: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'sent', 'accepted', 'rejected'], default: 'draft' },
  validUntil: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Quotation', quotationSchema);