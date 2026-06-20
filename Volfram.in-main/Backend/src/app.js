const express = require("express");
const cors = require("cors");

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
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
