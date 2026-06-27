'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import {
  FaCheckCircle,
  FaStar,
  FaMapMarkerAlt,
  FaVideo,
  FaSpinner,
  FaArrowLeft,
  FaCalendarCheck,
  FaUserMd,
  FaStethoscope,
  FaVenusMars,
  FaClock,
} from 'react-icons/fa';

const morningSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM',
];

const afternoonSlots = [
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
];

const isSlotAvailable = (slot) => {
  if (slot === '12:00 PM') return false;
  if (slot === '2:00 PM') return false;
  return true;
};

const mockReviews = [
  {
    name: 'Priya Sharma',
    date: 'March 15, 2026',
    rating: 5,
    text: 'Excellent doctor! Very thorough in her examination and explained everything in detail. Highly recommended for anyone looking for a caring physician.',
  },
  {
    name: 'Rahul Verma',
    date: 'March 10, 2026',
    rating: 4,
    text: 'Great experience overall. The clinic is well-maintained and the staff is very cooperative. Dr. Sharma took time to listen to all my concerns.',
  },
  {
    name: 'Ananya Patel',
    date: 'February 28, 2026',
    rating: 5,
    text: 'I have been visiting Dr. Sharma for over a year now. She is incredibly knowledgeable and always makes me feel comfortable. Best doctor in town!',
  },
  {
    name: 'Vikram Singh',
    date: 'February 20, 2026',
    rating: 4,
    text: 'Very professional and friendly. The video consultation was smooth and convenient. Prescription was sent digitally right after the session.',
  },
  {
    name: 'Neha Gupta',
    date: 'February 12, 2026',
    rating: 5,
    text: 'Dr. Sharma is an amazing pediatrician. My kids love visiting her. She has a wonderful way with children and explains everything to parents clearly.',
  },
];

