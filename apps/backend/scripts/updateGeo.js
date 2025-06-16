const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load your .env

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in .env');
  process.exit(1);
}

(async () => {
  try {
    // Connect to MongoDB and select the correct DB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.useDb('sample_geospatial');

    // Define schema
    const wreckSchema = new mongoose.Schema({
      latdec: Number,
      londec: Number,
      location: {
        type: {
          type: String,
          enum: ['Point'],
        },
        coordinates: [Number],
      }
    }, { strict: false });

    const Wreck = db.model('Wreck', wreckSchema, 'shipwrecks_copy123');

    // Find docs missing location
    const cursor = Wreck.find({
      location: { $exists: false },
      latdec: { $ne: null },
      londec: { $ne: null }
    }).cursor();

    let count = 0;

    for await (const doc of cursor) {
      doc.location = {
        type: 'Point',
        coordinates: [doc.londec, doc.latdec]
      };
      await doc.save();
      count++;

      if (count % 500 === 0) {
        console.log(`Updated ${count} documents...`);
      }
    }

    console.log(`✅ Done! Total documents updated: ${count}`);

    // Create 2dsphere index
    await Wreck.collection.createIndex({ location: '2dsphere' });
    console.log('📍 2dsphere index created');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
})();
