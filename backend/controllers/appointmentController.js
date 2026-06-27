const Appointment = require('../models/appointmentModel');

const createAppointment = async (req, res) => {
  try {
    const { doctorName, patientName, gender, phone, appointmentDate, appointmentTime } = req.body;

    if (!doctorName || !patientName || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ message: 'Please provide doctorName, patientName, appointmentDate and appointmentTime' });
    }

    const appointment = await Appointment.create({
      userEmail: req.user.email,
      doctorName,
      patientName,
      gender,
      phone,
      appointmentDate,
      appointmentTime,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userEmail: req.user.email }).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.userEmail !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    if (req.body.patientName) appointment.patientName = req.body.patientName;
    if (req.body.gender) appointment.gender = req.body.gender;
    if (req.body.phone) appointment.phone = req.body.phone;
    if (req.body.appointmentDate) appointment.appointmentDate = req.body.appointmentDate;
    if (req.body.appointmentTime) appointment.appointmentTime = req.body.appointmentTime;

    const updated = await appointment.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.userEmail !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized to delete this appointment' });
    }

    await appointment.deleteOne();
    res.json({ message: 'Appointment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAppointment, getMyAppointments, updateAppointment, deleteAppointment };
