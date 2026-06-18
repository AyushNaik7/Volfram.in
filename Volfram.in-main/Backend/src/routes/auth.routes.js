const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/register.models.js');

/**
 * POST /api/auth/login
 * Login with email and password
 * Returns access token in response body and refresh token in HTTP-only cookie
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required.' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password.' 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid email or password.' 
      });
    }

    // Generate access token (expires in 15 minutes)
    const issuedAt = Date.now(); // Using vanilla JavaScript Date.now()
    const accessToken = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role,
        issuedAt: issuedAt
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Generate refresh token (expires in 7 days)
    const refreshToken = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });

    // Return access token in response body
    res.status(200).json({
      message: 'Login successful',
      accessToken: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login.',
      error: error.message 
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token from cookie
 * Returns new access token in response body
 */
router.post('/refresh', async (req, res) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ 
        message: 'Refresh token not found. Please login again.' 
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Generate new access token (expires in 15 minutes)
    const issuedAt = Date.now(); // Using vanilla JavaScript Date.now()
    const newAccessToken = jwt.sign(
      { 
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        issuedAt: issuedAt
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Return new access token
    res.status(200).json({
      message: 'Token refreshed successfully',
      accessToken: newAccessToken
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Refresh token expired. Please login again.' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid refresh token. Please login again.' 
      });
    }

    console.error('Token refresh error:', error);
    res.status(500).json({ 
      message: 'Server error during token refresh.',
      error: error.message 
    });
  }
});

/**
 * POST /api/auth/logout
 * Clear refresh token cookie
 */
router.post('/logout', (req, res) => {
  try {
    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({ 
      message: 'Logout successful' 
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      message: 'Server error during logout.',
      error: error.message 
    });
  }
});

module.exports = router;
