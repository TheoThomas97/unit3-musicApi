require('dotenv').config();
const mongoose = require('mongoose');
const Song = require('../models/song');

const normalizeGenre = (s) =>
  s.trim().toLowerCase().replace(/[-_\s]+/g, ' ');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const songs = await Song.find({ genre: { $exists: true } });

  for (const s of songs) {
    const normalized = normalizeGenre(s.genre);
    if (s.genre !== normalized) {
      s.genre = normalized;
      await s.save();
      console.log(`Updated: ${s.title} → ${normalized}`);
    }
  }

  console.log('Done');
  process.exit(0);
})();
