const mongoose = require('mongoose');

// Stores images uploaded by admin for each website section
const SiteImageSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['gallery', 'events', 'clients', 'about', 'products'],
    index: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    trim: true,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const SiteImage = mongoose.model('SiteImage', SiteImageSchema);
module.exports = SiteImage;
