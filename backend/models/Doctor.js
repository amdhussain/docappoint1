const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Doctor name is required'],
  },
  email: {
    type: String,
  },
  photo: {
    type: String,
  },
  specialty: {
    type: String,
    required: [true, 'Specialty is required'],
  },
  qualifications: {
    type: String,
  },
  experience: {
    type: Number,
  },
  about: {
    type: String,
  },
  languages: {
    type: String,
  },
  clinicName: {
    type: String,
  },
  clinicAddress: {
    type: String,
  },
  city: {
    type: String,
  },
  consultationFee: {
    type: Number,
    default: 500,
  },
  videoFee: {
    type: Number,
    default: 300,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  availableToday: {
    type: Boolean,
    default: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('Doctor', doctorSchema);
