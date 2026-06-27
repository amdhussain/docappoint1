'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import axios from 'axios';
import toast from 'react-hot-toast';
import { HiPencil } from 'react-icons/hi';
import { FaTimes, FaSpinner, FaUserCircle } from 'react-icons/fa';

export default function MyProfile() {
  const { user, updateUser } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.title = 'My Profile - DocAppoint';
  }, []);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', photo: '' });

  const openModal = () => {
    setFormData({
      name: user?.name || '',
      photo: user?.photo || '',
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      updateUser(res.data.user || res.data);
      toast.success('Profile updated successfully!');
      setShowModal(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update profile'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slateDark mb-6">My Profile</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 max-w-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          {user?.photo ? (
            <img
              src={user.photo}
              alt={user.name || 'Profile'}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-50 shadow-sm"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center shadow-sm">
              <span className="text-white text-3xl font-bold">
                {(user?.name?.[0] || 'U').toUpperCase()}
              </span>
            </div>
          )}
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-slateDark">
              {user?.name || 'User'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{user?.email || ''}</p>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primaryDark transition-all duration-200 shadow-sm"
        >
          <HiPencil size={16} />
          Update Profile
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-slateDark">Update Profile</h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                <FaTimes size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Photo (URL)</label>
                <input
                  type="url"
                  value={formData.photo}
                  onChange={(e) =>
                    setFormData({ ...formData, photo: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primaryDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving && <FaSpinner className="animate-spin" size={14} />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
