// 'use client';

// import { useState, useEffect, useRef, Suspense } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { useAuth } from '@/components/AuthProvider';
// import { FiCheck, FiChevronLeft, FiChevronRight, FiCalendar, FiClock, FiUser, FiClipboard } from 'react-icons/fi';
// import { FaVideo, FaClinicMedical } from 'react-icons/fa';

// const STEP_ICONS = [FiCalendar, FiClock, FiUser, FiClipboard];
// const STEP_LABELS = ['Select Date', 'Choose Time', 'Your Details', 'Confirm'];

// const TIME_SLOTS = [
//   '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
//   '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
//   '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
//   '4:00 PM', '4:30 PM', '5:00 PM',
// ];

// function BookAppointmentContent() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const { user } = useAuth();

//   const [currentStep, setCurrentStep] = useState(1);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [patientName, setPatientName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [notes, setNotes] = useState('');
//   const [consultationType, setConsultationType] = useState('in-clinic');
//   const [doctorId, setDoctorId] = useState('');
//   const [doctorName, setDoctorName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const dateListRef = useRef(null);

//   useEffect(() => {
//     document.title = 'Book Appointment - DocAppoint';
//   }, []);

//   useEffect(() => {
//     const id = searchParams.get('id');
//     const name = searchParams.get('doctorName');
//     if (id) setDoctorId(id);
//     if (name) setDoctorName(name);
//   }, [searchParams]);

//   useEffect(() => {
//     if (user?.email) setEmail(user.email);
//     if (user?.name) setPatientName(user.name);
//   }, [user]);

//   const today = new Date();
//   const dates = Array.from({ length: 7 }, (_, i) => {
//     const d = new Date(today);
//     d.setDate(today.getDate() + i);
//     return d;
//   });

//   const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//   const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//   const formatDateParam = (date) => {
//     const y = date.getFullYear();
//     const m = String(date.getMonth() + 1).padStart(2, '0');
//     const d = String(date.getDate()).padStart(2, '0');
//     return `${y}-${m}-${d}`;
//   };

//   const getSlotCount = (index) => {
//     if (index === 0) return 8;
//     if (index === 1) return 12;
//     return Math.floor(Math.random() * 11) + 5;
//   };

//   const validateStep = (step) => {
//     const newErrors = {};
//     if (step === 1 && !selectedDate) newErrors.date = 'Please select a date';
//     if (step === 2 && !selectedTime) newErrors.time = 'Please select a time slot';
//     if (step === 3) {
//       if (!patientName.trim()) newErrors.patientName = 'Patient name is required';
//       if (!email.trim()) newErrors.email = 'Email is required';
//       else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Please enter a valid email';
//       if (!phone.trim()) newErrors.phone = 'Phone number is required';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleContinue = () => {
//     if (!validateStep(currentStep)) return;
//     setCurrentStep((prev) => Math.min(prev + 1, 4));
//   };

//   const handleBack = () => {
//     setCurrentStep((prev) => Math.max(prev - 1, 1));
//     setErrors({});
//   };

//   const handleSubmit = async () => {
//     if (!validateStep(3)) { setCurrentStep(3); return; }
//     if (!selectedDate || !selectedTime) { toast.error('Please complete all steps'); return; }
//     setLoading(true);
//     try {
//       const payload = {
//         doctorId, doctorName, patientName, patientEmail: email,
//         patientPhone: phone, appointmentDate: formatDateParam(selectedDate),
//         appointmentTime: selectedTime, consultationType, notes,
//       };
//       await axios.post('/api/appointments', payload);
//       toast.success('Appointment booked successfully!');
//       router.push('/dashboard');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to book appointment. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const scrollDates = (direction) => {
//     if (dateListRef.current) {
//       dateListRef.current.scrollBy({ left: direction === 'left' ? -120 : 120, behavior: 'smooth' });
//     }
//   };

//   const isDateDisabled = (date) => {
//     const d = new Date(date); d.setHours(0, 0, 0, 0);
//     const todayStart = new Date(today); todayStart.setHours(0, 0, 0, 0);
//     return d < todayStart;
//   };

//   const isSameDate = (d1, d2) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

//   const renderStepper = () => (
//     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
//       <div className="flex items-center justify-between">
//         {STEP_LABELS.map((label, index) => {
//           const stepNum = index + 1;
//           const Icon = STEP_ICONS[index];
//           const isActive = currentStep === stepNum;
//           const isCompleted = currentStep > stepNum;
//           return (
//             <div key={label} className="flex items-center flex-1">
//               <div className="flex flex-col items-center">
//                 <div
//                   className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
//                     isCompleted
//                       ? 'bg-primary text-white'
//                       : isActive
//                       ? 'bg-primary text-white shadow-md'
//                       : 'bg-gray-100 text-gray-400'
//                   }`}
//                 >
//                   {isCompleted ? <FiCheck className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
//                 </div>
//                 <span className={`text-[11px] mt-1.5 font-medium whitespace-nowrap ${
//                   currentStep >= stepNum ? 'text-primary' : 'text-gray-400'
//                 }`}>
//                   {label}
//                 </span>
//               </div>
//               {index < STEP_LABELS.length - 1 && (
//                 <div className={`flex-1 h-0.5 mx-3 mt-[-1.5rem] ${
//                   currentStep > stepNum ? 'bg-primary' : 'bg-gray-200'
//                 }`} />
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );

