const express = require('express');
const router = express.Router();
const { getDoctors, getDoctorById, getSpecialties } = require('../controllers/doctorController');

router.get('/', getDoctors);
router.get('/specialties/all', getSpecialties);
router.get('/:id', getDoctorById);

module.exports = router;
