'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FaUserMd,
  FaVideo,
  FaCalendarCheck,
  FaFlask,
  FaHeartbeat,
  FaPills,
  FaNotesMedical,
  FaCheckCircle,
  FaArrowRight,
  FaStethoscope,
  FaTooth,
  FaAllergies,
  FaHeart,
  FaBrain,
  FaBaby,
  FaBone,
  FaEye,
  FaStar,
  FaShieldAlt,
  FaAmbulance,
  FaPhoneAlt,
} from 'react-icons/fa';
import { HiOutlineChat } from 'react-icons/hi';

const services = [
  {
    icon: FaCalendarCheck,
    title: 'In-Clinic Appointment',
    desc: 'Book appointments with top doctors near you and visit their clinic.',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: FaVideo,
    title: 'Online Video Consultation',
    desc: 'Consult with specialist doctors from the comfort of your home.',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    icon: FaFlask,
    title: 'Lab Test Booking',
    desc: 'Book diagnostic tests and get samples collected from home.',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    icon: FaHeartbeat,
    title: 'Health Check Packages',
    desc: 'Comprehensive health check packages tailored to your needs.',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: FaPills,
    title: 'Medicine Reminders',
    desc: 'Never miss a dose with smart medicine reminders and alerts.',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
  },
  {
    icon: FaNotesMedical,
    title: 'Digital Health Records',
    desc: 'Access your medical history, reports and prescriptions anytime.',
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
  },
];

const specialties = [
  { icon: FaStethoscope, name: 'General Physician', doctors: '8,500+', bg: 'bg-blue-100', iconBg: 'bg-blue-50', color: 'text-blue-600', desc: 'Primary care for all ages' },
  { icon: FaTooth, name: 'Dentist', doctors: '5,000+', bg: 'bg-green-100', iconBg: 'bg-green-50', color: 'text-green-600', desc: 'Oral health & hygiene' },
  { icon: FaAllergies, name: 'Dermatologist', doctors: '3,200+', bg: 'bg-purple-100', iconBg: 'bg-purple-50', color: 'text-purple-600', desc: 'Skin, hair & nail care' },
  { icon: FaHeart, name: 'Cardiologist', doctors: '2,800+', bg: 'bg-orange-100', iconBg: 'bg-orange-50', color: 'text-orange-600', desc: 'Heart & vascular health' },
  { icon: FaBrain, name: 'Neurologist', doctors: '1,900+', bg: 'bg-pink-100', iconBg: 'bg-pink-50', color: 'text-pink-600', desc: 'Brain & nervous system' },
  { icon: FaBaby, name: 'Pediatrician', doctors: '4,100+', bg: 'bg-teal-100', iconBg: 'bg-teal-50', color: 'text-teal-600', desc: 'Child health & development' },
  { icon: FaBone, name: 'Orthopedic', doctors: '2,400+', bg: 'bg-red-100', iconBg: 'bg-red-50', color: 'text-red-600', desc: 'Bone, joint & muscle care' },
  { icon: FaEye, name: 'Ophthalmologist', doctors: '2,200+', bg: 'bg-cyan-100', iconBg: 'bg-cyan-50', color: 'text-cyan-600', desc: 'Eye care & vision' },
];

