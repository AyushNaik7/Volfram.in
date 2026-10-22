const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log("MongoDB Connected ✅");
    return true;
  } catch (error) {
    console.warn("MongoDB is unavailable; continuing without a database connection.");
    console.warn(error.message);
    return false;
  }
};

module.exports = connectDB;