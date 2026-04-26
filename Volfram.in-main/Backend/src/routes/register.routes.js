const express = require("express");
const router = express.Router();
const User = require("../models/register.models.js");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail");

router.post("/register", async (req, res) => {
  try {
    const { name, email, number, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match ❌" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      name,
      email,
      number,
      password: hashedPassword,
      verificationToken: token
    });

    await newUser.save();

    await sendEmail(email, token);

    res.status(201).json({ message: "User registered successfully ✅" });

  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: error.message });
  }
});



router.get("/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token
    });

    if (!user) {
      return res.status(400).send("Invalid token ❌");
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    res.send("Email verified successfully ✅");

  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;