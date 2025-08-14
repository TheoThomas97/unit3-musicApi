const mongoose = require('mongoose');

const playlistsSchema = new mongoose.Schema({
  name:   { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  owner:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // relation to User
  songs:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],               // relation to Song
}, { timestamps: true });

module.exports = mongoose.model('Playlists', playlistsSchema);