//   const renderConsultationType = () => (
//     <div className="grid grid-cols-2 gap-4 mb-6">
//       <button
//         type="button"
//         onClick={() => setConsultationType('in-clinic')}
//         className={`flex items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 ${
//           consultationType === 'in-clinic'
//             ? 'border-primary bg-primary/5 shadow-sm'
//             : 'border-gray-200 bg-white hover:border-gray-300'
//         }`}
//       >
//         <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
//           consultationType === 'in-clinic' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
//         }`}>
//           <FaClinicMedical size={20} />
//         </div>
//         <div className="text-left">
//           <p className="font-semibold text-slateDark text-sm">In-Clinic Visit</p>
//           <p className="text-xs text-gray-500 mt-0.5">Visit doctor at clinic</p>
//         </div>
//       </button>
//       <button
//         type="button"
//         onClick={() => setConsultationType('video')}
//         className={`flex items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 ${
//           consultationType === 'video'
//             ? 'border-primary bg-primary/5 shadow-sm'
//             : 'border-gray-200 bg-white hover:border-gray-300'
//         }`}
//       >
//         <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
//           consultationType === 'video' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
//         }`}>
//           <FaVideo size={20} />
//         </div>
//         <div className="text-left">
//           <p className="font-semibold text-slateDark text-sm">Video Consultation</p>
//           <p className="text-xs text-gray-500 mt-0.5">Consult from home</p>
//         </div>
//       </button>
//     </div>
//   );

//   const renderDateSlider = () => (
//     <div className="relative mb-2">
//       <button
//         type="button"
//         onClick={() => scrollDates('left')}
//         className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
//       >
//         <FiChevronLeft className="w-5 h-5" />
//       </button>
//       <button
//         type="button"
//         onClick={() => scrollDates('right')}
//         className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
//       >
//         <FiChevronRight className="w-5 h-5" />
//       </button>
//       <div
//         ref={dateListRef}
//         className="flex gap-3 overflow-x-auto py-2 px-8 scroll-smooth"
//         style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//       >
//         {dates.map((date, index) => {
//           const isSelected = selectedDate && isSameDate(date, selectedDate);
//           const disabled = isDateDisabled(date);
//           return (
//             <button
//               key={index}
//               type="button"
//               disabled={disabled}
//               onClick={() => { setSelectedDate(date); setErrors((prev) => ({ ...prev, date: undefined })); }}
//               className={`flex-shrink-0 w-24 py-4 rounded-2xl text-center transition-all duration-200 ${
//                 isSelected
//                   ? 'bg-primary text-white shadow-md'
//                   : disabled
//                   ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
//                   : 'bg-white border border-gray-200 text-slateDark hover:border-primary hover:bg-primary/5'
//               }`}
//             >
//               <div className="text-xs font-medium opacity-80">{dayNames[date.getDay()]}</div>
//               <div className={`text-xl font-bold my-0.5 ${isSelected ? 'text-white' : disabled ? 'text-gray-300' : ''}`}>
//                 {date.getDate()}
//               </div>
//               <div className="text-[11px] opacity-80">{monthNames[date.getMonth()]}</div>
//               <div className={`text-[10px] mt-1 font-medium ${
//                 isSelected ? 'text-white/80' : 'text-primary'
//               }`}>
//                 {getSlotCount(index)} slots
//               </div>
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-secondary to-white py-8 px-4">
//       <div className="max-w-2xl mx-auto">
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center gap-2 bg-teal-50 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//               <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
//             </svg>
//             Appointment
//           </div>
//           <h1 className="text-3xl font-bold text-slateDark">Book Your Appointment</h1>
//           <p className="text-gray-500 text-sm mt-1">Fill in your details to schedule a visit</p>
//         </div>

//         {renderStepper()}

//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
//           {/* STEP 1: Select Date & Consultation Type */}
//           {currentStep === 1 && (
//             <div>
//               <h2 className="text-xl font-semibold text-slateDark mb-1">Select Date & Consultation Type</h2>
//               <p className="text-gray-500 text-sm mb-6">Choose your preferred date and consultation type</p>
//               {renderConsultationType()}
//               {renderDateSlider()}
//               {errors.date && <p className="text-red-500 text-sm mt-1 mb-4">{errors.date}</p>}
//               <button
//                 type="button"
//                 onClick={handleContinue}
//                 className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-base hover:bg-primaryDark transition-all duration-200 mt-4"
//               >
//                 Continue
//               </button>
//             </div>
//           )}

//           {/* STEP 2: Choose Time */}
//           {currentStep === 2 && (
//             <div>
//               <div className="flex items-center mb-6">
//                 <button type="button" onClick={handleBack} className="mr-3 text-gray-500 hover:text-primary transition-colors">
//                   <FiChevronLeft className="w-6 h-6" />
//                 </button>
//                 <div>
//                   <h2 className="text-xl font-semibold text-slateDark">Choose Time</h2>
//                   <p className="text-gray-500 text-sm">
//                     {selectedDate ? `${dayNames[selectedDate.getDay()]}, ${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}` : 'Select a time slot'}
//                   </p>
//                 </div>
//               </div>
//               <div className="grid grid-cols-3 gap-3 mb-6">
//                 {TIME_SLOTS.map((slot) => (
//                   <button
//                     key={slot}
//                     type="button"
//                     onClick={() => { setSelectedTime(slot); setErrors((prev) => ({ ...prev, time: undefined })); }}
//                     className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 ${
//                       selectedTime === slot
//                         ? 'bg-primary text-white shadow-md'
//                         : 'bg-white text-slateDark border border-gray-200 hover:border-primary hover:bg-primary/5'
//                     }`}
//                   >
//                     {slot}
//                   </button>
//                 ))}
//               </div>
//               {errors.time && <p className="text-red-500 text-sm mb-4">{errors.time}</p>}
//               <button
//                 type="button"
//                 onClick={handleContinue}
//                 className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-base hover:bg-primaryDark transition-all duration-200"
//               >
//                 Continue
//               </button>
//             </div>
//           )}

