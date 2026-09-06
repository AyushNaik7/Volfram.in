const express = require('express');
const Event = require('../models/Event.models.js');
const SiteImage = require('../models/SiteImage.js');
const fs = require('fs');
const path = require('path');
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
    const existingEvent = await Event.findOne({ title: title.trim() });
    if (existingEvent) {
      return res.status(409).json({ message: 'An event with this title already exists.' });
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

router.delete('/admin/events/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found.' });

    const images = await SiteImage.find({ section: 'events', eventId: event._id.toString() });
    await Promise.all(images.map(async image => {
      const filePath = path.join(__dirname, '../../', image.imageUrl);
      if (fs.existsSync(filePath)) await fs.promises.unlink(filePath);
    }));
    await SiteImage.deleteMany({ section: 'events', eventId: event._id.toString() });
    await event.deleteOne();

    res.json({ message: 'Event and its images deleted.' });
  } catch (error) {
    console.error('Failed to delete event:', error);
    res.status(500).json({ message: 'Failed to delete event.', error: error.message });
  }
});

module.exports = router;