export default function DoctorProfile() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    document.title = 'Doctor Profile - DocAppoint';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-primary mx-auto mb-4" size={40} />
          <p className="text-gray-500 text-lg">Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (error && !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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

  const renderStars = (rating, size = 'text-sm') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar key={i} className={i < fullStars ? `text-yellow-400 ${size}` : `text-gray-200 ${size}`} />
      );
    }
    return stars;
  };

  const initials = doctor.name
    ? doctor.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'DR';

  const languages = Array.isArray(doctor.languages)
    ? doctor.languages
    : typeof doctor.languages === 'string'
    ? doctor.languages.split(',').map((l) => l.trim())
    : [];

  const services = Array.isArray(doctor.services)
    ? doctor.services
    : ['Video Consultation', 'In-Clinic Visit', 'Prescription Refill', 'Health Checkup', 'Vaccination'];

  const qualifications = doctor.qualifications || doctor.qualification || '';
  const clinicAddress = doctor.clinicAddress || doctor.address || 'N/A';
  const clinicName = doctor.clinicName || doctor.hospital || 'N/A';
  const specialty = doctor.specialty || doctor.specialization || 'General';

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6 group"
        >
          <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:border-primary transition-colors">
            <FaArrowLeft size={12} className="text-gray-500 group-hover:text-primary" />
          </div>
          <span className="text-sm font-semibold">Back to Doctors</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ===== LEFT COLUMN (lg:col-span-2) ===== */}
          <div className="lg:col-span-2 space-y-6">

            {/* ------------- PROFILE HEADER ------------- */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-start gap-6 p-6">
                {/* Image + Verified badge */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-24 h-24 rounded-full border-4 border-gray-50 shadow-sm overflow-hidden flex-shrink-0">
                    {doctor.image ? (
                      <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">{initials}</span>
                      </div>
                    )}
                  </div>
                  {doctor.isVerified && (
                    <span className="flex items-center gap-1 text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
                      <FaCheckCircle size={10} />
                      Verified
                    </span>
                  )}
                </div>

                {/* Doctor details */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl lg:text-2xl font-bold text-slateDark mb-1">
                    Dr. {doctor.name?.replace(/^Dr\.?\s*/i, '') || 'Rajesh Kumar'}
                  </h1>
                  <p className="text-sm text-primary font-semibold mb-2">{specialty}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500 mb-2">
                    <div className="flex items-center gap-1">
                      {renderStars(doctor.rating || 0, 'text-xs')}
                      <span className="font-semibold text-slateDark ml-1 text-sm">
                        {doctor.rating?.toFixed(1) || '4.8'}
                      </span>
                      <span className="text-gray-400 text-xs">({doctor.reviewsCount || 0} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaClock size={12} />
                      <span className="font-semibold text-slateDark">{doctor.experience || 12}</span>
                      <span className="text-xs">years exp.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt size={12} />
                      <span className="truncate max-w-[160px]">{doctor.city || 'Mumbai'}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-1">{qualifications || 'MBBS, MD - General Medicine'}</p>
                </div>

                {/* Fee + CTA buttons */}
                <div className="flex flex-col items-end gap-2.5 flex-shrink-0 pl-4 border-l border-gray-100">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slateDark">₹{doctor.consultationFee || 500}</p>
                    <p className="text-[11px] text-gray-400">Consultation Fee</p>
                  </div>
                  <Link
                    href={`/book-appointment?id=${doctor._id || id}`}
                    className="w-full bg-primary text-white text-sm font-bold py-2.5 px-6 rounded-xl hover:bg-primaryDark transition-all duration-200 shadow-sm text-center"
                  >
                    Book Appointment
                  </Link>
                  <button className="w-full border-2 border-primary text-primary text-sm font-semibold py-2 px-6 rounded-xl hover:bg-primary hover:text-white transition-all duration-200 text-center">
                    Call Clinic
                  </button>
                </div>
              </div>
            </div>

            {/* ------------- CLINIC & HOSPITAL ------------- */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center flex-shrink-0 border border-gray-100">
                  <FaUserMd className="text-primary" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slateDark text-base mb-1">{clinicName}</h3>
                  <p className="text-sm text-gray-500 mb-1.5">{clinicAddress}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Mon-Sat, 9:00 AM – 6:00 PM
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      Sun: Closed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ------------- AVAILABLE TIME SLOTS ------------- */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-slateDark mb-4 flex items-center gap-2">
                <FaClock className="text-primary" size={15} />
                Available Time Slots
              </h2>

              <p className="text-xs text-gray-400 font-medium mb-4">Morning</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {morningSlots.map((slot) => {
                  const available = isSlotAvailable(slot);
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      disabled={!available}
                      onClick={() => setSelectedSlot(isSelected ? null : slot)}
                      className={`text-xs font-semibold py-2 px-3.5 rounded-lg border transition-all duration-200 ${
                        !available
                          ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-blue-50 text-primary border-blue-100 hover:bg-primary hover:text-white hover:border-primary'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-gray-400 font-medium mb-4">Afternoon</p>
              <div className="flex flex-wrap gap-2">
                {afternoonSlots.map((slot) => {
                  const available = isSlotAvailable(slot);
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      disabled={!available}
                      onClick={() => setSelectedSlot(isSelected ? null : slot)}
                      className={`text-xs font-semibold py-2 px-3.5 rounded-lg border transition-all duration-200 ${
                        !available
                          ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-blue-50 text-primary border-blue-100 hover:bg-primary hover:text-white hover:border-primary'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ------------- PATIENT REVIEWS ------------- */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-slateDark mb-5">Patient Reviews</h2>
              <div className="space-y-5">
                {mockReviews.map((review, idx) => (
                  <div key={idx} className={idx < mockReviews.length - 1 ? 'pb-5 border-b border-gray-100' : ''}>
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {review.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slateDark text-sm">{review.name}</p>
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                className={star <= review.rating ? 'text-yellow-400 text-[10px]' : 'text-gray-200 text-[10px]'}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-400">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed pl-12">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== RIGHT COLUMN (lg:col-span-1) ===== */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 space-y-6">

              {/* ------------- QUICK ACTIONS ------------- */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-slateDark mb-3 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007A87" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  Quick Actions
                </h2>
                <button className="w-full bg-primary text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 hover:bg-primaryDark transition-all duration-200 shadow-sm mb-2.5">
                  <FaVideo size={14} />
                  Start Video Consultation
                </button>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Next Available</span>
                    <span className="font-semibold text-slateDark">Today, 2:30 PM</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Session Duration</span>
                    <span className="font-semibold text-slateDark">30 mins</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Platform</span>
                    <span className="font-semibold text-primary">Secure Video</span>
                  </div>
                </div>
              </div>

              {/* ------------- SERVICES OFFERED ------------- */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-slateDark mb-3 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007A87" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  Services Offered
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {services.map((service) => (
                    <span
                      key={service}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-primary border border-teal-200"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
