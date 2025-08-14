
const Song = require('../models/song');


const normalizeGenre = (s) =>
  s.trim().toLowerCase().replace(/[-_\s]+/g, ' ');


exports.getSongs = async (req, res, next) => {
  try {
    const { q, genre, liked, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const filter = {};

    
    if (q) {
      filter.title = { $regex: q, $options: 'i' };
    }

    
    if (genre) {
      filter.genre = normalizeGenre(genre);
    }

    if (liked !== undefined) {
      filter.liked = String(liked).toLowerCase() === 'true';
    }

    const skip = (Number(page) - 1) * Number(limit);

    const items = await Song.find(filter)
      .sort(sort.split(',').join(' '))
      .skip(skip)
      .limit(Number(limit));

    const total = await Song.countDocuments(filter);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};


exports.getSong = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ error: 'Song not found' });
    res.json(song);
  } catch (err) {
    next(err);
  }
};


exports.createSong = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (data.title) data.title = data.title.trim();
    if (data.artist) data.artist = data.artist.trim();
    if (data.genre) data.genre = normalizeGenre(data.genre);

    data.owner = req.user.id;


    const song = await Song.create(data);
    res.status(201).json(song);
  } catch (err) {
    next(err);
  }
};


exports.updateSong = async (req, res, next) => {
  try {
    const s = await Song.findById(req.params.id);
    if (!s) return res.status(404).json({ error: 'Song not found' });
    if (s.owner && s.owner.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
    }

    const data = { ...req.body };
    if (data.title) data.title = data.title.trim();
    if (data.artist) data.artist = data.artist.trim();
    if (data.genre) data.genre = normalizeGenre(data.genre);

    const updated = await Song.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ error: 'Song not found' });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};


exports.deleteSong = async (req, res, next) => {
  try {
    const s = await Song.findById(req.params.id);
    if (!s) return res.status(404).json({ error: 'Song not found' });
    if (s.owner && s.owner.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
    }
    await s.deleteOne();
    res.json({ message: 'Song deleted' });
  } catch (err) { next(err); }
};

