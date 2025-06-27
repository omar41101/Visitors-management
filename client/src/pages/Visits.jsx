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
        // Show QR code modal for new visits
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
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Visits</h2>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-6">{editingId ? 'Edit Visit' : 'Add Visit'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-gray-600 font-medium mb-1">Visitor</label>
              <select
                name="visitor"
                value={form.visitor}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              >
                <option value="">Select Visitor</option>
                {allVisitors.map(v => (
                  <option key={v._id} value={v._id}>{v.name} ({v.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Purpose</label>
              <input 
                name="purpose" 
                value={form.purpose} 
                onChange={handleChange} 
                placeholder="Purpose" 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                required 
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Host</label>
              <input 
                name="host" 
                value={form.host} 
                onChange={handleChange} 
                placeholder="Host" 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                required 
              />
            </div>
            <div className="flex gap-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Add')}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => { setForm({ visitor: '', purpose: '', host: '' }); setEditingId(null); }} 
                  className="bg-gray-300 px-4 py-2 rounded-lg w-full hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-6">Visit List</h3>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Visitor</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Host</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Entry Time</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Exit Time</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map((visit, i) => (
                    <tr key={visit._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">
                            {typeof visit.visitor === 'object' ? visit.visitor.name : visit.visitor}
                          </div>
                          <div className="text-sm text-gray-500">
                            {typeof visit.visitor === 'object' ? visit.visitor.email : ''}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{visit.purpose}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{visit.host}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {visit.entryTime ? formatDate(visit.entryTime) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {visit.exitTime ? formatDate(visit.exitTime) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(visit.status)}`}>
                          {visit.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                        <button 
                          onClick={() => handleViewQR(visit._id)} 
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow hover:bg-blue-600 transition text-sm"
                          title="View QR Code"
                        >
                          QR
                        </button>
                        {visit.status === 'active' && (
                          <button 
                            onClick={() => handleExit(visit._id)} 
                            className="bg-orange-500 text-white px-3 py-1 rounded-lg shadow hover:bg-orange-600 transition text-sm"
                            title="Record Exit"
                          >
                            Exit
                          </button>
                        )}
                        <button 
                          onClick={() => handleEdit(visit)} 
                          className="bg-yellow-400 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-500 transition text-sm"
                          title="Edit Visit"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(visit._id)} 
                          className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition text-sm"
                          title="Delete Visit"
                        >
                          Delete
                        </button>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Visit QR Code</h3>
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="text-center">
                  <div className="mb-4">
                    <img 
                      src={selectedVisit.qrCode} 
                      alt="QR Code" 
                      className="w-48 h-48 mx-auto border-2 border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {typeof selectedVisit.visitor === 'object' ? selectedVisit.visitor.name : 'Visitor'}
                    </h4>
                    <p className="text-sm text-gray-600">{selectedVisit.purpose}</p>
                    <p className="text-sm text-gray-600">Host: {selectedVisit.host}</p>
                  </div>
                  
                  {selectedVisit.qrUrl && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">QR Code URL:</p>
                      <p className="font-mono text-xs text-blue-600 break-all">
                        {selectedVisit.qrUrl}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Scan this QR code to access visitor profile and visit details
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setShowQRModal(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                      Close
                    </button>
                  </div>
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