'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { FaGoogle, FaGithub } from 'react-icons/fa';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Sign Up - DocAppoint';
  }, []);
  const [formData, setFormData] = useState({
    name: '', email: '', photo: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    if (!formData.password) {
      errs.password = 'Password is required';
    } else {
      if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
      else if (!/[A-Z]/.test(formData.password)) errs.password = 'Password must contain at least 1 uppercase letter';
      else if (!/[a-z]/.test(formData.password)) errs.password = 'Password must contain at least 1 lowercase letter';
    }
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        photo: formData.photo.trim() || 'https://i.ibb.co/Vv6N664/default-avatar.png',
      };
      await axios.post('/api/auth?action=register', payload);
      toast.success('Account created successfully! Please log in.');
      router.push('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-white flex items-center justify-center p-4 pt-24">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4 shadow-sm">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8V24M8 16H24" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slateDark">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join DocAppoint today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="John Doe" required />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="your@email.com" required />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
            <input type="text" value={formData.photo} onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="https://example.com/photo.jpg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="••••••••" required />
            {errors.password ? (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            ) : (
              <p className="text-gray-400 text-xs mt-1">Password must contain at least 1 uppercase letter, 1 lowercase letter, and minimum 6 characters</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="••••••••" required />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primaryDark transition-colors disabled:opacity-50 shadow-sm">
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-4 text-gray-400 font-medium">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          >
            <FaGoogle className="text-red-500" size={16} />
            Google
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          >
            <FaGithub size={16} />
            GitHub
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}
