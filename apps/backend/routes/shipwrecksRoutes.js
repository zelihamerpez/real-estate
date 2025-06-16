const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load your .env
const MONGO_URI = process.env.MONGO_URI;

const router = express.Router();

// Connect to DB (must be awaited at runtime)
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected for /nearest route');
}).catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err);
});

// Use the correct DB and collection
const db = mongoose.connection.useDb('sample_geospatial');

const wreckSchema = new mongoose.Schema({}, { strict: false });
const Wreck = db.model('Wreck', wreckSchema, 'shipwrecks_copy123');

router.get('/nearest', async (req, res) => {
  const { lat, lon, n } = req.query;

  if (!lat || !lon || !n) {
    return res.status(400).json({ error: 'Missing parameters: lat, lon, n required' });
  }

  try {
    const results = await Wreck.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lon), parseFloat(lat)]
          },
          distanceField: "dist.calculated",
          spherical: true
        },
      },
      {
        $limit: parseInt(n)
      }
    ]);

    res.json(results);
  } catch (err) {
    console.error("Geo search failed", err);
    res.status(500).json({ error: "Geo search failed" });
  }
});

module.exports = router;
