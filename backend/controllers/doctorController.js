const Doctor = require('../models/doctorModel');

const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSpecialties = async (req, res) => {
  try {
    const specialties = await Doctor.distinct('specialty');
    res.json(specialties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDoctors, getDoctorById, getSpecialties };
