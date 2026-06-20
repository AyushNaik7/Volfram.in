const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const connectDB = require("./db/index.js"); // ✅ FIXED

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); // Parse cookies

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Import routes
const enquiryRoutes = require("./routes/enquiry.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const adminRoutes = require("./routes/admin.routes.js");

// Use routes
app.use("/api", enquiryRoutes);
app.use("/api", require("./routes/register.routes.js"));
app.use("/api", require("./routes/login.routes.js"));
app.use("/api/auth", authRoutes); // New auth routes with JWT
app.use("/api/admin", adminRoutes); // Admin dashboard routes

// Public image fetch route (no auth) — for website pages
const SiteImage = require('./models/SiteImage');
app.get('/api/public-images/:section', async (req, res) => {
  try {
    const images = await SiteImage.find({ section: req.params.section })
      .sort({ order: 1, createdAt: -1 });
    res.status(200).json({ images });
  } catch (error) {
    res.status(500).json({ message: 'Error.', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});