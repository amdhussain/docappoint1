const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true,
  },
  specialty: {
    type: String,
    required: [true, 'Specialty is required'],
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  experience: {
    type: Number,
    default: 0,
  },
  availability: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    default: '',
  },
  hospital: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  fee: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Doctor', doctorSchema);
