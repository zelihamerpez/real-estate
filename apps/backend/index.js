// External Modules
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Environemnt Configuration
dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const MAPBOX_TOKEN = process.env.MAPBOX_API

// Route Imports
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const shipwrecksRoutes = require("./routes/shipwrecksRoutes");


// APP Initialization
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true,
}));

// Root Endpoint
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Maobox Token Endpoint
app.get('/api/mapbox-token', (req, res) => {
  if (!MAPBOX_TOKEN || typeof MAPBOX_TOKEN !== 'string' || MAPBOX_TOKEN.trim() === '') {
    console.error('[ERROR] Mapbox token is missing or invalid. Check secret.txt.');
    return res.status(500).json({ error: 'Mapbox token is not configured' });
  }

  res.json({ token: MAPBOX_TOKEN });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/shipwrecks", shipwrecksRoutes);

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
