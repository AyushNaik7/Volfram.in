const express=require("express");
const router = express.Router();
const Enquiry=require("../models/Enquiry.models.js");
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post("/enquiry", async (req, res) => {
  try {
    const newEnquiry = new Enquiry(req.body);
    await newEnquiry.save();
    res.status(201).json({ message: "Enquiry submitted successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Please check the enquiry details." });
    }
    console.error("Enquiry submission failed:", error);
    res.status(500).json({ message: "Failed to submit enquiry." });
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