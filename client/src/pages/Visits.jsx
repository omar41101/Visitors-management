import React, { useEffect, useState } from 'react';
import api from '../api';
import Alert from '../components/Alert';
import useAlert from '../hooks/useAlert';

const Visits = () => {
  const [visits, setVisits] = useState([]);
  const [allVisitors, setAllVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ visitor: '', purpose: '', host: '' });
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const { alert, showSuccess, showError, hideAlert } = useAlert();

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const res = await api.get('/visits');
      setVisits(res.data);
    } catch (err) {
      showError('Failed to fetch visits');
    }
    setLoading(false);
  };

  const fetchAllVisitors = async () => {
    try {
      const res = await api.get('/visitors');
      setAllVisitors(res.data);
    } catch (err) {
      showError('Failed to fetch visitors');
    }
  };

  useEffect(() => { 
    fetchVisits(); 
    fetchAllVisitors(); 
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    hideAlert();
    
    try {
      if (editingId) {
        await api.put(`/visits/${editingId}`, form);
        showSuccess('Visit updated successfully!');
      } else {
        const res = await api.post('/visits', form);
        showSuccess('Visit created successfully!');
        if (res.data.qrCode) {
          setSelectedVisit(res.data);
          setShowQRModal(true);
        }
      }
      setForm({ visitor: '', purpose: '', host: '' });
      setEditingId(null);
      fetchVisits();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to save visit';
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = visit => {
    setForm({
      visitor: typeof visit.visitor === 'object' ? visit.visitor._id : visit.visitor,
      purpose: visit.purpose,
      host: visit.host
    });
    setEditingId(visit._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this visit?')) return;
    try {
      await api.delete(`/visits/${id}`);
      showSuccess('Visit deleted successfully!');
      fetchVisits();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete visit';
      showError(errorMessage);
    }
  };

  const handleExit = async (id) => {
    try {
      await api.put(`/visits/${id}/exit`);
      showSuccess('Exit recorded successfully!');
      fetchVisits();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to record exit';
      showError(errorMessage);
    }
  };

  const handleViewQR = async (visitId) => {
    try {
      const res = await api.get(`/visits/${visitId}`);
      setSelectedVisit(res.data);
      setShowQRModal(true);
    } catch (err) {
      showError('Failed to fetch visit details');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'completed': return 'bg-violet-100 text-violet-800 border-violet-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            Visit Management
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            Create, manage, and track visitor appointments with QR code generation
          </p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">
              {editingId ? 'Edit Visit' : 'Schedule New Visit'}
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select Visitor</label>
              <select
                name="visitor"
                value={form.visitor}
                onChange={handleChange}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80"
                required
              >
                <option value="">Choose a visitor</option>
                {allVisitors.map(v => (
                  <option key={v._id} value={v._id}>{v.name} ({v.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Visit Purpose</label>
              <input 
                name="purpose" 
                value={form.purpose} 
                onChange={handleChange} 
                placeholder="Enter visit purpose" 
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Host Name</label>
              <input 
                name="host" 
                value={form.host} 
                onChange={handleChange} 
                placeholder="Enter host name" 
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80" 
                required 
              />
            </div>
            <div className="flex gap-3">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingId ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                    </svg>
                    {editingId ? 'Update' : 'Create'}
                  </>
                )}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => { setForm({ visitor: '', purpose: '', host: '' }); setEditingId(null); }} 
                  className="flex-1 bg-gradient-to-r from-slate-400 to-slate-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Active Visits</h3>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-emerald-600 mb-4"></div>
              <p className="text-slate-600 font-medium">Loading visits...</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Visitor</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Host</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Entry Time</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Exit Time</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visits.map((visit, i) => (
                    <tr key={visit._id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-emerald-50/50 transition-colors duration-200`}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-slate-900">
                            {typeof visit.visitor === 'object' ? visit.visitor.name : visit.visitor}
                          </div>
                          <div className="text-sm text-slate-500">
                            {typeof visit.visitor === 'object' ? visit.visitor.email : ''}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">{visit.purpose}</td>
                      <td className="px-6 py-4 text-slate-700">{visit.host}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {visit.entryTime ? formatDate(visit.entryTime) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {visit.exitTime ? formatDate(visit.exitTime) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(visit.status)}`}>
                          {visit.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <button 
                            onClick={() => handleViewQR(visit._id)} 
                            className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-3 py-1 rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm"
                            title="View QR Code"
                          >
                            QR
                          </button>
                          {typeof visit.visitor === 'object' && (
                            <button 
                              onClick={() => window.location.href = `/visitors/${visit.visitor._id}`}
                              className="bg-gradient-to-r from-blue-500 to-sky-600 text-white px-3 py-1 rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm"
                              title="View Visitor Profile"
                            >
                              Profile
                            </button>
                          )}
                          {visit.status === 'active' && (
                            <button 
                              onClick={() => handleExit(visit._id)} 
                              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm"
                              title="Record Exit"
                            >
                              Exit
                            </button>
                          )}
                          <button 
                            onClick={() => handleEdit(visit)} 
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1 rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm"
                            title="Edit Visit"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(visit._id)} 
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm"
                            title="Delete Visit"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* QR Code Modal */}
        {showQRModal && selectedVisit && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-lg w-full border border-white/20">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">Visit QR Code</h3>
                    <p className="text-slate-600">Scan to access visit details</p>
                  </div>
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="text-center">
                  <div className="mb-6">
                    <img 
                      src={selectedVisit.qrCode || "/placeholder.svg"} 
                      alt="QR Code" 
                      className="w-56 h-56 mx-auto border-4 border-slate-200 rounded-2xl shadow-lg"
                    />
                  </div>
                  
                  <div className="mb-6 bg-slate-50 rounded-xl p-6">
                    <h4 className="font-bold text-slate-800 mb-3 text-lg">
                      {typeof selectedVisit.visitor === 'object' ? selectedVisit.visitor.name : 'Visitor'}
                    </h4>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p><span className="font-semibold">Purpose:</span> {selectedVisit.purpose}</p>
                      <p><span className="font-semibold">Host:</span> {selectedVisit.host}</p>
                    </div>
                  </div>
                  
                  {selectedVisit.qrUrl && (
                    <div className="mb-6 p-4 bg-violet-50 border border-violet-200 rounded-xl">
                      <p className="text-sm font-semibold text-violet-800 mb-2">QR Code URL:</p>
                      <p className="font-mono text-xs text-violet-600 break-all bg-white rounded-lg p-2">
                        {selectedVisit.qrUrl}
                      </p>
                      <p className="text-xs text-violet-500 mt-2">
                        Scan this QR code to access visitor profile and visit details
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="bg-gradient-to-r from-slate-500 to-slate-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Alert 
        type={alert.type}
        message={alert.message}
        isVisible={alert.isVisible}
        onClose={hideAlert}
        autoClose={alert.autoClose}
        autoCloseTime={alert.autoCloseTime}
      />
    </div>
  );
};

export default Visits;
