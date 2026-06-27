'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { HiOutlineSearch, HiLocationMarker } from 'react-icons/hi';
import { FiChevronDown, FiFilter } from 'react-icons/fi';
import { ImSpinner2 } from 'react-icons/im';
import { FaStar, FaCheckCircle } from 'react-icons/fa';

const specialities = [
  'All', 'General Physician', 'Dentist', 'Dermatologist', 'Cardiologist',
  'Orthopedic', 'Pediatrician', 'Gynecologist', 'Neurologist', 'Ophthalmologist',
];

const locations = ['All', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'];

const availabilities = ['All', 'Available Today'];

const sortOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Fee: Low to High', value: 'fee_asc' },
  { label: 'Fee: High to Low', value: 'fee_desc' },
  { label: 'Rating', value: 'rating' },
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

function FilterPill({ options, value, onChange, label }) {
  const getValue = (opt) => (typeof opt === 'object' ? opt.value : opt);
  const getLabel = (opt) => (typeof opt === 'object' ? opt.label : opt);
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-full px-5 py-2.5 pr-9 cursor-pointer hover:border-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
      >
        {options.map((opt) => (
          <option key={getValue(opt)} value={getValue(opt)}>{getLabel(opt)}</option>
        ))}
      </select>
      <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
    </div>
  );
}

function DoctorCard({ doctor }) {
  const hasImage = doctor.image && doctor.image !== '';
  const initials = getInitials(doctor.name);
  const colorClass = getInitialsColor(doctor.name);

  const formatFee = (fee) => {
    if (!fee && fee !== 0) return 'N/A';
    return `₹${Number(fee).toLocaleString('en-IN')}`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating || 0);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar key={i} className={i < full ? 'text-yellow-400' : 'text-gray-200'} size={12} />
      );
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-5 flex flex-col sm:flex-row gap-5">
        <div className="flex-shrink-0">
          {hasImage ? (
            <img src={doctor.image} alt={doctor.name} className="w-20 h-20 rounded-2xl object-cover border border-gray-100" />
          ) : (
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white text-xl font-bold ${colorClass}`}>
              {initials}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-lg font-bold text-slateDark truncate">{doctor.name || 'Doctor'}</h3>
            {doctor.isVerified && (
              <FaCheckCircle className="text-primary shrink-0" size={16} />
            )}
            {doctor.availableToday && (
              <span className="text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
                Available Today
              </span>
            )}
          </div>
          <p className="text-sm text-primary font-medium mb-1.5">
            {doctor.specialty || 'General'}
          </p>
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
            <div className="flex items-center gap-1">
              {renderStars(doctor.rating)}
              <span className="text-xs text-gray-400 ml-1">({doctor.reviewsCount || 0})</span>
            </div>
            {doctor.experience && (
              <span className="text-gray-400">{doctor.experience} yrs exp.</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <HiLocationMarker className="text-gray-400 shrink-0" size={15} />
            <span className="text-gray-500 truncate">
              {doctor.clinicName || doctor.clinic || 'Healthcare Center'}{doctor.city ? `, ${doctor.city}` : ''}
            </span>
          </div>
        </div>
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-2 flex-shrink-0 sm:border-l sm:border-gray-100 sm:pl-5">
          <div className="text-right">
            <p className="text-xl font-bold text-slateDark">{formatFee(doctor.consultationFee || doctor.fee)}</p>
            <p className="text-xs text-gray-400">Consultation Fee</p>
          </div>
          <Link
            href={doctor._id ? `/book-appointment?id=${doctor._id}` : `/book-appointment?id=${encodeURIComponent(doctor.name)}`}
            className="bg-primary text-white text-sm font-semibold py-2.5 px-6 rounded-xl hover:bg-primaryDark transition-colors duration-200 text-center whitespace-nowrap"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpeciality, setFilterSpeciality] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterAvailability, setFilterAvailability] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    document.title = 'Find Doctors - DocAppoint';
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
      result = result.filter(
        (d) => (d.name || '').toLowerCase().includes(term) ||
          (d.specialty || '').toLowerCase().includes(term) ||
          (d.city || d.location || '').toLowerCase().includes(term)
      );
    }
    if (filterSpeciality !== 'All') {
      result = result.filter((d) => (d.specialty || '').toLowerCase() === filterSpeciality.toLowerCase());
    }
    if (filterLocation !== 'All') {
      result = result.filter((d) => (d.city || d.location || '').toLowerCase() === filterLocation.toLowerCase());
    }
    if (filterAvailability !== 'All') {
      result = result.filter((d) => d.availableToday === true);
    }
    if (sortBy === 'fee_asc') {
      result.sort((a, b) => (Number(a.consultationFee || a.fee) || 0) - (Number(b.consultationFee || b.fee) || 0));
    } else if (sortBy === 'fee_desc') {
      result.sort((a, b) => (Number(b.consultationFee || b.fee) || 0) - (Number(a.consultationFee || a.fee) || 0));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
    }
    return result;
  }, [doctors, searchTerm, filterSpeciality, filterLocation, filterAvailability, sortBy]);

  const handleResetFilters = () => {
    setFilterSpeciality('All');
    setFilterLocation('All');
    setFilterAvailability('All');
    setSortBy('default');
    setSearchTerm('');
  };

  const hasActiveFilters = filterSpeciality !== 'All' || filterLocation !== 'All' ||
    filterAvailability !== 'All' || sortBy !== 'default' || searchTerm.trim() !== '';

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
          <h1 className="text-3xl sm:text-4xl font-bold text-slateDark">Find & Book Top Doctors</h1>
          <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            Browse through our list of verified doctors and book an appointment instantly
          </p>
        </div>

        <div className="relative mb-6">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search doctors by name, specialty, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm transition-all duration-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium mr-1">
            <FiFilter size={16} />
            <span>All Filters</span>
          </div>
          <FilterPill options={['All', ...specialities.slice(1)]} value={filterSpeciality} onChange={setFilterSpeciality} label="Speciality" />
          <FilterPill options={locations} value={filterLocation} onChange={setFilterLocation} label="Location" />
          <FilterPill options={availabilities} value={filterAvailability} onChange={setFilterAvailability} label="Availability" />
          <FilterPill options={sortOptions} value={sortBy} onChange={setSortBy} label="Fee Range" />
          {hasActiveFilters && (
            <button onClick={handleResetFilters} className="text-xs text-gray-500 hover:text-red-500 underline underline-offset-2 transition-colors duration-200 ml-1">
              Clear all
            </button>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <ImSpinner2 className="animate-spin text-primary" size={36} />
            <p className="mt-4 text-sm text-gray-400">Loading doctors...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
              <p className="text-red-600 font-medium">Failed to load doctors</p>
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
                <HiOutlineSearch className="text-gray-400" size={28} />
              </div>
              <p className="text-gray-700 font-semibold text-lg">No doctors found</p>
              <p className="text-sm text-gray-400 mt-1">No doctors found matching your criteria. Try adjusting your filters.</p>
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
              Showing {filteredAndSorted.length} {filteredAndSorted.length === 1 ? 'doctor' : 'doctors'}
              {hasActiveFilters ? ' matching your filters' : ''}
            </p>
            <div className="space-y-4">
              {filteredAndSorted.map((doctor, index) => (
                <DoctorCard key={doctor._id || doctor.email || index} doctor={doctor} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
