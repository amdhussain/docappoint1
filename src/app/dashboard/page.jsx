'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@/components/AuthProvider';
import { HiPencil, HiTrash, HiCalendar, HiClock, HiUser, HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaTimes, FaSpinner, FaStar, FaUserMd } from 'react-icons/fa';

function getInitials(name) {
  if (!name) return 'D';
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

function UpdateModal({ appointment, onClose, onSave }) {
  const [formData, setFormData] = useState({
    patientName: '',
    gender: '',
    phone: '',
    appointmentDate: '',
    appointmentTime: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (appointment) {
      setFormData({
        patientName: appointment.patientName || '',
        gender: appointment.gender || 'Male',
        phone: appointment.patientPhone || '',
        appointmentDate: appointment.appointmentDate
          ? appointment.appointmentDate.split('T')[0]
          : '',
        appointmentTime: appointment.appointmentTime || '',
      });
    }
  }, [appointment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.appointmentDate || !formData.appointmentTime) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `/api/appointments/${appointment._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = res.data.appointment || res.data;
      onSave(updated);
      toast.success('Appointment updated successfully!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update appointment');
    } finally {
      setSaving(false);
    }
  };

  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-slateDark">Update Appointment</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <FaTimes size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Doctor Name</label>
            <input
              type="text"
              value={appointment.doctorName || appointment.doctor?.name || ''}
              readOnly
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">User Email</label>
            <input
              type="email"
              value={appointment.patientEmail || ''}
              readOnly
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Patient Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Appointment Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Appointment Time <span className="text-red-500">*</span></label>
            <input
              type="time"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primaryDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving && <FaSpinner className="animate-spin" size={14} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MyBookings() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    document.title = 'My Bookings - DocAppoint';
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(Array.isArray(res.data) ? res.data : res.data.appointments || []);
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/appointments/${deleteConfirmId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments((prev) => prev.filter((a) => a._id !== deleteConfirmId));
      setDeleteConfirmId(null);
      toast.success('Appointment deleted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete appointment');
    }
  };

  const openUpdateModal = (appointment) => {
    setEditingAppointment(appointment);
    setShowModal(true);
  };

  const handleUpdateSave = (updated) => {
    setAppointments((prev) =>
      prev.map((a) => (a._id === updated._id ? { ...a, ...updated } : a))
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: 'bg-green-100 text-green-700 border-green-200',
      completed: 'bg-blue-100 text-blue-700 border-blue-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
        {status || 'Unknown'}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const styles = {
      'in-clinic': 'bg-purple-100 text-purple-700 border-purple-200',
      'video': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'in-person': 'bg-purple-100 text-purple-700 border-purple-200',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[type?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
        {type || 'N/A'}
      </span>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slateDark mb-6">My Bookings</h1>

      {appointments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiCalendar className="text-gray-400" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-slateDark mb-2">No appointments yet</h3>
          <p className="text-gray-400 text-sm">Book your first appointment to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {appointments.map((appt) => {
            const doctor = appt.doctor || {};
            const initials = getInitials(doctor.name || appt.doctorName);
            return (
              <div key={appt._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
                <div className="p-5 flex-1">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slateDark text-sm truncate">
                        {doctor.name || appt.doctorName || 'Unknown Doctor'}
                      </h3>
                      {doctor.specialty && (
                        <p className="text-xs text-primary font-medium">{doctor.specialty}</p>
                      )}
                      {appt.consultationType && (
                        <div className="mt-1">{getTypeBadge(appt.consultationType)}</div>
                      )}
                    </div>
                    <div>{getStatusBadge(appt.status)}</div>
                  </div>

                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <HiCalendar className="text-gray-400 shrink-0" size={14} />
                      <span>{formatDate(appt.appointmentDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiClock className="text-gray-400 shrink-0" size={14} />
                      <span>{appt.appointmentTime || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiUser className="text-gray-400 shrink-0" size={14} />
                      <span className="truncate">{appt.patientName || 'N/A'}</span>
                    </div>
                    {appt.patientPhone && (
                      <div className="flex items-center gap-2">
                        <HiPhone className="text-gray-400 shrink-0" size={14} />
                        <span>{appt.patientPhone}</span>
                      </div>
                    )}
                    {doctor.city && (
                      <div className="flex items-center gap-2">
                        <HiLocationMarker className="text-gray-400 shrink-0" size={14} />
                        <span>{doctor.city}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 pt-0 flex gap-2">
                  <button
                    onClick={() => openUpdateModal(appt)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 border border-primary text-primary rounded-xl text-xs font-semibold hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    <HiPencil size={14} />
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(appt._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 border border-red-300 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
                  >
                    <HiTrash size={14} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <UpdateModal
          appointment={editingAppointment}
          onClose={() => { setShowModal(false); setEditingAppointment(null); }}
          onSave={handleUpdateSave}
        />
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleteConfirmId(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slateDark mb-2">Delete Appointment</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this appointment? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-semibold text-sm hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
