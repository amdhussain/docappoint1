const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

const getDoctors = async (req, res) => {
  try {
    const db = getDb();
    const doctors = await db.collection('doctors').find().toArray();
    console.log('DOCTORS: found', doctors.length, 'doctors');
    if (doctors.length > 0) console.log('DOCTORS: first doc _id type:', typeof doctors[0]._id, 'value:', doctors[0]._id);
    res.json(doctors);
  } catch (error) {
    console.error('DOCTORS: error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const db = getDb();
    const doctor = await db.collection('doctors').findOne({ _id: new ObjectId(req.params.id) });

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
    const db = getDb();
    const specialties = await db.collection('doctors').distinct('specialty');
    res.json(specialties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDoctors, getDoctorById, getSpecialties };
