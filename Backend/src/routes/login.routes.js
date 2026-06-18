const express = require("express");
const router = express.Router();
const User = require("../models/register.models.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found " });
    }
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email first 📩"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful ",
      token
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
