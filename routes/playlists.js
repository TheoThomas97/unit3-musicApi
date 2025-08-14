const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const ctrl = require('../controllers/playlistsController');

const router = express.Router();


router.use(auth);

router.get('/', ctrl.getPlaylists);
router.get('/:id', ctrl.getPlaylist);

router.post('/',
  body('name').trim().notEmpty().withMessage('Name is required'),
  ctrl.createPlaylist
);

router.put('/:id',
  body('name').optional().trim().notEmpty(),
  ctrl.updatePlaylist
);

router.delete('/:id', ctrl.deletePlaylist);


router.post('/:id/songs',
  body('songId').trim().notEmpty().withMessage('songId is required'),
  ctrl.addSong
);

router.delete('/:id/songs/:songId', ctrl.removeSong);

module.exports = router;