//           {/* STEP 3: Your Details */}
//           {currentStep === 3 && (
//             <div>
//               <div className="flex items-center mb-6">
//                 <button type="button" onClick={handleBack} className="mr-3 text-gray-500 hover:text-primary transition-colors">
//                   <FiChevronLeft className="w-6 h-6" />
//                 </button>
//                 <div>
//                   <h2 className="text-xl font-semibold text-slateDark">Your Details</h2>
//                   <p className="text-gray-500 text-sm">Please provide your contact information</p>
//                 </div>
//               </div>
//               <div className="space-y-4 mb-6">
//                 <div>
//                   <label className="block text-sm font-medium text-slateDark mb-1">Patient Name <span className="text-red-500">*</span></label>
//                   <input type="text" value={patientName} onChange={(e) => { setPatientName(e.target.value); setErrors((prev) => ({ ...prev, patientName: undefined })); }}
//                     placeholder="Enter your full name"
//                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" />
//                   {errors.patientName && <p className="text-red-500 text-sm mt-1">{errors.patientName}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-slateDark mb-1">Email <span className="text-red-500">*</span></label>
//                   <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
//                     placeholder="Enter your email"
//                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" />
//                   {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-slateDark mb-1">Phone <span className="text-red-500">*</span></label>
//                   <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setErrors((prev) => ({ ...prev, phone: undefined })); }}
//                     placeholder="Enter your phone number"
//                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" />
//                   {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-slateDark mb-1">Notes <span className="text-gray-400">(optional)</span></label>
//                   <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
//                     placeholder="Any additional notes for the doctor..."
//                     rows={3}
//                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none" />
//                 </div>
//               </div>
//               <button type="button" onClick={handleContinue}
//                 className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-base hover:bg-primaryDark transition-all duration-200">
//                 Continue
//               </button>
//             </div>
//           )}

//           {/* STEP 4: Confirm & Book */}
//           {currentStep === 4 && (
//             <div>
//               <div className="flex items-center mb-6">
//                 <button type="button" onClick={handleBack} className="mr-3 text-gray-500 hover:text-primary transition-colors">
//                   <FiChevronLeft className="w-6 h-6" />
//                 </button>
//                 <div>
//                   <h2 className="text-xl font-semibold text-slateDark">Confirm & Book</h2>
//                   <p className="text-gray-500 text-sm">Review your appointment details</p>
//                 </div>
//               </div>
//               <div className="bg-secondary rounded-2xl p-5 mb-6 space-y-3">
//                 <div className="flex justify-between items-center pb-3 border-b border-gray-200">
//                   <span className="text-sm font-medium text-gray-500">Consultation</span>
//                   <span className="text-sm font-semibold text-slateDark">
//                     {consultationType === 'in-clinic' ? 'In-Clinic Visit' : 'Video Consultation'}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center pb-3 border-b border-gray-200">
//                   <span className="text-sm font-medium text-gray-500">Date</span>
//                   <span className="text-sm font-semibold text-slateDark">
//                     {selectedDate ? `${dayNames[selectedDate.getDay()]}, ${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}` : 'N/A'}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center pb-3 border-b border-gray-200">
//                   <span className="text-sm font-medium text-gray-500">Time</span>
//                   <span className="text-sm font-semibold text-slateDark">{selectedTime || 'N/A'}</span>
//                 </div>
//                 <div className="flex justify-between items-center pb-3 border-b border-gray-200">
//                   <span className="text-sm font-medium text-gray-500">Patient</span>
//                   <span className="text-sm font-semibold text-slateDark">{patientName || 'N/A'}</span>
//                 </div>
//                 <div className="flex justify-between items-center pb-3 border-b border-gray-200">
//                   <span className="text-sm font-medium text-gray-500">Email</span>
//                   <span className="text-sm font-semibold text-slateDark">{email || 'N/A'}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm font-medium text-gray-500">Phone</span>
//                   <span className="text-sm font-semibold text-slateDark">{phone || 'N/A'}</span>
//                 </div>
//               </div>
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-base hover:bg-primaryDark transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
//               >
//                 {loading ? (
//                   <span className="flex items-center gap-2">
//                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                     </svg>
//                     Booking...
//                   </span>
//                 ) : (
//                   'Confirm & Book Appointment'
//                 )}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function BookAppointmentPage() {
//   return (
//     <Suspense fallback={
//       <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
//         <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
//       </div>
//     }>
//       <BookAppointmentContent />
//     </Suspense>
//   );
// }






// 'use client';

