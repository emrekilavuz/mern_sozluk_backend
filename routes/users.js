const express = require('express');
const {getAllUsers, getAUser, updateAUser, deleteAUser, createAUser} = require('../controllers/users');
const User = require('../models/User');
const {protect, authorize} = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const router = express.Router();

router.use(protect);
router.use(authorize("mod", "admin"));

router.get('/', advancedResults(User), getAllUsers);
router.post('/', createAUser);
router.put('/:id', updateAUser);
router.delete('/:id', deleteAUser);
router.get('/:id', getAUser);

module.exports = router;