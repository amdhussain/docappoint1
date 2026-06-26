'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useAuth } from './AuthProvider';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/appointments', label: 'All Appointment' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href) => pathname === href;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#007A87" />
              <path d="M16 8V24M8 16H24" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span className="text-xl font-bold text-primary">DocAppoint</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold tracking-wide transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-200">
                  {user.image ? (
                    <img src={user.image} alt="" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <FaUserCircle className="text-primary" size={22} />
                  )}
                  <span className="text-sm font-semibold text-slateDark max-w-[100px] truncate">
                    {user.name || user.email || 'User'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors duration-200"
                >
                  <FaSignOutAlt size={14} />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-primaryDark transition-all duration-200 shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-gray-600 hover:text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX size={24} /> : <HiOutlineMenuAlt3 size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block text-sm font-semibold py-2 ${
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-gray-100" />
            {user ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaUserCircle size={20} className="text-primary" />
                  <span className="font-semibold text-slateDark">{user.name || user.email || 'User'}</span>
                </div>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 w-full"
                >
                  <FaSignOutAlt size={14} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-semibold text-gray-600 hover:text-primary py-2"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primaryDark transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