export default function Home() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'DocAppoint - Book Appointments with Top Doctors';
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.type === 'tel' ? 'phone' : e.target.name || e.target.type]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to send message');
      setFormData({ name: '', email: '', phone: '', message: '' });
      alert('Message sent successfully!');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-white">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-[calc(100vh-64px)] min-h-[600px] overflow-hidden bg-slateDark">
        <img
          src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2070&auto=format&fit=crop"
          alt="Modern hospital building"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        <div className="relative z-10 w-full h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/10">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                Trusted by 50,000+ Patients
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-5">
                Find & Book <br />
                <span className="text-teal-300">Top Doctors</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-200/90 mb-8 max-w-lg leading-relaxed">
                India's most trusted healthcare platform. Connect with verified doctors, book instant appointments, and manage your health journey — all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/appointments"
                  className="inline-flex items-center gap-2.5 bg-primary text-white px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-primaryDark transition-all duration-200 shadow-lg shadow-primary/30"
                >
                  <FaCalendarCheck size={16} />
                  Book Appointment
                </Link>
                <Link
                  href="/doctors"
                  className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md text-white border border-white/20 px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/20 transition-all duration-200"
                >
                  <FaUserMd size={16} />
                  Find a Doctor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== OUR HEALTHCARE SERVICES ===== */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            Our Services
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slateDark mb-2">
            Our Healthcare Services
          </h2>
          <p className="text-gray-500 text-lg">
            Comprehensive healthcare solutions at your fingertips
          </p>
        </div>

        {/* Featured Banner - Split Grid */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 lg:p-10">
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Most Popular
              </span>
              <h3 className="text-2xl lg:text-3xl font-bold text-slateDark mb-4">
                Video Consultation with <br /> Top Doctor
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-500 flex-shrink-0 text-sm" />
                  <span>Consult with top specialists</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-500 flex-shrink-0 text-sm" />
                  <span>No waiting in queues</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-500 flex-shrink-0 text-sm" />
                  <span>Digital prescriptions</span>
                </li>
              </ul>
              <Link
                href="/appointments"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:bg-primaryDark transition-all duration-200 shadow-sm"
              >
                Start Video Consult
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
            <div className="relative min-h-[300px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop"
                alt="Doctor video consultation"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-lg">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold text-slateDark">Live — 45+ doctors online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Service Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer group"
              >
                <div className={`w-14 h-14 rounded-xl ${service.iconBg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200`}>
                  <Icon className={`${service.iconColor} text-xl`} />
                </div>
                <h3 className="text-lg font-semibold text-slateDark mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== BROWSE BY SPECIALITY ===== */}
      <section className="bg-[#F8FAFC] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-teal-50 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Browse
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slateDark mb-2">
              Browse by Speciality
            </h2>
            <p className="text-gray-500 text-lg">
              Find the right specialist for your health concerns
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mb-10">
            {specialties.map((spec, index) => {
              const Icon = spec.icon;
              return (
                <Link
                  key={index}
                  href={`/doctors?specialty=${spec.name}`}
                  className="group bg-white rounded-2xl p-6 text-center hover:shadow-md transition-all duration-200 border border-gray-100"
                >
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl ${spec.iconBg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200`}
                  >
                    <Icon className={`${spec.color} text-2xl`} />
                  </div>
                  <h3 className="font-semibold text-slateDark text-sm mb-1.5">
                    {spec.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-2">{spec.desc}</p>
                  <p className="text-xs text-primary font-medium">{spec.doctors} doctors</p>
                </Link>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3 rounded-full font-semibold text-sm hover:bg-primary hover:text-white transition-all duration-200"
            >
              View All Specialities
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== ABOUT / STATS + OUR MISSION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          <div className="bg-white rounded-2xl border border-gray-100 p-7 text-center hover:shadow-lg transition-all duration-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
              <FaUserMd className="text-blue-600 text-xl" />
            </div>
            <p className="text-3xl md:text-4xl font-bold text-slateDark mb-1.5">50,000+</p>
            <p className="text-gray-500 text-sm font-medium">Verified Doctors</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-7 text-center hover:shadow-lg transition-all duration-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
              <FaCalendarCheck className="text-blue-600 text-xl" />
            </div>
            <p className="text-3xl md:text-4xl font-bold text-slateDark mb-1.5">10 Lakh+</p>
            <p className="text-gray-500 text-sm font-medium">Appointments Booked</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-7 text-center hover:shadow-lg transition-all duration-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-green-50 flex items-center justify-center mb-4">
              <FaHeart className="text-green-600 text-xl" />
            </div>
            <p className="text-3xl md:text-4xl font-bold text-slateDark mb-1.5">5+ Years</p>
            <p className="text-gray-500 text-sm font-medium">of Trust</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-7 text-center hover:shadow-lg transition-all duration-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-green-50 flex items-center justify-center mb-4">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <p className="text-3xl md:text-4xl font-bold text-slateDark mb-1.5">99%</p>
            <p className="text-gray-500 text-sm font-medium">Satisfaction</p>
          </div>
        </div>

        {/* Our Mission Split Layout */}
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1581056771392-8a90ddb76831?q=80&w=2070&auto=format&fit=crop"
                alt="Professional medical team"
                className="w-full h-[420px] object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 bg-primary text-white rounded-2xl px-6 py-4 shadow-lg hidden md:flex flex-col items-center">
              <p className="text-3xl font-bold">12+</p>
              <p className="text-xs text-teal-100 font-medium">Years Experience</p>
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-50 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <FaHeart className="text-primary" size={14} />
              About Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slateDark mb-4">
              Our Mission is to Make <br />
              <span className="text-primary">Healthcare Accessible</span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-7">
              At DocAppoint, we believe that quality healthcare should be accessible to everyone. 
              Our platform connects patients with the best doctors, making it easy to book appointments, 
              consult online, and manage health records — all from a single dashboard.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FaCheckCircle className="text-blue-600 text-sm" />
                </div>
                <span className="text-gray-600 text-sm leading-relaxed">Verified doctors with authentic credentials</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FaCheckCircle className="text-blue-600 text-sm" />
                </div>
                <span className="text-gray-600 text-sm leading-relaxed">Secure digital health records management</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FaCheckCircle className="text-blue-600 text-sm" />
                </div>
                <span className="text-gray-600 text-sm leading-relaxed">24/7 customer support for all your queries</span>
              </li>
            </ul>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-2xl font-semibold text-sm hover:bg-primaryDark transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Learn More About Us
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </section>

      ===== CONTACT US =====
      <section id="contact" className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-teal-50 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Contact
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slateDark mb-2">Contact Us</h2>
            <p className="text-gray-500 text-lg">We'd love to hear from you. Get in touch with us.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            <div className="bg-[#F8FAFC] rounded-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-semibold text-slateDark mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} className="w-full px-5 py-3.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm" required />
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full px-5 py-3.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm" required />
                <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full px-5 py-3.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm" required />
                <textarea name="message" rows={4} placeholder="Your Message" value={formData.message} onChange={handleChange} className="w-full px-5 py-3.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm resize-none" required />
                <button type="submit" disabled={submitting} className="w-full bg-primary text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-primaryDark transition-all duration-200 disabled:opacity-50">{submitting ? 'Sending...' : 'Send Message'}</button>
              </form>
            </div>

            <div className="space-y-4">
              <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#007A87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </div>
                <div>
                  <p className="font-semibold text-slateDark">Call Us</p>
                  <p className="text-gray-500 text-sm">+1800-123-4567</p>
                </div>
              </div>
              <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <HiOutlineChat className="text-primary" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-slateDark">Live Chat</p>
                  <p className="text-gray-500 text-sm">Chat with our support team</p>
                </div>
              </div>
              <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#007A87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </div>
                <div>
                  <p className="font-semibold text-slateDark">Email Us</p>
                  <p className="text-gray-500 text-sm">support@docappoint.com</p>
                </div>
              </div>
              <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#007A87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                </div>
                <div>
                  <p className="font-semibold text-slateDark">Head Office</p>
                  <p className="text-gray-500 text-sm">123 Healthcare Ave, Medical District, NY 10001</p>
                </div>
              </div>
              <div className="bg-[#F8FAFC] rounded-2xl p-6 border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FaAmbulance className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slateDark">Partner with Us</p>
                    <p className="text-gray-500 text-sm">Join our network of healthcare professionals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}











 