// import { useState, useEffect, useRef, Suspense } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { useAuth } from '@/components/AuthProvider';
// import { FiCheck, FiChevronLeft, FiChevronRight, FiCalendar, FiClock, FiUser, FiClipboard } from 'react-icons/fi';
// import { FaVideo, FaClinicMedical } from 'react-icons/fa';

// const STEP_ICONS = [FiCalendar, FiClock, FiUser, FiClipboard];
// const STEP_LABELS = ['Select Date', 'Choose Time', 'Your Details', 'Confirm'];

// const TIME_SLOTS = [
//   '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
//   '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
//   '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
//   '4:00 PM', '4:30 PM', '5:00 PM',
// ];

// function BookAppointmentContent() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const { user } = useAuth();

//   const [currentStep, setCurrentStep] = useState(1);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [patientName, setPatientName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [notes, setNotes] = useState('');
//   const [consultationType, setConsultationType] = useState('in-clinic');
//   const [doctorId, setDoctorId] = useState('');
//   const [doctorName, setDoctorName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const dateListRef = useRef(null);

//   useEffect(() => {
//     document.title = 'Book Appointment - DocAppoint';
//   }, []);

//   useEffect(() => {
//     const id = searchParams.get('id');
//     const name = searchParams.get('doctorName');
//     if (id) setDoctorId(id);
//     if (name) setDoctorName(name);
//   }, [searchParams]);

//   useEffect(() => {
//     if (user?.email) setEmail(user.email);
//     if (user?.name) setPatientName(user.name);
//   }, [user]);

//   const today = new Date();
//   const dates = Array.from({ length: 7 }, (_, i) => {
//     const d = new Date(today);
//     d.setDate(today.getDate() + i);
//     return d;
//   });

//   const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//   const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//   const formatDateParam = (date) => {
//     const y = date.getFullYear();
//     const m = String(date.getMonth() + 1).padStart(2, '0');
//     const d = String(date.getDate()).padStart(2, '0');
//     return `${y}-${m}-${d}`;
//   };

//   const getSlotCount = (index) => {
//     if (index === 0) return 8;
//     if (index === 1) return 12;
//     return Math.floor(Math.random() * 11) + 5;
//   };

//   const validateStep = (step) => {
//     const newErrors = {};
//     if (step === 1 && !selectedDate) newErrors.date = 'Please select a date';
//     if (step === 2 && !selectedTime) newErrors.time = 'Please select a time slot';
//     if (step === 3) {
//       if (!patientName.trim()) newErrors.patientName = 'Patient name is required';
//       if (!email.trim()) newErrors.email = 'Email is required';
//       else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Please enter a valid email';
//       if (!phone.trim()) newErrors.phone = 'Phone number is required';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleContinue = () => {
//     if (!validateStep(currentStep)) return;
//     setCurrentStep((prev) => Math.min(prev + 1, 4));
//   };

//   const handleBack = () => {
//     setCurrentStep((prev) => Math.max(prev - 1, 1));
//     setErrors({});
//   };

//   const handleSubmit = async () => {
//     if (!validateStep(3)) { setCurrentStep(3); return; }
//     if (!selectedDate || !selectedTime) { toast.error('Please complete all steps'); return; }
//     setLoading(true);
//     try {
//       const payload = {
//         doctorId, doctorName, patientName, patientEmail: email,
//         patientPhone: phone, appointmentDate: formatDateParam(selectedDate),
//         appointmentTime: selectedTime, consultationType, notes,
//       };

//       const token = localStorage.getItem('token');
      
//       await axios.post('/api/appointments', payload, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       toast.success('Appointment booked successfully!');
//       router.push('/dashboard');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to book appointment. Please login again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const scrollDates = (direction) => {
//     if (dateListRef.current) {
//       dateListRef.current.scrollBy({ left: direction === 'left' ? -120 : 120, behavior: 'smooth' });
//     }
//   };

//   const isDateDisabled = (date) => {
//     const d = new Date(date); d.setHours(0, 0, 0, 0);
//     const todayStart = new Date(today); todayStart.setHours(0, 0, 0, 0);
//     return d < todayStart;
//   };

//   const isSameDate = (d1, d2) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

//   // (রেসপন্স বড় হওয়ার কারণে আমি রেন্ডার ফাংশনগুলো এখানে সংক্ষেপে দিচ্ছি, তুমি আগের কোড থেকে এগুলো ঠিকঠাক রাখবে)
//   // [বাকি UI কোড আগের মতোই থাকবে]
  
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-secondary to-white py-8 px-4">
//       <div className="max-w-2xl mx-auto">
//         {/* তোমার আগের UI কোড এখানে বসাও */}
//         <button type="button" onClick={handleSubmit} disabled={loading} className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-base">
//           {loading ? 'Booking...' : 'Confirm & Book Appointment'}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default function BookAppointmentPage() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <BookAppointmentContent />
//     </Suspense>
//   );
// }





// 'use client';

// import { useState, useEffect, useRef, Suspense } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { useAuth } from '@/components/AuthProvider';
// import { FiCheck, FiChevronLeft, FiChevronRight, FiCalendar, FiClock, FiUser, FiClipboard } from 'react-icons/fi';
// import { FaVideo, FaClinicMedical } from 'react-icons/fa';

// const STEP_ICONS = [FiCalendar, FiClock, FiUser, FiClipboard];
// const STEP_LABELS = ['Select Date', 'Choose Time', 'Your Details', 'Confirm'];

