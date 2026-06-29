 
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