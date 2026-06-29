const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/', protect, getMe);

module.exports = router;
