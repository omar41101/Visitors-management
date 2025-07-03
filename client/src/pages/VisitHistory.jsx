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
      page: 1
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
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'completed': return 'bg-violet-100 text-violet-800 border-violet-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            Visit History
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            Comprehensive history of all visitor activities with advanced filtering
          </p>
        </div>
        
        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Advanced Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Visitor</label>
              <select
                value={filters.visitorId}
                onChange={(e) => handleFilterChange('visitorId', e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80"
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">Host</label>
              <input
                type="text"
                value={filters.host}
                onChange={(e) => handleFilterChange('host', e.target.value)}
                placeholder="Search by host"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80"
              >
                <option value="entryTime">Entry Time</option>
                <option value="exitTime">Exit Time</option>
                <option value="host">Host</option>
                <option value="purpose">Purpose</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Sort Order</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full bg-gradient-to-r from-slate-500 to-slate-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Visit History Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Visit Records</h3>
            </div>
            <div className="bg-slate-100 px-4 py-2 rounded-xl">
              <span className="text-sm font-semibold text-slate-700">
                Total: {pagination.totalVisits} visits
              </span>
            </div>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-emerald-600 mb-4"></div>
              <p className="text-slate-600 font-medium">Loading visit history...</p>
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Visitor</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Host</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Purpose</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Entry Time</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Exit Time</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visits.map((visit, i) => (
                      <tr key={visit._id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-emerald-50/50 transition-colors duration-200`}>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-slate-900">{visit.visitor?.name}</div>
                            <div className="text-sm text-slate-500">{visit.visitor?.email}</div>
                            {visit.visitor?.company && (
                              <div className="text-xs text-slate-400">{visit.visitor.company}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">{visit.host}</td>
                        <td className="px-6 py-4 text-slate-700">{visit.purpose}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(visit.entryTime)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {visit.exitTime ? formatDate(visit.exitTime) : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                          {visit.durationFormatted}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(visit.status)}`}>
                            {visit.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleViewDetails(visit._id)}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
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
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
                  <div className="text-sm text-slate-600 font-medium">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="px-4 py-2 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="px-4 py-2 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">Visit Details</h3>
                    <p className="text-slate-600">Complete information about this visit</p>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-slate-800 mb-4">Visitor Information</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-semibold text-slate-600">Name</label>
                          <p className="text-slate-900 font-medium">{selectedVisit.visitor?.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-600">Email</label>
                          <p className="text-slate-700">{selectedVisit.visitor?.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-600">Phone</label>
                          <p className="text-slate-700">{selectedVisit.visitor?.phone}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-600">Company</label>
                          <p className="text-slate-700">{selectedVisit.visitor?.company}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-slate-800 mb-4">Visit Information</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-semibold text-slate-600">Host</label>
                          <p className="text-slate-900 font-medium">{selectedVisit.host}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-600">Purpose</label>
                          <p className="text-slate-700">{selectedVisit.purpose}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-600">Status</label>
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedVisit.status)}`}>
                            {selectedVisit.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-2">Entry Time</label>
                      <p className="text-slate-900 font-medium bg-slate-50 rounded-lg p-3">{formatDate(selectedVisit.entryTime)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-2">Exit Time</label>
                      <p className="text-slate-900 font-medium bg-slate-50 rounded-lg p-3">
                        {selectedVisit.exitTime ? formatDate(selectedVisit.exitTime) : 'Not yet exited'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Duration</label>
                    <p className="text-slate-900 font-medium bg-slate-50 rounded-lg p-3">{selectedVisit.durationFormatted}</p>
                  </div>
                  
                  {selectedVisit.documentsSigned && selectedVisit.documentsSigned.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-4">Documents Signed</label>
                      <div className="space-y-3">
                        {selectedVisit.documentsSigned.map((doc, index) => (
                          <div key={index} className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                            <h5 className="font-semibold text-emerald-800 mb-1">{doc.documentId?.title}</h5>
                            <p className="text-sm text-emerald-600">Type: {doc.documentId?.type}</p>
                            <p className="text-sm text-emerald-600">Signed: {formatDate(doc.signedAt)}</p>
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
