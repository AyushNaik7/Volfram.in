const mongoose = require('mongoose');

/**
 * Page Schema for Admin Dashboard
 * Stores page content with image uploads
 * createdAt and updatedAt are managed automatically by { timestamps: true }
 */
const PageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  category: {
    type: String,
    trim: true
  }
}, { timestamps: true });

const Page = mongoose.model('Page', PageSchema);

module.exports = Page;
