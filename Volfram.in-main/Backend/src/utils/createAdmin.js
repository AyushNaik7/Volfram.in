const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('../models/register.models.js');

/**
 * Utility script to create an admin user
 * Run: node src/utils/createAdmin.js
 */
async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected to MongoDB ✅');

    // Keep administrator credentials out of source control.
    const adminData = {
      name: process.env.ADMIN_NAME?.trim(),
      email: process.env.ADMIN_EMAIL?.trim().toLowerCase(),
      password: process.env.ADMIN_PASSWORD,
      number: process.env.ADMIN_PHONE?.trim(),
      role: 'admin'
    };

    if (!adminData.name || !adminData.email || !adminData.password || !adminData.number) {
      throw new Error('Set ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_PHONE before creating an admin user.');
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('❌ Admin user already exists with email:', adminData.email);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Create admin user
    const adminUser = new User({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      number: adminData.number,
      isVerified: true,
      role: adminData.role
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('Email:', adminData.email);

    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
