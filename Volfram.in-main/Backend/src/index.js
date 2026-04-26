const express = require("express");
const cors = require("cors");
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

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const enquiryRoutes = require("./routes/enquiry.routes.js"); 

app.use("/api", enquiryRoutes);
app.use("/api", require("./routes/register.routes.js"));
app.use("/api", require("./routes/login.routes.js"));