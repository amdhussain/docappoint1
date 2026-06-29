'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner, FaEnvelope, FaUser, FaPhone, FaClock, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Messages - DocAppoint';
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.messages || [];
      setMessages(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/messages?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      toast.success('Message deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete message');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slateDark mb-6">Messages</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-6">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={fetchMessages}
            className="mt-3 text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!error && messages.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaEnvelope className="text-gray-400" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-slateDark mb-2">No messages</h3>
          <p className="text-gray-400 text-sm">No contact form submissions yet.</p>
        </div>
      )}

      {!error && messages.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-400 mb-2">
            Showing {messages.length} {messages.length === 1 ? 'message' : 'messages'}
          </p>
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-5"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {(msg.name || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slateDark text-sm">{msg.name || 'Unknown'}</h3>
                    <span className="text-xs text-gray-400">
                      <FaClock className="inline mr-1" size={10} />
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>
                      <FaEnvelope className="inline mr-1" size={10} />
                      {msg.email || 'N/A'}
                    </span>
                    {msg.phone && (
                      <span>
                        <FaPhone className="inline mr-1" size={10} />
                        {msg.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.message}</p>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <FaTrash size={11} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
