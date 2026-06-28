const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

router.route('/')
  .get(protect, getMe)
  .post((req, res, next) => {
    const action = req.query.action;
    if (action === 'login') return loginUser(req, res, next);
    if (action === 'register') return registerUser(req, res, next);
    return res.status(400).json({ message: 'Invalid action. Use ?action=login or ?action=register' });
  });

module.exports = router;
