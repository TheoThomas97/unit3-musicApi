const Playlists = require('../models/playlists');
const Song = require('../models/song');


exports.getPlaylists = async (req, res, next) => {
  try {
    const items = await Playlists.find({ owner: req.user.id })
      .populate('songs', 'title artist genre year')
      .sort('-createdAt');
    res.json(items);
  } catch (e) { next(e); }
};


exports.getPlaylist = async (req, res, next) => {
  try {
    const p = await Playlists.findById(req.params.id).populate('songs', 'title artist genre year');
    if (!p) return res.status(404).json({ error: 'Not found' });
    if (p.owner.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    res.json(p);
  } catch (e) { next(e); }
};


exports.createPlaylist = async (req, res, next) => {
  try {
    const data = {
      name: req.body.name?.trim(),
      description: req.body.description?.trim(),
      owner: req.user.id
    };
    const p = await Playlists.create(data);
    res.status(201).json(p);
  } catch (e) { next(e); }
};


exports.updatePlaylist = async (req, res, next) => {
  try {
    const p = await Playlists.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    if (p.owner.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    p.name = req.body.name?.trim() ?? p.name;
    p.description = req.body.description?.trim() ?? p.description;
    await p.save();
    res.json(p);
  } catch (e) { next(e); }
};


exports.deletePlaylist = async (req, res, next) => {
  try {
    const p = await Playlists.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    if (p.owner.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    await p.deleteOne();
    res.json({ message: 'Playlist deleted' });
  } catch (e) { next(e); }
};


exports.addSong = async (req, res, next) => {
  try {
    const p = await Playlists.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    if (p.owner.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const song = await Song.findById(req.body.songId);
    if (!song) return res.status(400).json({ error: 'Invalid songId' });

    if (!p.songs.some(id => id.toString() === song._id.toString())) {
      p.songs.push(song._id);
      await p.save();
    }
    const populated = await p.populate('songs', 'title artist genre year');
    res.json(populated);
  } catch (e) { next(e); }
};


exports.removeSong = async (req, res, next) => {
  try {
    const p = await Playlists.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    if (p.owner.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    p.songs = p.songs.filter(id => id.toString() !== req.params.songId);
    await p.save();
    const populated = await p.populate('songs', 'title artist genre year');
    res.json(populated);
  } catch (e) { next(e); }
};