// const TIME_SLOTS = [
//   '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
//   '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
//   '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
//   '4:00 PM', '4:30 PM', '5:00 PM',
// ];

// function BookAppointmentContent() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const { user } = useAuth();

//   const [currentStep, setCurrentStep] = useState(1);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [patientName, setPatientName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [notes, setNotes] = useState('');
//   const [consultationType, setConsultationType] = useState('in-clinic');
//   const [doctorId, setDoctorId] = useState('');
//   const [doctorName, setDoctorName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const dateListRef = useRef(null);

//   useEffect(() => {
//     const id = searchParams.get('id');
//     const name = searchParams.get('doctorName');
//     if (id) setDoctorId(id);
//     if (name) setDoctorName(name);
//   }, [searchParams]);

//   useEffect(() => {
//     if (user?.email) setEmail(user.email);
//     if (user?.name) setPatientName(user.name);
//   }, [user]);

//   const today = new Date();
//   const dates = Array.from({ length: 7 }, (_, i) => {
//     const d = new Date(today);
//     d.setDate(today.getDate() + i);
//     return d;
//   });

//   const formatDateParam = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

//   const validateStep = (step) => {
//     const newErrors = {};
//     if (step === 1 && !selectedDate) newErrors.date = 'Please select a date';
//     if (step === 2 && !selectedTime) newErrors.time = 'Please select a time slot';
//     if (step === 3) {
//       if (!patientName.trim()) newErrors.patientName = 'Name required';
//       if (!email.trim()) newErrors.email = 'Email required';
//       if (!phone.trim()) newErrors.phone = 'Phone required';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const payload = { doctorId, doctorName, patientName, patientEmail: email, patientPhone: phone, appointmentDate: formatDateParam(selectedDate), appointmentTime: selectedTime, consultationType, notes };
//       const token = localStorage.getItem('token');
      
//       await axios.post('/api/appointments', payload, {
//         headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
//       });
      
//       toast.success('Booked successfully!');
//       router.push('/dashboard');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to book.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
//         <h1 className="text-2xl font-bold mb-6">Book Appointment</h1>
        
//         {currentStep === 1 && (
//           <div>
//             <h2 className="mb-4">Select Date</h2>
//             <div className="flex gap-2 overflow-x-auto mb-4">
//               {dates.map((d, i) => (
//                 <button key={i} onClick={() => setSelectedDate(d)} className={`p-4 border rounded ${selectedDate === d ? 'bg-primary text-white' : ''}`}>
//                   {d.getDate()}
//                 </button>
//               ))}
//             </div>
//             <button onClick={() => validateStep(1) && setCurrentStep(2)} className="bg-primary text-white px-6 py-2 rounded">Continue</button>
//           </div>
//         )}

//         {currentStep === 2 && (
//           <div>
//             <h2 className="mb-4">Select Time</h2>
//             <div className="grid grid-cols-4 gap-2 mb-4">
//               {TIME_SLOTS.map(t => (
//                 <button key={t} onClick={() => setSelectedTime(t)} className={`p-2 border rounded ${selectedTime === t ? 'bg-primary text-white' : ''}`}>{t}</button>
//               ))}
//             </div>
//             <button onClick={() => validateStep(2) && setCurrentStep(3)} className="bg-primary text-white px-6 py-2 rounded">Continue</button>
//           </div>
//         )}

//         {currentStep === 3 && (
//           <div>
//             <input className="w-full border p-2 mb-2" placeholder="Name" value={patientName} onChange={e => setPatientName(e.target.value)} />
//             <input className="w-full border p-2 mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
//             <input className="w-full border p-2 mb-4" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
//             <button onClick={() => validateStep(3) && setCurrentStep(4)} className="bg-primary text-white px-6 py-2 rounded">Continue</button>
//           </div>
//         )}

//         {currentStep === 4 && (
//           <button onClick={handleSubmit} disabled={loading} className="w-full bg-green-600 text-white py-3 rounded">
//             {loading ? 'Processing...' : 'Confirm & Book Appointment'}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function Page() {
//   return <Suspense fallback={<div>Loading...</div>}><BookAppointmentContent /></Suspense>;
// }




// 'use client';

// import { useState, useEffect, Suspense } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { useAuth } from '@/components/AuthProvider';

// function BookAppointmentContent() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const { user } = useAuth();

//   const [currentStep, setCurrentStep] = useState(1);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [patientName, setPatientName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [loading, setLoading] = useState(false);

//   const [doctorId, setDoctorId] = useState('');
//   const [doctorName, setDoctorName] = useState('');

//   useEffect(() => {
//     setDoctorId(searchParams.get('id') || '');
//     setDoctorName(searchParams.get('doctorName') || '');
//     if (user) {
//       setPatientName(user.name || '');
//       setEmail(user.email || '');
//     }
//   }, [searchParams, user]);

//   const formatDateParam = (date) => date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : '';

//   const handleSubmit = async () => {
//     setLoading(true);
//     const payload = { 
//       doctorId, 
//       doctorName, 
//       patientName, 
//       patientEmail: email, 
//       patientPhone: phone, 
//       appointmentDate: formatDateParam(selectedDate), 
//       appointmentTime: selectedTime, 
//       consultationType: 'in-clinic', 
//       notes: '' 
//     };

