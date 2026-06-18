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
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB ✅');

    // Admin user details
    const adminData = {
      name: 'Admin User',
      email: 'admin@volfram.com',
      password: 'admin123', // Change this to a secure password
      number: '9999999999',
      role: 'admin'
    };

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
    console.log('Password:', adminData.password);
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
