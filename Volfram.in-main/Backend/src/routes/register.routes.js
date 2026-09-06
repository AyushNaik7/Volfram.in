const express = require("express");
const router = express.Router();
const User = require("../models/register.models.js");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail");
const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');
const createOtp = () => String(crypto.randomInt(100000, 1000000));

const issueVerificationOtp = async (user) => {
  console.log(`[REGISTER] issueVerificationOtp reached for ${user.email}`);
  const otp = createOtp();
  user.verificationOtpHash = hashOtp(otp);
  user.verificationOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  user.verificationOtpAttempts = 0;
  await user.save();
  console.log(`[REGISTER] calling sendEmail for ${user.email}`);
  await sendEmail(user.email, user.verificationToken, otp);
};

router.post("/register", async (req, res) => {
  console.log(`[REGISTER] route reached, pid=${process.pid}, email=${req.body.email}`);
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
      await issueVerificationOtp(existingUser);
      return res.status(200).json({ message: "Verification OTP sent successfully ✅", requiresOtp: true, email });
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
      console.log("📧 About to call issueVerificationOtp");
      await issueVerificationOtp(newUser);
    } catch (emailError) {
      await User.deleteOne({ _id: newUser._id });
      throw emailError;
    }

    res.status(201).json({ message: "Verification OTP sent successfully ✅", requiresOtp: true, email });

  } catch (error) {
    console.error("Error during registration:", error);
    const statusCode = error.code === "EMAIL_NOT_CONFIGURED" ? 503 : 500;
    res.status(statusCode).json({ message: error.message, error: error.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const otp = req.body.otp?.trim();
    if (!email || !/^\d{6}$/.test(otp || '')) {
      return res.status(400).json({ message: 'Email and a 6-digit OTP are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.isVerified) return res.status(400).json({ message: 'Email is already verified.' });
    if (!user.verificationOtpHash || !user.verificationOtpExpiresAt || user.verificationOtpExpiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired. Please request a new OTP.' });
    }
    if (user.verificationOtpAttempts >= 5) {
      return res.status(429).json({ message: 'Too many incorrect attempts. Please request a new OTP.' });
    }
    if (hashOtp(otp) !== user.verificationOtpHash) {
      user.verificationOtpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: 'Incorrect OTP.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationOtpHash = undefined;
    user.verificationOtpExpiresAt = undefined;
    user.verificationOtpAttempts = 0;
    await user.save();
    res.json({ message: 'Email verified successfully ✅' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Unable to verify OTP.' });
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
    user.verificationOtpHash = undefined;
    user.verificationOtpExpiresAt = undefined;
    user.verificationOtpAttempts = 0;

    await user.save();

    res.send("Email verified successfully ✅");

  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;