//     console.log("Sending payload:", payload); // এটি কনসোলে দেখো

//     const token = localStorage.getItem('token');
    
//     try {
//       await axios.post('/api/appointments', payload, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json' 
//         }
//       });
//       toast.success('Booked successfully!');
//       router.push('/dashboard');
//     } catch (err) {
//       console.error("Error Response:", err.response?.data);
//       toast.error(err.response?.data?.message || 'Failed to book. Check console.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
//         <h1 className="text-2xl font-bold mb-6">Book Appointment with {doctorName}</h1>
        
//         {currentStep === 1 && (
//           <div>
//             <h2 className="mb-4 font-semibold">Select Date</h2>
//             <div className="flex gap-2 overflow-x-auto mb-4">
//               {Array.from({ length: 7 }).map((_, i) => {
//                 const d = new Date(); d.setDate(d.getDate() + i);
//                 return (
//                   <button key={i} onClick={() => setSelectedDate(d)} className={`p-4 border rounded ${selectedDate?.toDateString() === d.toDateString() ? 'bg-blue-600 text-white' : ''}`}>
//                     {d.getDate()}
//                   </button>
//                 );
//               })}
//             </div>
//             <button onClick={() => selectedDate ? setCurrentStep(2) : toast.error("Select date")} className="bg-blue-600 text-white px-6 py-2 rounded">Continue</button>
//           </div>
//         )}

//         {currentStep === 2 && (
//           <div>
//             <h2 className="mb-4 font-semibold">Select Time</h2>
//             <div className="grid grid-cols-4 gap-2 mb-4">
//               {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'].map(t => (
//                 <button key={t} onClick={() => setSelectedTime(t)} className={`p-2 border rounded ${selectedTime === t ? 'bg-blue-600 text-white' : ''}`}>{t}</button>
//               ))}
//             </div>
//             <div className="flex gap-2">
//                 <button onClick={() => setCurrentStep(1)} className="bg-gray-400 text-white px-6 py-2 rounded">Back</button>
//                 <button onClick={() => selectedTime ? setCurrentStep(3) : toast.error("Select time")} className="bg-blue-600 text-white px-6 py-2 rounded">Continue</button>
//             </div>
//           </div>
//         )}

//         {currentStep === 3 && (
//           <div>
//             <input className="w-full border p-2 mb-2" placeholder="Name" value={patientName} onChange={e => setPatientName(e.target.value)} />
//             <input className="w-full border p-2 mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
//             <input className="w-full border p-2 mb-4" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
//             <div className="flex gap-2">
//                 <button onClick={() => setCurrentStep(2)} className="bg-gray-400 text-white px-6 py-2 rounded">Back</button>
//                 <button onClick={handleSubmit} disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded">{loading ? 'Processing...' : 'Confirm & Book'}</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function Page() {
//   return <Suspense fallback={<div>Loading...</div>}><BookAppointmentContent /></Suspense>;
// }




// 'use client';

// import { useState, useEffect, Suspense } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { useAuth } from '@/components/AuthProvider';

// function BookAppointmentContent() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const { user } = useAuth();

//   const [currentStep, setCurrentStep] = useState(1);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [patientName, setPatientName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [loading, setLoading] = useState(false);

//   // ডক্টরের তথ্য ধরে রাখার জন্য
//   const [doctorId, setDoctorId] = useState('');
//   const [doctorName, setDoctorName] = useState('');

//   useEffect(() => {
//     // URL থেকে আইডি এবং নাম নিচ্ছি
//     const id = searchParams.get('id');
//     const name = searchParams.get('doctorName');
    
//     setDoctorId(id || '');
//     setDoctorName(name || '');

//     if (user) {
//       setPatientName(user.name || '');
//       setEmail(user.email || '');
//     }
//   }, [searchParams, user]);

//   const formatDateParam = (date) => {
//     if (!date) return '';
//     return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
//   };

//   const handleSubmit = async () => {
//     // ফাইনাল চেক
//     if (!doctorName || !selectedDate || !selectedTime || !patientName) {
//       toast.error("Please fill all details!");
//       return;
//     }

//     setLoading(true);
//     const payload = { 
//       doctorId, 
//       doctorName, 
//       patientName, 
//       patientEmail: email, 
//       patientPhone: phone, 
//       appointmentDate: formatDateParam(selectedDate), 
//       appointmentTime: selectedTime, 
//       consultationType: 'in-clinic', 
//       notes: '' 
//     };

//     const token = localStorage.getItem('token');
    
//     try {
//       await axios.post('/api/appointments', payload, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json' 
//         }
//       });
//       toast.success('Appointment booked successfully!');
//       router.push('/dashboard');
//     } catch (err) {
//       console.error("Error:", err.response?.data);
//       toast.error(err.response?.data?.message || 'Failed to book.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
//         <h1 className="text-2xl font-bold mb-6">Book Appointment with {doctorName || "Doctor"}</h1>
        
//         {currentStep === 1 && (
//           <div>
//             <h2 className="mb-4 font-semibold">1. Select Date</h2>
//             <div className="flex gap-2 overflow-x-auto mb-4 pb-2">
//               {Array.from({ length: 7 }).map((_, i) => {
//                 const d = new Date(); d.setDate(d.getDate() + i);
//                 return (
//                   <button key={i} onClick={() => setSelectedDate(d)} className={`p-4 border rounded min-w-[60px] ${selectedDate?.toDateString() === d.toDateString() ? 'bg-blue-600 text-white' : ''}`}>
//                     {d.getDate()}
//                   </button>
//                 );
//               })}
//             </div>
//             <button onClick={() => selectedDate ? setCurrentStep(2) : toast.error("Select a date")} className="bg-blue-600 text-white px-6 py-2 rounded">Continue</button>
//           </div>
//         )}

