import React, { useState } from 'react';
import api from '../api';

const SendEmail = () => {
  const [form, setForm] = useState({ to: '', subject: '', text: '', html: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await api.post('/send-email', form);
      setMessage('Email sent! Preview: ' + (res.data.previewUrl || 'N/A'));
    } catch {
      setError('Failed to send email');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Send Email</h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-6">Email Form</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-600 font-medium mb-1">To</label>
              <input name="to" value={form.to} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Recipient email" />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Subject</label>
              <input name="subject" value={form.subject} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Subject" />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Text</label>
              <input name="text" value={form.text} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Text body" />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">HTML</label>
              <input name="html" value={form.html} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="<b>HTML body</b>" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition">Send</button>
          </form>
          {message && <div className="mt-6 text-green-600 font-semibold bg-green-50 border border-green-200 rounded-lg p-4">{message}</div>}
          {error && <div className="mt-6 text-red-500 font-semibold bg-red-50 border border-red-200 rounded-lg p-4">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default SendEmail; 