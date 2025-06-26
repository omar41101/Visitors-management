import React, { useEffect, useState } from 'react';
import api from '../api';

const Visits = () => {
  const [visits, setVisits] = useState([]);
  const [allVisitors, setAllVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ visitor: '', date: '', purpose: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const res = await api.get('/visits');
      setVisits(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch visits');
    }
    setLoading(false);
  };

  const fetchAllVisitors = async () => {
    try {
      const res = await api.get('/visitors');
      setAllVisitors(res.data);
    } catch {}
  };

  useEffect(() => { fetchVisits(); fetchAllVisitors(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/visits/${editingId}`, form);
      } else {
        await api.post('/visits', form);
      }
      setForm({ visitor: '', date: '', purpose: '' });
      setEditingId(null);
      fetchVisits();
    } catch {
      setError('Failed to save visit');
    }
  };

  const handleEdit = visit => {
    setForm({
      visitor: typeof visit.visitor === 'object' ? visit.visitor._id : visit.visitor,
      date: visit.date,
      purpose: visit.purpose
    });
    setEditingId(visit._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this visit?')) return;
    try {
      await api.delete(`/visits/${id}`);
      fetchVisits();
    } catch {
      setError('Failed to delete visit');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-4">
      <div className="max-w-5xl mx-auto">
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
              <label className="block text-gray-600 font-medium mb-1">Date</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Purpose</label>
              <input name="purpose" value={form.purpose} onChange={handleChange} placeholder="Purpose" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition w-full">{editingId ? 'Update' : 'Add'}</button>
              {editingId && <button type="button" onClick={() => { setForm({ visitor: '', date: '', purpose: '' }); setEditingId(null); }} className="bg-gray-300 px-4 py-2 rounded-lg w-full">Cancel</button>}
            </div>
          </form>
          {error && <div className="mt-4 text-red-500">{error}</div>}
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-6">Visit List</h3>
          {loading ? <div>Loading...</div> : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Visitor</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map((v, i) => (
                    <tr key={v._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">{typeof v.visitor === 'object' ? v.visitor.name || v.visitor._id : v.visitor}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{v.date?.slice(0,10)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{v.purpose}</td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button onClick={() => handleEdit(v)} className="bg-yellow-400 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-500 transition">Edit</button>
                        <button onClick={() => handleDelete(v._id)} className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visits; 