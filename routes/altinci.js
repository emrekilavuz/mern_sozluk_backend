const express = require('express');
const router = express.Router();
const {getAltinciPaginated, getAllAltincis, getOneAltinci, updateOneAltinci, deleteOneAltinci, postOneAltinci, getAltinciByName} = require('../controllers/altinci.js');
const Altinci = require('../models/Altincilar');
const advancedResults = require('../middleware/advancedResults.js');
const {protect, authorize} = require('../middleware/auth');
// @desc Get all altincis
router.get('/', protect, getAllAltincis);

router.get('/paginated', advancedResults(Altinci, null) ,getAltinciPaginated);

router.get('/:id', getOneAltinci);

router.get('/byName/something/:namee', getAltinciByName);

router.post('/', protect, authorize("mod","admin"), postOneAltinci);

router.put('/:id', protect, authorize("mod","admin"), updateOneAltinci);

router.delete('/:id', protect, authorize("mod","admin"), deleteOneAltinci);


module.exports = router;