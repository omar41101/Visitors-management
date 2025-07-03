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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            Send Email
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Compose and send professional emails with ease
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Compose Email</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Recipient Email</label>
              <input 
                name="to" 
                value={form.to} 
                onChange={handleChange} 
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80" 
                placeholder="recipient@example.com" 
                type="email"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Subject</label>
              <input 
                name="subject" 
                value={form.subject} 
                onChange={handleChange} 
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80" 
                placeholder="Email subject" 
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Text Content</label>
              <textarea 
                name="text" 
                value={form.text} 
                onChange={handleChange} 
                rows={4}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80 resize-none" 
                placeholder="Plain text email content" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">HTML Content</label>
              <textarea 
                name="html" 
                value={form.html} 
                onChange={handleChange} 
                rows={6}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80 resize-none font-mono text-sm" 
                placeholder="<p>HTML email content</p>" 
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send Email
            </button>
          </form>
          
          {message && (
            <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-emerald-800 mb-1">Success!</h4>
                  <p className="text-emerald-700">{message}</p>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">Error</h4>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendEmail;
