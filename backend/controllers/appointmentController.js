const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

const createAppointment = async (req, res) => {
  try {
    const { doctorName, patientName, gender, phone, appointmentDate, appointmentTime } = req.body;

    if (!doctorName || !patientName || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ message: 'Please provide doctorName, patientName, appointmentDate and appointmentTime' });
    }

    const db = getDb();
    console.log('CREATE: userEmail from token:', req.user.email);
    const appointment = {
      userEmail: req.user.email,
      doctorName,
      patientName,
      gender: gender || '',
      phone: phone || '',
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      createdAt: new Date(),
    };

    const result = await db.collection('appointments').insertOne(appointment);
    res.status(201).json({ _id: result.insertedId, ...appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const db = getDb();
    const queryEmail = req.user.email;
    console.log('GET: querying userEmail:', queryEmail);

    const appointments = await db.collection('appointments')
      .find({ userEmail: queryEmail })
      .sort({ createdAt: -1 })
      .toArray();

    console.log('GET: appointments found:', appointments.length);

    if (appointments.length === 0) {
      const total = await db.collection('appointments').countDocuments();
      const emails = await db.collection('appointments').distinct('userEmail');
      console.log('GET: total appointments in collection:', total);
      console.log('GET: distinct userEmail values in DB:', emails);
      console.log('GET: does queryEmail exist in DB?', emails.includes(queryEmail));
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const db = getDb();
    const appointment = await db.collection('appointments').findOne({ _id: new ObjectId(req.params.id) });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.userEmail !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    const updateData = {};
    if (req.body.patientName) updateData.patientName = req.body.patientName;
    if (req.body.gender) updateData.gender = req.body.gender;
    if (req.body.phone) updateData.phone = req.body.phone;
    if (req.body.appointmentDate) updateData.appointmentDate = new Date(req.body.appointmentDate);
    if (req.body.appointmentTime) updateData.appointmentTime = req.body.appointmentTime;

    await db.collection('appointments').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    const updated = await db.collection('appointments').findOne({ _id: new ObjectId(req.params.id) });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const db = getDb();
    const appointment = await db.collection('appointments').findOne({ _id: new ObjectId(req.params.id) });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.userEmail !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized to delete this appointment' });
    }

    await db.collection('appointments').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Appointment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const db = getDb();
    const appointments = await db.collection('appointments').find().sort({ createdAt: -1 }).toArray();
    console.log('Appointments found:', appointments.length);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAppointment, getMyAppointments, getAllAppointments, updateAppointment, deleteAppointment };
