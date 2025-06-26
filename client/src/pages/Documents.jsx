import React, { useEffect, useState } from 'react';
import api from '../api';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/documents');
      setDocuments(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch documents');
    }
    setLoading(false);
  };

  useEffect(() => { fetchDocuments(); }, []);

  const handleUpload = async e => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFile(null);
      fetchDocuments();
    } catch {
      setError('Failed to upload document');
    }
  };

  const handleDownload = async id => {
    try {
      const res = await api.get(`/documents/${id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `document_${id}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setError('Failed to download document');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Documents</h2>
        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-6">Upload Document</h3>
          <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-end">
            <input type="file" onChange={e => setFile(e.target.files[0])} className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full md:w-auto" />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">Upload</button>
          </form>
          {error && <div className="mt-4 text-red-500">{error}</div>}
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-6">Document List</h3>
          {loading ? <div>Loading...</div> : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, i) => (
                    <tr key={doc._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">{doc.name || doc.filename || doc._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button onClick={() => handleDownload(doc._id)} className="bg-green-500 text-white px-3 py-1 rounded-lg shadow hover:bg-green-600 transition">Download</button>
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

export default Documents; 