//         {currentStep === 2 && (
//           <div>
//             <h2 className="mb-4 font-semibold">2. Select Time</h2>
//             <div className="grid grid-cols-3 gap-2 mb-4">
//               {['9:00 AM', '10:30 AM', '12:00 PM', '2:30 PM', '4:00 PM'].map(t => (
//                 <button key={t} onClick={() => setSelectedTime(t)} className={`p-2 border rounded ${selectedTime === t ? 'bg-blue-600 text-white' : ''}`}>{t}</button>
//               ))}
//             </div>
//             <div className="flex gap-2">
//                 <button onClick={() => setCurrentStep(1)} className="bg-gray-400 text-white px-6 py-2 rounded">Back</button>
//                 <button onClick={() => selectedTime ? setCurrentStep(3) : toast.error("Select a time")} className="bg-blue-600 text-white px-6 py-2 rounded">Continue</button>
//             </div>
//           </div>
//         )}

//         {currentStep === 3 && (
//           <div>
//             <h2 className="mb-4 font-semibold">3. Confirm Details</h2>
//             <input className="w-full border p-2 mb-2 rounded" placeholder="Name" value={patientName} onChange={e => setPatientName(e.target.value)} />
//             <input className="w-full border p-2 mb-2 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
//             <input className="w-full border p-2 mb-4 rounded" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
//             <div className="flex gap-2">
//                 <button onClick={() => setCurrentStep(2)} className="bg-gray-400 text-white px-6 py-2 rounded">Back</button>
//                 <button onClick={handleSubmit} disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded">{loading ? 'Processing...' : 'Confirm & Book'}</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function Page() {
//   return <Suspense fallback={<div>Loading...</div>}><BookAppointmentContent /></Suspense>;
// }





// 'use client';

// import { useState, useEffect, Suspense } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { useAuth } from '@/components/AuthProvider';

// function BookAppointmentContent() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const { user } = useAuth();

//   const [currentStep, setCurrentStep] = useState(1);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [patientName, setPatientName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [loading, setLoading] = useState(false);

//   // স্টেটগুলোতে সরাসরি ভ্যালু সেট করার জন্য রিফ
//   const [doctorInfo, setDoctorInfo] = useState({ id: '', name: '' });

//   useEffect(() => {
//     // URL প্যারামিটার থেকে সরাসরি ডেটা রিড করছি
//     const id = searchParams.get('id');
//     const name = searchParams.get('doctorName');
    
//     if (id || name) {
//       setDoctorInfo({ id: id || '', name: name || '' });
//     }

//     if (user) {
//       setPatientName(user.name || '');
//       setEmail(user.email || '');
//     }
//   }, [searchParams, user]);

//   const formatDateParam = (date) => {
//     if (!date) return '';
//     return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
//   };

//   const handleSubmit = async () => {
//     // এখানে আমরা সরাসরি doctorInfo স্টেট থেকে ডেটা নিচ্ছি
//     const payload = { 
//       doctorId: doctorInfo.id, 
//       doctorName: doctorInfo.name, 
//       patientName, 
//       patientEmail: email, 
//       patientPhone: phone, 
//       appointmentDate: formatDateParam(selectedDate), 
//       appointmentTime: selectedTime, 
//       consultationType: 'in-clinic', 
//       notes: '' 
//     };

//     console.log("Payload being sent:", payload); // কনসোলে দেখো এখন সব ডাটা আসছে কি না

//     if (!payload.doctorName || !payload.appointmentDate || !payload.appointmentTime) {
//       toast.error("Please ensure all fields are selected!");
//       return;
//     }

//     setLoading(true);
//     const token = localStorage.getItem('token');
    
//     try {
//       await axios.post('/api/appointments', payload, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json' 
//         }
//       });
//       toast.success('Appointment booked successfully!');
//       router.push('/dashboard');
//     } catch (err) {
//       console.error("Backend Error:", err.response?.data);
//       toast.error(err.response?.data?.message || 'Failed to book.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
//         <h1 className="text-2xl font-bold mb-6">Book Appointment with {doctorInfo.name || "Doctor"}</h1>
        
//         {currentStep === 1 && (
//           <div>
//             <h2 className="mb-4 font-semibold">1. Select Date</h2>
//             <div className="flex gap-2 overflow-x-auto mb-4 pb-2">
//               {Array.from({ length: 7 }).map((_, i) => {
//                 const d = new Date(); d.setDate(d.getDate() + i);
//                 return (
//                   <button key={i} onClick={() => setSelectedDate(d)} className={`p-4 border rounded min-w-[60px] ${selectedDate?.toDateString() === d.toDateString() ? 'bg-blue-600 text-white' : ''}`}>
//                     {d.getDate()}
//                   </button>
//                 );
//               })}
//             </div>
//             <button onClick={() => selectedDate ? setCurrentStep(2) : toast.error("Select a date")} className="bg-blue-600 text-white px-6 py-2 rounded">Continue</button>
//           </div>
//         )}

