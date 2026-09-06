const express = require('express');
const Event = require('../models/Event.models.js');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

const createSlug = (title) => `${title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now()}`;

router.get('/public-events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load events.', error: error.message });
  }
});

router.get('/admin/events', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load event albums.', error: error.message });
  }
});

router.post('/admin/events', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    if (!title?.trim() || !description?.trim() || !date?.trim() || !location?.trim()) {
      return res.status(400).json({ message: 'Title, description, date, and location are required.' });
    }
    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      date: date.trim(),
      location: location.trim(),
      slug: createSlug(title)
    });
    res.status(201).json({ message: 'Event album created.', event });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create event album.', error: error.message });
  }
});

module.exports = router;