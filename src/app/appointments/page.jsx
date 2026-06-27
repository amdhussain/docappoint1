'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { HiOutlineSearch } from 'react-icons/hi';
import { FiChevronDown } from 'react-icons/fi';
import { ImSpinner2 } from 'react-icons/im';
import { FaStar, FaMapMarkerAlt, FaUserMd } from 'react-icons/fa';

const sortOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Fee: Low to High', value: 'fee_asc' },
  { label: 'Fee: High to Low', value: 'fee_desc' },
];

const INITIALS_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
  'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-rose-500',
];

function getInitials(name) {
  if (!name) return 'D';
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

function getInitialsColor(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return INITIALS_COLORS[Math.abs(hash) % INITIALS_COLORS.length];
}

function formatFee(fee) {
  if (!fee && fee !== 0) return 'N/A';
  return `\u20B9${Number(fee).toLocaleString('en-IN')}`;
}

function renderStars(rating) {
  const stars = [];
  const fullStars = Math.floor(rating || 0);
  for (let i = 0; i < 5; i++) {
    stars.push(
      <FaStar key={i} className={i < fullStars ? 'text-yellow-400' : 'text-gray-200'} size={12} />
    );
  }
  return stars;
}

function DoctorCard({ doctor, onViewDetails }) {
  const hasImage = doctor.image && doctor.image !== '';
  const initials = getInitials(doctor.name);
  const colorClass = getInitialsColor(doctor.name);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
      <div className="p-6 flex flex-col items-center text-center flex-1">
        <div className="mb-4">
          {hasImage ? (
            <img src={doctor.image} alt={doctor.name} className="w-20 h-20 rounded-full object-cover border-2 border-gray-50 shadow-sm" />
          ) : (
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto shadow-sm ${colorClass}`}>
              {initials}
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-slateDark mb-1">{doctor.name || 'Doctor'}</h3>

        <p className="text-sm text-primary font-semibold mb-2">
          {doctor.specialty || 'General'}
        </p>

        <div className="flex items-center justify-center gap-1 mb-2">
          {renderStars(doctor.rating)}
          <span className="text-xs text-gray-400 ml-1">
            ({doctor.reviewsCount || 0})
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
          <FaMapMarkerAlt size={10} />
          <span>{doctor.location || doctor.city || 'N/A'}</span>
        </div>

        {doctor.experience && (
          <p className="text-xs text-gray-400 mb-3">
            {doctor.experience} {parseInt(doctor.experience) === 1 ? 'Year' : 'Years'} Experience
          </p>
        )}

        <div className="mt-auto w-full pt-4 border-t border-gray-50">
          <p className="text-xl font-bold text-slateDark mb-3">{formatFee(doctor.fee || doctor.consultationFee)}</p>
          <p className="text-[11px] text-gray-400 -mt-2 mb-3">Consultation Fee</p>
          <button
            onClick={() => onViewDetails(doctor._id)}
            className="w-full bg-primary text-white text-sm font-semibold py-2.5 px-6 rounded-xl hover:bg-primaryDark transition-colors duration-200"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    document.title = 'All Appointments - DocAppoint';
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get('/api/doctors');
        const data = Array.isArray(res.data) ? res.data : res.data.doctors || res.data.data || [];
        setDoctors(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = [...doctors];
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((d) => (d.name || '').toLowerCase().includes(term));
    }
    if (sortBy === 'fee_asc') {
      result.sort((a, b) => (Number(a.fee || a.consultationFee) || 0) - (Number(b.fee || b.consultationFee) || 0));
    } else if (sortBy === 'fee_desc') {
      result.sort((a, b) => (Number(b.fee || b.consultationFee) || 0) - (Number(a.fee || a.consultationFee) || 0));
    }
    return result;
  }, [doctors, searchTerm, sortBy]);

  const handleViewDetails = useCallback((doctorId) => {
    if (user) {
      router.push(`/doctor/${doctorId}`);
    } else {
      router.push('/login');
    }
  }, [user, router]);

  const handleResetFilters = () => {
    setSortBy('default');
    setSearchTerm('');
  };

  const hasActiveFilters = sortBy !== 'default' || searchTerm.trim() !== '';

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            Find Doctors
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slateDark">All Appointments</h1>
          <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            Browse through our list of verified doctors and view their detailed profiles
          </p>
        </div>

        <div className="relative mb-6">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search appointments by doctor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm transition-all duration-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-sm text-gray-500 font-medium">Sort by Fee:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-full px-5 py-2.5 pr-9 cursor-pointer hover:border-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
          </div>
          {hasActiveFilters && (
            <button onClick={handleResetFilters} className="text-xs text-gray-500 hover:text-red-500 underline underline-offset-2 transition-colors duration-200 ml-1">
              Clear all
            </button>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <ImSpinner2 className="animate-spin text-primary" size={36} />
            <p className="mt-4 text-sm text-gray-400">Loading appointments...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
              <p className="text-red-600 font-medium">Failed to load appointments</p>
              <p className="text-sm text-red-400 mt-1">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-4 text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl transition-colors duration-200">
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && filteredAndSorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center max-w-md shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUserMd className="text-gray-400" size={28} />
              </div>
              <p className="text-gray-700 font-semibold text-lg">No appointments found</p>
              <p className="text-sm text-gray-400 mt-1">No doctors found matching your criteria. Try adjusting your search or filters.</p>
              {hasActiveFilters && (
                <button onClick={handleResetFilters} className="mt-5 text-sm font-medium text-white bg-primary hover:bg-primaryDark px-6 py-2.5 rounded-xl transition-colors duration-200">
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        )}

        {!loading && !error && filteredAndSorted.length > 0 && (
          <>
            <p className="text-sm text-gray-400 mb-4">
              Showing {filteredAndSorted.length} {filteredAndSorted.length === 1 ? 'appointment' : 'appointments'}
              {hasActiveFilters ? ' matching your criteria' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSorted.map((doctor, index) => (
                <DoctorCard key={doctor._id || doctor.email || index} doctor={doctor} onViewDetails={handleViewDetails} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
