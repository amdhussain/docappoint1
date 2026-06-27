import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5000/api/doctors';

const mockDoctors = [
  { _id: 'doc1', name: 'Dr. Arjun Sharma', specialty: 'General Physician', qualifications: 'MBBS, MD', experience: 15, about: 'Experienced general physician with expertise in internal medicine and preventive healthcare.', languages: ['Hindi', 'English'], clinicName: 'Arjun Clinic', clinicAddress: '123 Linking Road, Bandra West', city: 'Mumbai', consultationFee: 500, videoFee: 300, rating: 4.5, reviewsCount: 3200, availableToday: true, gender: 'Male', isVerified: true, image: null, services: ['In-Clinic Visit', 'Prescription Refill', 'Health Checkup'] },
  { _id: 'doc2', name: 'Dr. Priya Patel', specialty: 'Dentist', qualifications: 'BDS, MDS', experience: 8, about: 'Specialist in cosmetic dentistry and root canal treatments.', languages: ['Hindi', 'English', 'Gujarati'], clinicName: 'Priya Dental Care', clinicAddress: '456 Connaught Place', city: 'Delhi', consultationFee: 400, videoFee: 250, rating: 4.7, reviewsCount: 1800, availableToday: true, gender: 'Female', isVerified: true, image: null, services: ['In-Clinic Visit', 'Video Consultation', 'Dental Checkup'] },
  { _id: 'doc3', name: 'Dr. Vikram Singh', specialty: 'Dermatologist', qualifications: 'MBBS, DVD', experience: 10, about: 'Skin care specialist focusing on acne, eczema, and laser treatments.', languages: ['Hindi', 'English'], clinicName: 'Vikram Skin Clinic', clinicAddress: '789 MG Road, Indiranagar', city: 'Bangalore', consultationFee: 600, videoFee: 350, rating: 4.3, reviewsCount: 1500, availableToday: false, gender: 'Male', isVerified: true, image: null, services: ['Video Consultation', 'In-Clinic Visit', 'Skin Treatment'] },
  { _id: 'doc4', name: 'Dr. Ananya Gupta', specialty: 'Cardiologist', qualifications: 'MBBS, MD, DM', experience: 12, about: 'Heart specialist with advanced training in interventional cardiology.', languages: ['Hindi', 'English', 'Marathi'], clinicName: 'Ananya Heart Centre', clinicAddress: '234 Marine Drive', city: 'Mumbai', consultationFee: 800, videoFee: 500, rating: 4.9, reviewsCount: 5000, availableToday: true, gender: 'Female', isVerified: true, image: null, services: ['Video Consultation', 'In-Clinic Visit', 'ECG', 'Stress Test'] },
  { _id: 'doc5', name: 'Dr. Rohit Verma', specialty: 'Neurologist', qualifications: 'MBBS, MD, DM', experience: 14, about: 'Expert in neurology specializing in migraine, epilepsy, and stroke management.', languages: ['Hindi', 'English'], clinicName: 'Rohit Neurology Clinic', clinicAddress: '567 Lajpat Nagar', city: 'Delhi', consultationFee: 900, videoFee: 600, rating: 4.6, reviewsCount: 2800, availableToday: false, gender: 'Male', isVerified: true, image: null, services: ['Video Consultation', 'In-Clinic Visit', 'EEG'] },
  { _id: 'doc6', name: 'Dr. Sneha Reddy', specialty: 'Pediatrician', qualifications: 'MBBS, MD', experience: 9, about: 'Caring pediatrician dedicated to children health and developmental care.', languages: ['Telugu', 'Hindi', 'English'], clinicName: 'Sneha Kids Clinic', clinicAddress: '890 Banjara Hills', city: 'Hyderabad', consultationFee: 450, videoFee: 280, rating: 4.8, reviewsCount: 2100, availableToday: true, gender: 'Female', isVerified: true, image: null, services: ['In-Clinic Visit', 'Video Consultation', 'Vaccination'] },
  { _id: 'doc7', name: 'Dr. Arjun Nair', specialty: 'Orthopedic', qualifications: 'MBBS, MS', experience: 11, about: 'Orthopedic surgeon specializing in joint replacements and sports injuries.', languages: ['Malayalam', 'Hindi', 'English'], clinicName: 'Arjun Ortho Care', clinicAddress: '321 Koramangala', city: 'Bangalore', consultationFee: 700, videoFee: 400, rating: 4.4, reviewsCount: 1900, availableToday: true, gender: 'Male', isVerified: true, image: null, services: ['In-Clinic Visit', 'Video Consultation', 'Physiotherapy'] },
  { _id: 'doc8', name: 'Dr. Meera Joshi', specialty: 'Gynecologist', qualifications: 'MBBS, MD', experience: 13, about: 'Experienced gynecologist providing compassionate care for women.', languages: ['Hindi', 'English', 'Marathi'], clinicName: 'Meera Women Health', clinicAddress: '654 FC Road, Shivajinagar', city: 'Pune', consultationFee: 650, videoFee: 380, rating: 4.7, reviewsCount: 3600, availableToday: true, gender: 'Female', isVerified: true, image: null, services: ['In-Clinic Visit', 'Video Consultation'] },
  { _id: 'doc9', name: 'Dr. Karan Mehta', specialty: 'Psychiatrist', qualifications: 'MBBS, MD', experience: 7, about: 'Mental health professional offering therapy and medication management.', languages: ['Hindi', 'English', 'Tamil'], clinicName: 'Karan Mental Wellness', clinicAddress: '987 T Nagar', city: 'Chennai', consultationFee: 550, videoFee: 350, rating: 4.2, reviewsCount: 800, availableToday: false, gender: 'Male', isVerified: true, image: null, services: ['Video Consultation', 'In-Clinic Visit', 'Therapy Session'] },
  { _id: 'doc10', name: 'Dr. Divya Kapoor', specialty: 'Ophthalmologist', qualifications: 'MBBS, MS', experience: 10, about: 'Eye specialist offering comprehensive vision care and laser surgeries.', languages: ['Hindi', 'English', 'Bengali'], clinicName: 'Divya Eye Centre', clinicAddress: '147 Salt Lake Sector V', city: 'Kolkata', consultationFee: 500, videoFee: 300, rating: 4.5, reviewsCount: 1400, availableToday: true, gender: 'Female', isVerified: true, image: null, services: ['In-Clinic Visit', 'Video Consultation', 'Eye Checkup'] },
  { _id: 'doc11', name: 'Dr. Rahul Deshmukh', specialty: 'General Physician', qualifications: 'MBBS', experience: 5, about: 'Young and dedicated physician providing primary healthcare.', languages: ['Hindi', 'English', 'Marathi'], clinicName: 'Rahul Health Clinic', clinicAddress: '258 JM Road', city: 'Pune', consultationFee: 350, videoFee: 200, rating: 3.8, reviewsCount: 450, availableToday: true, gender: 'Male', isVerified: true, image: null, services: ['In-Clinic Visit', 'Prescription Refill'] },
  { _id: 'doc12', name: 'Dr. Neha Agarwal', specialty: 'Dermatologist', qualifications: 'MBBS, DVD', experience: 6, about: 'Skin and hair specialist with modern aesthetic treatment approaches.', languages: ['Hindi', 'English', 'Gujarati'], clinicName: 'Neha Skin & Hair Clinic', clinicAddress: '369 CG Road', city: 'Ahmedabad', consultationFee: 550, videoFee: 320, rating: 4.1, reviewsCount: 1100, availableToday: false, gender: 'Female', isVerified: true, image: null, services: ['Video Consultation', 'In-Clinic Visit'] },
];

export async function GET(request, { params }) {
  try {
    const id = params.id;
    const url = `${BACKEND_URL}/${id}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        if (res.status === 404) {
          const mock = mockDoctors.find((d) => d._id === id);
          if (mock) return NextResponse.json(mock);
          return NextResponse.json({ message: 'Doctor not found' }, { status: 404 });
        }
        throw new Error(`Backend responded with ${res.status}`);
      }

      const data = await res.json();
      return NextResponse.json(data);
    } catch (fetchError) {
      clearTimeout(timeoutId);

      const mock = mockDoctors.find((d) => d._id === id);
      if (mock) return NextResponse.json(mock);
      return NextResponse.json({ message: 'Doctor not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
