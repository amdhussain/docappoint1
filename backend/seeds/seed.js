const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || 'docappoint2';

const doctorsData = [
  {
    name: 'Dr. Arjun Sharma',
    specialty: 'General Physician',
    qualifications: 'MBBS, MD',
    experience: 15,
    about: 'Experienced general physician with expertise in internal medicine and preventive healthcare.',
    languages: 'Hindi, English',
    clinicName: 'Arjun Clinic',
    clinicAddress: '123 Linking Road, Bandra West',
    city: 'Mumbai',
    consultationFee: 500,
    videoFee: 300,
    rating: 4.5,
    reviewsCount: 3200,
    availableToday: true,
    gender: 'Male',
    isVerified: true,
  },
  {
    name: 'Dr. Priya Patel',
    specialty: 'Dentist',
    qualifications: 'BDS, MDS',
    experience: 8,
    about: 'Specialist in cosmetic dentistry and root canal treatments with gentle care.',
    languages: 'Hindi, English, Gujarati',
    clinicName: 'Priya Dental Care',
    clinicAddress: '456 Connaught Place',
    city: 'Delhi',
    consultationFee: 400,
    videoFee: 250,
    rating: 4.7,
    reviewsCount: 1800,
    availableToday: true,
    gender: 'Female',
    isVerified: true,
  },
  {
    name: 'Dr. Vikram Singh',
    specialty: 'Dermatologist',
    qualifications: 'MBBS, DVD',
    experience: 10,
    about: 'Skin care specialist focusing on acne, eczema, and laser treatments.',
    languages: 'Hindi, English',
    clinicName: 'Vikram Skin Clinic',
    clinicAddress: '789 MG Road, Indiranagar',
    city: 'Bangalore',
    consultationFee: 600,
    videoFee: 350,
    rating: 4.3,
    reviewsCount: 1500,
    availableToday: false,
    gender: 'Male',
    isVerified: true,
  },
  {
    name: 'Dr. Ananya Gupta',
    specialty: 'Cardiologist',
    qualifications: 'MBBS, MD, DM',
    experience: 12,
    about: 'Heart specialist with advanced training in interventional cardiology.',
    languages: 'Hindi, English, Marathi',
    clinicName: 'Ananya Heart Centre',
    clinicAddress: '234 Marine Drive',
    city: 'Mumbai',
    consultationFee: 800,
    videoFee: 500,
    rating: 4.9,
    reviewsCount: 5000,
    availableToday: true,
    gender: 'Female',
    isVerified: true,
  },
  {
    name: 'Dr. Rohit Verma',
    specialty: 'Neurologist',
    qualifications: 'MBBS, MD, DM',
    experience: 14,
    about: 'Expert in neurology specializing in migraine, epilepsy, and stroke management.',
    languages: 'Hindi, English',
    clinicName: 'Rohit Neurology Clinic',
    clinicAddress: '567 Lajpat Nagar',
    city: 'Delhi',
    consultationFee: 900,
    videoFee: 600,
    rating: 4.6,
    reviewsCount: 2800,
    availableToday: false,
    gender: 'Male',
    isVerified: true,
  },
  {
    name: 'Dr. Sneha Reddy',
    specialty: 'Pediatrician',
    qualifications: 'MBBS, MD',
    experience: 9,
    about: 'Caring pediatrician dedicated to children health and developmental care.',
    languages: 'Telugu, Hindi, English',
    clinicName: 'Sneha Kids Clinic',
    clinicAddress: '890 Banjara Hills',
    city: 'Hyderabad',
    consultationFee: 450,
    videoFee: 280,
    rating: 4.8,
    reviewsCount: 2100,
    availableToday: true,
    gender: 'Female',
    isVerified: true,
  },
  {
    name: 'Dr. Arjun Nair',
    specialty: 'Orthopedic',
    qualifications: 'MBBS, MS',
    experience: 11,
    about: 'Orthopedic surgeon specializing in joint replacements and sports injuries.',
    languages: 'Malayalam, Hindi, English',
    clinicName: 'Arjun Ortho Care',
    clinicAddress: '321 Koramangala',
    city: 'Bangalore',
    consultationFee: 700,
    videoFee: 400,
    rating: 4.4,
    reviewsCount: 1900,
    availableToday: true,
    gender: 'Male',
    isVerified: true,
  },
  {
    name: 'Dr. Meera Joshi',
    specialty: 'Gynecologist',
    qualifications: 'MBBS, MD',
    experience: 13,
    about: 'Experienced gynecologist providing compassionate care for women at all stages.',
    languages: 'Hindi, English, Marathi',
    clinicName: 'Meera Women Health',
    clinicAddress: '654 FC Road, Shivajinagar',
    city: 'Pune',
    consultationFee: 650,
    videoFee: 380,
    rating: 4.7,
    reviewsCount: 3600,
    availableToday: true,
    gender: 'Female',
    isVerified: true,
  },
  {
    name: 'Dr. Karan Mehta',
    specialty: 'Psychiatrist',
    qualifications: 'MBBS, MD',
    experience: 7,
    about: 'Mental health professional offering therapy and medication management.',
    languages: 'Hindi, English, Tamil',
    clinicName: 'Karan Mental Wellness',
    clinicAddress: '987 T Nagar',
    city: 'Chennai',
    consultationFee: 550,
    videoFee: 350,
    rating: 4.2,
    reviewsCount: 800,
    availableToday: false,
    gender: 'Male',
    isVerified: true,
  },
  {
    name: 'Dr. Divya Kapoor',
    specialty: 'Ophthalmologist',
    qualifications: 'MBBS, MS',
    experience: 10,
    about: 'Eye specialist offering comprehensive vision care and laser surgeries.',
    languages: 'Hindi, English, Bengali',
    clinicName: 'Divya Eye Centre',
    clinicAddress: '147 Salt Lake Sector V',
    city: 'Kolkata',
    consultationFee: 500,
    videoFee: 300,
    rating: 4.5,
    reviewsCount: 1400,
    availableToday: true,
    gender: 'Female',
    isVerified: true,
  },
  {
    name: 'Dr. Rahul Deshmukh',
    specialty: 'General Physician',
    qualifications: 'MBBS',
    experience: 5,
    about: 'Young and dedicated physician providing primary healthcare and wellness advice.',
    languages: 'Hindi, English, Marathi',
    clinicName: 'Rahul Health Clinic',
    clinicAddress: '258 JM Road',
    city: 'Pune',
    consultationFee: 350,
    videoFee: 200,
    rating: 3.8,
    reviewsCount: 450,
    availableToday: true,
    gender: 'Male',
    isVerified: true,
  },
  {
    name: 'Dr. Neha Agarwal',
    specialty: 'Dermatologist',
    qualifications: 'MBBS, DVD',
    experience: 6,
    about: 'Skin and hair specialist with modern aesthetic treatment approaches.',
    languages: 'Hindi, English, Gujarati',
    clinicName: 'Neha Skin & Hair Clinic',
    clinicAddress: '369 CG Road',
    city: 'Ahmedabad',
    consultationFee: 550,
    videoFee: 320,
    rating: 4.1,
    reviewsCount: 1100,
    availableToday: false,
    gender: 'Female',
    isVerified: true,
  },
];

