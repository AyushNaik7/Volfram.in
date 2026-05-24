const mongoose = require('mongoose');

/**
 * Page Schema for Admin Dashboard
 * Stores page content with image uploads
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
    type: String, // Stores the file path/URL of uploaded photo
    default: null
  },
  category: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Update the updatedAt field before saving
PageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Page = mongoose.model('Page', PageSchema);

module.exports = Page;
