const express = require('express');
const router = express.Router();
const { debugDb } = require('../controllers/debugController');

router.get('/db', debugDb);

module.exports = router;
