import React, { useEffect, useState } from 'react';
import api from '../api';
import Alert from '../components/Alert';
import useAlert from '../hooks/useAlert';

const Visitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '' });
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { alert, showSuccess, showError, showWarning, hideAlert } = useAlert();

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/visitors');
      setVisitors(res.data);
    } catch (err) {
      showError('Failed to fetch visitors');
    }
    setLoading(false);
  };

  useEffect(() => { fetchVisitors(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    hideAlert();
    
    try {
      if (editingId) {
        await api.put(`/visitors/${editingId}`, form);
        showSuccess('Visitor updated successfully!');
      } else {
        await api.post('/visitors', form);
        showSuccess('Visitor added successfully!');
      }
      setForm({ name: '', email: '', phone: '', company: '' });
      setEditingId(null);
      fetchVisitors();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to save visitor';
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = visitor => {
    setForm({ name: visitor.name, email: visitor.email, phone: visitor.phone, company: visitor.company });
    setEditingId(visitor._id);
  };

  const handleDelete = async id => {
    showWarning('Are you sure you want to delete this visitor?', false);
    
    try {
      await api.delete(`/visitors/${id}`);
      showSuccess('Visitor deleted successfully!');
      fetchVisitors();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete visitor';
      showError(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    setForm({ name: '', email: '', phone: '', company: '' });
    setEditingId(null);
    hideAlert();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Visitors</h2>
        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-6">{editingId ? 'Edit Visitor' : 'Add Visitor'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-gray-600 font-medium mb-1">Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Email</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Company</label>
              <input name="company" value={form.company} onChange={handleChange} placeholder="Company" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
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
                  onClick={handleCancelEdit} 
                  className="bg-gray-300 px-4 py-2 rounded-lg w-full hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-6">Visitor List</h3>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((v, i) => (
                    <tr key={v._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">{v.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{v.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{v.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{v.company}</td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button 
                          onClick={() => handleEdit(v)} 
                          className="bg-yellow-400 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-500 transition"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(v._id)} 
                          className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition"
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

export default Visitors; 