//         {currentStep === 2 && (
//           <div>
//             <h2 className="mb-4 font-semibold">2. Select Time</h2>
//             <div className="grid grid-cols-3 gap-2 mb-4">
//               {['9:00 AM', '10:30 AM', '12:00 PM', '2:30 PM', '4:00 PM'].map(t => (
//                 <button key={t} onClick={() => setSelectedTime(t)} className={`p-2 border rounded ${selectedTime === t ? 'bg-blue-600 text-white' : ''}`}>{t}</button>
//               ))}
//             </div>
//             <div className="flex gap-2">
//                 <button onClick={() => setCurrentStep(1)} className="bg-gray-400 text-white px-6 py-2 rounded">Back</button>
//                 <button onClick={() => selectedTime ? setCurrentStep(3) : toast.error("Select a time")} className="bg-blue-600 text-white px-6 py-2 rounded">Continue</button>
//             </div>
//           </div>
//         )}

//         {currentStep === 3 && (
//           <div>
//             <h2 className="mb-4 font-semibold">3. Confirm Details</h2>
//             <input className="w-full border p-2 mb-2 rounded" placeholder="Name" value={patientName} onChange={e => setPatientName(e.target.value)} />
//             <input className="w-full border p-2 mb-2 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
//             <input className="w-full border p-2 mb-4 rounded" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
//             <div className="flex gap-2">
//                 <button onClick={() => setCurrentStep(2)} className="bg-gray-400 text-white px-6 py-2 rounded">Back</button>
//                 <button onClick={handleSubmit} disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded">{loading ? 'Processing...' : 'Confirm & Book'}</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function Page() {
//   return <Suspense fallback={<div>Loading...</div>}><BookAppointmentContent /></Suspense>;
// }






'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@/components/AuthProvider';

function BookAppointmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState({ id: '', name: '' });

  useEffect(() => {
    const id = searchParams.get('id');
    const nameFromUrl = searchParams.get('doctorName');
    
    if (id) {
      if (nameFromUrl) {
        setDoctorInfo({ id, name: nameFromUrl });
      } else {
        // যদি URL এ নাম না থাকে, তবে API থেকে নাম খুঁজে নেবে
        axios.get(`/api/doctors/${id}`)
          .then(res => setDoctorInfo({ id, name: res.data.name || 'Doctor' }))
          .catch(() => setDoctorInfo({ id, name: 'Doctor' }));
      }
    }

    if (user) {
      setPatientName(user.name || '');
      setEmail(user.email || '');
    }
  }, [searchParams, user]);

  const formatDateParam = (date) => {
    if (!date) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    const payload = { 
      doctorId: doctorInfo.id, 
      doctorName: doctorInfo.name, 
      patientName, 
      patientEmail: email, 
      patientPhone: phone, 
      appointmentDate: formatDateParam(selectedDate), 
      appointmentTime: selectedTime, 
      consultationType: 'in-clinic', 
      notes: '' 
    };

    console.log("Payload being sent:", payload);

    if (!payload.doctorName || !payload.appointmentDate || !payload.appointmentTime) {
      toast.error("Please fill all details!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/appointments', payload, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
      });
      toast.success('Appointment booked successfully!');
      router.push('/dashboard');
    } catch (err) {
      console.error("Error Response:", err.response?.data);
      toast.error(err.response?.data?.message || 'Failed to book.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6">Book Appointment with {doctorInfo.name || "Loading..."}</h1>
        
        {currentStep === 1 && (
          <div>
            <h2 className="mb-4 font-semibold">1. Select Date</h2>
            <div className="flex gap-2 overflow-x-auto mb-4 pb-2">
              {Array.from({ length: 7 }).map((_, i) => {
                const d = new Date(); d.setDate(d.getDate() + i);
                return (
                  <button key={i} onClick={() => setSelectedDate(d)} className={`p-4 border rounded min-w-[60px] ${selectedDate?.toDateString() === d.toDateString() ? 'bg-blue-600 text-white' : ''}`}>
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
            <button onClick={() => selectedDate ? setCurrentStep(2) : toast.error("Select a date")} className="bg-blue-600 text-white px-6 py-2 rounded">Continue</button>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="mb-4 font-semibold">2. Select Time</h2>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['9:00 AM', '10:30 AM', '12:00 PM', '2:30 PM', '4:00 PM'].map(t => (
                <button key={t} onClick={() => setSelectedTime(t)} className={`p-2 border rounded ${selectedTime === t ? 'bg-blue-600 text-white' : ''}`}>{t}</button>
              ))}
            </div>
            <button onClick={() => selectedTime ? setCurrentStep(3) : toast.error("Select a time")} className="bg-blue-600 text-white px-6 py-2 rounded">Continue</button>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="mb-4 font-semibold">3. Confirm Details</h2>
            <input className="w-full border p-2 mb-2 rounded" value={patientName} onChange={e => setPatientName(e.target.value)} />
            <input className="w-full border p-2 mb-2 rounded" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="w-full border p-2 mb-4 rounded" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
            <button onClick={handleSubmit} disabled={loading} className="w-full bg-green-600 text-white py-3 rounded">
              {loading ? 'Processing...' : 'Confirm & Book'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div>Loading...</div>}><BookAppointmentContent /></Suspense>;
}