'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { HiOutlineMenuAlt3, HiCalendar, HiUser, HiLogout, HiMail } from 'react-icons/hi';

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E8F4F8]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#007A87]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navItems = [
    { href: '/dashboard', label: 'My Bookings', icon: HiCalendar },
    { href: '/dashboard/messages', label: 'Messages', icon: HiMail },
    { href: '/dashboard/profile', label: 'My Profile', icon: HiUser },
  ];

  const isActive = (href) => pathname === href;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#E8F4F8] flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-sm transform transition-transform duration-200 ease-in-out flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#007A87] flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-[#007A87] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-[#E8F4F8] hover:text-[#007A87]'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full"
          >
            <HiLogout size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="lg:hidden bg-white shadow-sm px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:text-[#007A87]"
            aria-label="Open sidebar"
          >
            <HiOutlineMenuAlt3 size={24} />
          </button>
          <span className="text-lg font-bold text-[#007A87]">DocAppoint</span>
          <div className="w-10" />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
