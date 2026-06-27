const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: [true, 'User email is required'],
    lowercase: true,
    trim: true,
  },
  doctorName: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true,
  },
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  phone: {
    type: String,
    trim: true,
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required'],
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Appointment', appointmentSchema);
