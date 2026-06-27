'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@/components/AuthProvider';
import { FaStar, FaMapMarkerAlt, FaClock, FaArrowLeft, FaSpinner, FaUserMd, FaTimes } from 'react-icons/fa';

function BookingModal({ isOpen, onClose, doctor, user }) {
  const [formData, setFormData] = useState({
    userEmail: user?.email || '',
    doctorName: doctor?.name || '',
    patientName: '',
    gender: 'Male',
    phone: '',
    appointmentDate: '',
    appointmentTime: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && doctor && user) {
      setFormData((prev) => ({
        ...prev,
        userEmail: user.email || '',
        doctorName: doctor.name || '',
      }));
    }
  }, [isOpen, doctor, user]);

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

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/appointments',
        {
          doctor: doctor._id,
          patientName: formData.patientName,
          patientEmail: formData.userEmail,
          gender: formData.gender,
          patientPhone: formData.phone,
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Appointment booked successfully!');
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to book appointment';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-slateDark">Book Appointment</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <FaTimes size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">User Email</label>
            <input
              type="email"
              name="userEmail"
              value={formData.userEmail}
              readOnly
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Doctor Name</label>
            <input
              type="text"
              name="doctorName"
              value={formData.doctorName}
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
              placeholder="Enter patient name"
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
              placeholder="Enter phone number"
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
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-white text-sm font-bold py-3 rounded-xl hover:bg-primaryDark transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting && <FaSpinner className="animate-spin" size={14} />}
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function DoctorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params?.id;

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'Doctor Details - DocAppoint';
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/doctors/${id}`);
        setDoctor(res.data);
        setError(null);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Doctor not found');
        } else {
          setError('Failed to load doctor details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-primary mx-auto mb-4" size={36} />
          <p className="text-gray-500 text-sm">Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (error && !doctor) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-2xl shadow-sm max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserMd className="text-red-500" size={28} />
          </div>
          <h2 className="text-xl font-bold text-slateDark mb-2">Doctor Not Found</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => router.push('/doctors')}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:bg-primaryDark transition-all"
          >
            Browse Doctors
          </button>
        </div>
      </div>
    );
  }

  if (!doctor) return null;

  const initials = doctor.name
    ? doctor.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'DR';

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar key={i} className={i < fullStars ? 'text-yellow-400' : 'text-gray-200'} size={14} />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6 group"
        >
          <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:border-primary transition-colors">
            <FaArrowLeft size={12} className="text-gray-500 group-hover:text-primary" />
          </div>
          <span className="text-sm font-semibold">Back to Appointments</span>
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                {doctor.image ? (
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-28 h-28 rounded-2xl object-cover border border-gray-100 shadow-sm"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center shadow-sm">
                    <span className="text-white text-3xl font-bold">{initials}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-slateDark mb-1">{doctor.name}</h1>
                <p className="text-sm text-primary font-semibold mb-3">{doctor.specialty || 'General'}</p>

                <div className="flex items-center gap-1 mb-3">
                  {renderStars(doctor.rating)}
                  <span className="text-sm font-semibold text-slateDark ml-1">
                    {doctor.rating?.toFixed(1) || 'N/A'}
                  </span>
                  <span className="text-xs text-gray-400">({doctor.reviewsCount || 0} reviews)</span>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 mb-3">
                  {doctor.experience && (
                    <span className="flex items-center gap-1.5">
                      <FaClock size={12} />
                      <span className="font-semibold text-slateDark">{doctor.experience}</span> years experience
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <FaMapMarkerAlt size={12} />
                    <span>{doctor.city || doctor.location || 'N/A'}</span>
                  </span>
                  {doctor.availableToday && (
                    <span className="text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
                      Available Today
                    </span>
                  )}
                </div>

                {doctor.about && (
                  <p className="text-sm text-gray-500 leading-relaxed">{doctor.about}</p>
                )}
              </div>

              <div className="flex-shrink-0 w-full sm:w-auto sm:text-right pt-4 sm:pt-0 sm:pl-6 sm:border-l sm:border-gray-100">
                <p className="text-2xl font-bold text-slateDark">
                  ₹{doctor.consultationFee || doctor.fee || 'N/A'}
                </p>
                <p className="text-[11px] text-gray-400 mb-4">Consultation Fee</p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full sm:w-auto bg-primary text-white text-sm font-bold py-2.5 px-8 rounded-xl hover:bg-primaryDark transition-all duration-200 shadow-sm"
                >
                  Book Appointment
                </button>
              </div>
            </div>

            {doctor.clinicName || doctor.hospital ? (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 border border-gray-100">
                    <FaUserMd className="text-primary" size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slateDark text-sm">{doctor.clinicName || doctor.hospital}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {(doctor.clinicAddress || doctor.address || '')}{doctor.city ? `, ${doctor.city}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        doctor={doctor}
        user={user}
      />
    </div>
  );
}
