const express = require("express");
const router = express.Router();
const User = require("../models/register.models.js");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail");

router.post("/register", async (req, res) => {
  try {
    const { name, email, number, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match ❌" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: "User already exists ❌" });
      }

      existingUser.verificationToken = token;
      await existingUser.save();
      await sendEmail(email, token);
      return res.status(200).json({ message: "Verification email resent successfully ✅" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Only allow 'user' or 'admin'; default to 'user' for any other value
    const allowedRoles = ['user', 'admin'];
    const assignedRole = allowedRoles.includes(role) ? role : 'user';

    const newUser = new User({
      name,
      email,
      number,
      password: hashedPassword,
      verificationToken: token,
      role: assignedRole
    });

    await newUser.save();

    try {
      await sendEmail(email, token);
    } catch (emailError) {
      await User.deleteOne({ _id: newUser._id });
      throw emailError;
    }

    res.status(201).json({ message: "User registered successfully ✅" });

  } catch (error) {
    console.error("Error during registration:", error);
    const statusCode = error.code === "EMAIL_NOT_CONFIGURED" ? 503 : 500;
    res.status(statusCode).json({ message: error.message, error: error.message });
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