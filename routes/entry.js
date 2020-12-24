const express = require('express');
const { getEntriesByBaslik, deleteEntryAndYorums, createAnEntry, 
    getAdvanced, updateAnEntry, likeAnEntry, uploadImageForEntry } = require('../controllers/entry');
const {protect, authorize} = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const EntryModel = require('../models/Entry');
const { Router } = require('express');
const router = express.Router();


router.get('/advanced', advancedResults(EntryModel, {path : "ownerId", select : "nickname"}), getAdvanced);
router.get('/getEntryler/:baslikId', getEntriesByBaslik);
router.delete('/:id', protect, deleteEntryAndYorums);
router.post('/', protect, createAnEntry);
router.put('/specialUpdate/:id', protect, authorize("admin"), updateAnEntry);
router.put('/like/:id', protect, likeAnEntry);
router.put('/:id/photo', protect, uploadImageForEntry);

module.exports = router;