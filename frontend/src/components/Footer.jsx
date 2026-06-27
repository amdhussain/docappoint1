'use client';

import Link from 'next/link';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaApple,
  FaGooglePlay,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaHeart } from 'react-icons/fa';

const footerSections = [
  {
    title: 'For Patients',
    links: [
      { label: 'Search Doctors', href: '/doctors' },
      { label: 'Book Appointment', href: '/book-appointment' },
      { label: 'Health Records', href: '/dashboard' },
      { label: 'Lab Tests', href: '/lab-tests' },
    ],
  },
  {
    title: 'Specialities',
    links: [
      { label: 'General Physician', href: '/doctors?speciality=general' },
      { label: 'Dentist', href: '/doctors?speciality=dentist' },
      { label: 'Dermatology', href: '/doctors?speciality=dermatology' },
      { label: 'Cardiology', href: '/doctors?speciality=cardiology' },
    ],
  },
  {
    title: 'Top Cities',
    links: [
      { label: 'Delhi', href: '/doctors?city=delhi' },
      { label: 'Mumbai', href: '/doctors?city=mumbai' },
      { label: 'Bangalore', href: '/doctors?city=bangalore' },
      { label: 'Hyderabad', href: '/doctors?city=hyderabad' },
    ],
  },
  {
    title: 'Help & Support',
    links: [
      { label: 'FAQ', href: '/#faq' },
      { label: 'Contact Us', href: '/#contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slateDark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-primary flex items-center justify-center">
                <FaHeart className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-white">MediCare</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your trusted partner in healthcare. Book appointments with top doctors, manage health records, and take control of your wellness journey.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#"
                className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              >
                <FaApple size={18} />
                <div className="text-left">
                  <div className="text-[10px] text-gray-400">Download on</div>
                  <div className="text-xs font-semibold -mt-0.5">App Store</div>
                </div>
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              >
                <FaGooglePlay size={16} />
                <div className="text-left">
                  <div className="text-[10px] text-gray-400">Get it on</div>
                  <div className="text-xs font-semibold -mt-0.5">Google Play</div>
                </div>
              </Link>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="border-gray-700/50 my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-400 text-sm order-2 md:order-1">
            &copy; {new Date().getFullYear()} MediCare. All rights reserved.
          </p>
          <div className="flex items-center gap-3 order-1 md:order-2">
            <Link
              href="#"
              className="w-9 h-9 bg-gray-700 hover:bg-primary rounded-full flex items-center justify-center transition-all duration-200"
              aria-label="Facebook"
            >
              <FaFacebookF size={15} />
            </Link>
            <Link
              href="#"
              className="w-9 h-9 bg-gray-700 hover:bg-primary rounded-full flex items-center justify-center transition-all duration-200"
              aria-label="X (formerly Twitter)"
            >
              <FaXTwitter size={15} />
            </Link>
            <Link
              href="#"
              className="w-9 h-9 bg-gray-700 hover:bg-primary rounded-full flex items-center justify-center transition-all duration-200"
              aria-label="Instagram"
            >
              <FaInstagram size={15} />
            </Link>
            <Link
              href="#"
              className="w-9 h-9 bg-gray-700 hover:bg-primary rounded-full flex items-center justify-center transition-all duration-200"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn size={15} />
            </Link>
            <Link
              href="#"
              className="w-9 h-9 bg-gray-700 hover:bg-primary rounded-full flex items-center justify-center transition-all duration-200"
              aria-label="YouTube"
            >
              <FaYoutube size={15} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
