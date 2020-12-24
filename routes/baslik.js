const express = require('express');
const router = express.Router();
const BaslikModel = require('../models/Baslik');
const {getAllBasliks, getAdvanced, uploadImageForBaslik, createABaslik} = require('../controllers/baslik');
const advancedResults = require('../middleware/advancedResults');
const {protect} = require('../middleware/auth');

router.get('/advanced', advancedResults(BaslikModel, null), getAdvanced);
//router.get('/', protect, getAllBasliks);
router.put('/:id/photo', protect, uploadImageForBaslik);
router.post('/', protect, createABaslik);


module.exports = router;