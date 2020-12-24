const express = require('express');
const {register, login, logout ,getMe, forgotPassword, resetPassword, updateUserDetails, updateUserPassword} = require('../controllers/auth');
const {protect} = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgotPassword', forgotPassword);
router.put('/resetPassword/:resettoken', resetPassword);
router.put('/updatedetails', protect, updateUserDetails);
router.put('/updatepassword', protect, updateUserPassword);
module.exports = router;