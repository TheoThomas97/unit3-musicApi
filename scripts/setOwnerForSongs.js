require('dotenv').config();
const mongoose = require('mongoose');
const Song = require('../models/song');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const userId = process.env.DEFAULT_OWNER_ID; 
    if (!userId) throw new Error('Set DEFAULT_OWNER_ID in .env');

    const result = await Song.updateMany(
      { $or: [{ owner: { $exists: false } }, { owner: null }] },
      { $set: { owner: userId } }
    );

    console.log(`Updated ${result.modifiedCount} songs.`);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
