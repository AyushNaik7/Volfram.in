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
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://volfram-ashen.vercel.app',
  'https://volfram-app.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Allow if origin is in allowedOrigins list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow all Vercel preview deployments
    if (origin && origin.includes('vercel.app')) {
      return callback(null, true);
    }

    // Otherwise, reject
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
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
const chatbotRoutes = require("./routes/chatbot.js");
const quotationRoutes = require("./routes/quotation.js");
const calculatorRoutes = require("./routes/calculator.routes");

// Use routes
app.use("/api", enquiryRoutes);
app.use("/api", require("./routes/register.routes.js"));
app.use("/api", require("./routes/login.routes.js"));
app.use("/api/auth", authRoutes);           // JWT auth routes
app.use("/api/admin", adminRoutes);          // Admin dashboard routes
app.use("/api", chatbotRoutes);              // Chatbot AI routes at /api/chat
app.use("/api", quotationRoutes);            // Quotation routes at /api/quotation
app.use('/api/calculators', calculatorRoutes);

// ── Public routes (no auth) ──────────────────────────────────────────────────

// Public image fetch — for website sections
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

// Public pages list — for header dropdown
const Page = require('./models/Page');
app.get('/api/public-pages', async (req, res) => {
  try {
    const pages = await Page.find()
      .select('title category _id')
      .sort({ createdAt: -1 });
    res.status(200).json({ pages });
  } catch (error) {
    res.status(500).json({ message: 'Error.', error: error.message });
  }
});

// Public single page detail
app.get('/api/public-pages/:id', async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found.' });
    res.status(200).json({ page });
  } catch (error) {
    res.status(500).json({ message: 'Error.', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
