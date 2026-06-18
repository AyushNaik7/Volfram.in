const express=require("express");
const router = express.Router();
const Enquiry=require("../models/Enquiry.models.js");

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

module.exports = router;