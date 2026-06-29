const express = require('express');
const router = express.Router();
const { createAppointment, getMyAppointments, getAllAppointments, updateAppointment, deleteAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createAppointment);
router.get('/', getMyAppointments);
router.get('/all', getAllAppointments);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;
