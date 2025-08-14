
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/songController');
const auth = require('../middleware/auth'); 

router.get('/', ctrl.getSongs);          
router.get('/:id', ctrl.getSong);       


router.post('/', auth, ctrl.createSong);      
router.put('/:id', auth, ctrl.updateSong);    
router.delete('/:id', auth, ctrl.deleteSong);

module.exports = router;

