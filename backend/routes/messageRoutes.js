const express = require('express');
const router = express.Router();
const { getMessages, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getMessages);
router.delete('/:id', deleteMessage);

module.exports = router;
