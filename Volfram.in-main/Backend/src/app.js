const express = require("express");
const cors = require("cors");

const app = express();

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());

// Routes
const chatbotRoutes = require('./routes/chatbot');
const quotationRoutes = require('./routes/quotation');

app.use('/api/chat', chatbotRoutes);
app.use('/api/quotation', quotationRoutes);

app.get("/", (req, res) => {
  res.send("Volfram Quotation API");
});

module.exports = app;
