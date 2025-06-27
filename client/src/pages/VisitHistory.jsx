import React, { useEffect, useState } from 'react';
import api from '../api';
import Alert from '../components/Alert';
import useAlert from '../hooks/useAlert';

const VisitHistory = () => {
  const [visits, setVisits] = useState([]);
  const [allVisitors, setAllVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    visitorId: '',
    host: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10,
    sortBy: 'entryTime',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalVisits: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  
  const { alert, showSuccess, showError, hideAlert } = useAlert();

  const fetchVisitHistory = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const res = await api.get(`/visits/history?${queryParams}`);
      setVisits(res.data.visits);
      setPagination(res.data.pagination);
    } catch (err) {
      showError('Failed to fetch visit history');
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
    fetchVisitHistory();
    fetchAllVisitors();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleViewDetails = async (visitId) => {
    try {
      const res = await api.get(`/visits/${visitId}`);
      setSelectedVisit(res.data);
      setShowDetails(true);
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

  const clearFilters = () => {
    setFilters({
      status: '',
      visitorId: '',
      host: '',
      startDate: '',
      endDate: '',
      page: 1,
      limit: 10,
      sortBy: 'entryTime',
      sortOrder: 'desc'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Visit History</h2>
        
        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-600 font-medium mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-600 font-medium mb-1">Visitor</label>
              <select
                value={filters.visitorId}
                onChange={(e) => handleFilterChange('visitorId', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Visitors</option>
                {allVisitors.map(visitor => (
                  <option key={visitor._id} value={visitor._id}>
                    {visitor.name} ({visitor.email})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-600 font-medium mb-1">Host</label>
              <input
                type="text"
                value={filters.host}
                onChange={(e) => handleFilterChange('host', e.target.value)}
                placeholder="Search by host"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-600 font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-600 font-medium mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-600 font-medium mb-1">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="entryTime">Entry Time</option>
                <option value="exitTime">Exit Time</option>
                <option value="host">Host</option>
                <option value="purpose">Purpose</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-600 font-medium mb-1">Sort Order</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Visit History Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-700">Visit History</h3>
            <div className="text-sm text-gray-600">
              Total: {pagination.totalVisits} visits
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Visitor</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Host</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Purpose</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Entry Time</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Exit Time</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.map((visit, i) => (
                      <tr key={visit._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">{visit.visitor?.name}</div>
                            <div className="text-sm text-gray-500">{visit.visitor?.email}</div>
                            {visit.visitor?.company && (
                              <div className="text-xs text-gray-400">{visit.visitor.company}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{visit.host}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{visit.purpose}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(visit.entryTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {visit.exitTime ? formatDate(visit.exitTime) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {visit.durationFormatted}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(visit.status)}`}>
                            {visit.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleViewDetails(visit._id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow hover:bg-blue-600 transition text-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-gray-700">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Visit Details Modal */}
        {showDetails && selectedVisit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Visit Details</h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Visitor</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVisit.visitor?.name}</p>
                      <p className="text-sm text-gray-500">{selectedVisit.visitor?.email}</p>
                      <p className="text-sm text-gray-500">{selectedVisit.visitor?.phone}</p>
                      <p className="text-sm text-gray-500">{selectedVisit.visitor?.company}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Host</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVisit.host}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Purpose</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedVisit.purpose}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Entry Time</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(selectedVisit.entryTime)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Exit Time</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedVisit.exitTime ? formatDate(selectedVisit.exitTime) : 'Not yet exited'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVisit.durationFormatted}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`mt-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedVisit.status)}`}>
                        {selectedVisit.status}
                      </span>
                    </div>
                  </div>
                  
                  {selectedVisit.documentsSigned && selectedVisit.documentsSigned.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Documents Signed</label>
                      <div className="mt-2 space-y-2">
                        {selectedVisit.documentsSigned.map((doc, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-gray-900">{doc.documentId?.title}</p>
                            <p className="text-xs text-gray-500">Type: {doc.documentId?.type}</p>
                            <p className="text-xs text-gray-500">Signed: {formatDate(doc.signedAt)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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

export default VisitHistory; 