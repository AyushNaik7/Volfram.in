const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
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