const seedDB = async () => {
  let client;

  try {
    client = new MongoClient(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    await client.connect();
    const db = client.db(DB_NAME);
    console.log('MongoDB connected for seeding');

    await db.collection('users').deleteMany({});
    await db.collection('doctors').deleteMany({});
    await db.collection('appointments').deleteMany({});
    console.log('Collections cleared');

    const salt = await bcrypt.genSalt(10);

    const patientResult = await db.collection('users').insertOne({
      name: 'Test Patient',
      email: 'patient@test.com',
      password: await bcrypt.hash('Test123', salt),
      photo: '',
      role: 'patient',
      createdAt: new Date(),
    });
    const patientUserId = patientResult.insertedId;
    console.log('Test patient user created');

    const doctorResult = await db.collection('users').insertOne({
      name: 'Test Doctor',
      email: 'doctor@test.com',
      password: await bcrypt.hash('Test123', salt),
      photo: '',
      role: 'doctor',
      createdAt: new Date(),
    });
    console.log('Test doctor user created');

    const createdDoctors = await db.collection('doctors').insertMany(doctorsData);
    const doctorIds = Object.values(createdDoctors.insertedIds);
    console.log(`${doctorIds.length} doctors created`);

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    await db.collection('appointments').insertMany([
      {
        user: patientUserId,
        doctor: doctorIds[0],
        doctorName: doctorsData[0].name,
        patientName: 'Test Patient',
        patientEmail: 'patient@test.com',
        patientPhone: '9876543210',
        appointmentDate: tomorrow,
        appointmentTime: '10:00 AM',
        consultationType: 'in-clinic',
        status: 'scheduled',
        createdAt: new Date(),
      },
      {
        user: patientUserId,
        doctor: doctorIds[3],
        doctorName: doctorsData[3].name,
        patientName: 'Test Patient',
        patientEmail: 'patient@test.com',
        patientPhone: '9876543210',
        appointmentDate: nextWeek,
        appointmentTime: '2:30 PM',
        consultationType: 'video',
        status: 'scheduled',
        createdAt: new Date(),
      },
    ]);
    console.log('2 sample appointments created');

    console.log('Database seeded successfully');
    console.log('Patient email: patient@test.com, Password: Test123');
    console.log('Doctor email: doctor@test.com, Password: Test123');

    await client.close();
    console.log('MongoDB disconnected');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
