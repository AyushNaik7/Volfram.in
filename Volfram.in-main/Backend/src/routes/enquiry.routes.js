const express=require("express");
const router = express.Router();
const Enquiry=require("../models/Enquiry.models.js");
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post("/enquiry", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const newEnquiry = new Enquiry(req.body);
    await newEnquiry.save();
    res.status(201).json({ message: "Enquiry submitted successfully" });
  } catch (error) {
     console.error("🔥 ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/enquiries', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json({ enquiries });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load enquiries.', error: error.message });
  }
});

module.exports = router;