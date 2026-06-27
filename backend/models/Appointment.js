const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  doctorName: {
    type: String,
  },
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
  },
  patientEmail: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  patientPhone: {
    type: String,
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required'],
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required'],
  },
  consultationType: {
    type: String,
    enum: ['in-clinic', 'video'],
    default: 'in-clinic',
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
