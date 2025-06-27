import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
 

const VisitDetails = () => {
  const { visitId } = useParams();
  const navigate = useNavigate();
   const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisitDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5005/api/visits/${visitId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError('Visit not found');
          } else {
            setError('Failed to load visit details');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setVisit(data);
      } catch (error) {
        console.error('Error fetching visit details:', error);
        setError('Failed to load visit details');
      } finally {
        setLoading(false);
      }
    };

    fetchVisitDetails();
  }, [visitId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleExit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5005/api/visits/${visitId}/exit`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showAlert('Visit exit recorded successfully', 'success');
        // Refresh visit data
        const updatedVisit = await response.json();
        setVisit(updatedVisit);
      } else {
        showAlert('Failed to record exit', 'error');
      }
    } catch (error) {
      console.error('Error recording exit:', error);
      showAlert('Failed to record exit', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading visit details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">❓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Visit Not Found</h1>
          <p className="text-gray-600 mb-4">The visit you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Visit Details</h1>
              <p className="text-gray-600 mt-1">Visitor Profile & Visit Information</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/visits')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Visits
              </button>
              {visit.status === 'active' && (
                <button
                  onClick={handleExit}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Record Exit
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visitor Profile */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                👤
              </span>
              Visitor Profile
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-lg text-gray-900">{visit.visitor.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{visit.visitor.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-gray-900">{visit.visitor.phone}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <p className="mt-1 text-gray-900">{visit.visitor.company || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Visit Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                📋
              </span>
              Visit Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Visit ID</label>
                <p className="mt-1 text-sm text-gray-600 font-mono">{visit._id}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Purpose</label>
                <p className="mt-1 text-gray-900">{visit.purpose}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Host</label>
                <p className="mt-1 text-gray-900">{visit.host}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  visit.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {visit.status === 'active' ? 'Active' : 'Completed'}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Entry Time</label>
                <p className="mt-1 text-gray-900">{formatDate(visit.entryTime)}</p>
              </div>
              
              {visit.exitTime && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Exit Time</label>
                  <p className="mt-1 text-gray-900">{formatDate(visit.exitTime)}</p>
                </div>
              )}
              
              {visit.durationFormatted && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <p className="mt-1 text-gray-900">{visit.durationFormatted}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Documents Signed */}
        {visit.documentsSigned && visit.documentsSigned.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                📄
              </span>
              Documents Signed
            </h2>
            
            <div className="space-y-3">
              {visit.documentsSigned.map((doc, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{doc.documentId.title}</h3>
                      <p className="text-sm text-gray-600">Type: {doc.documentId.type}</p>
                      <p className="text-sm text-gray-600">Signed: {formatDate(doc.signedAt)}</p>
                    </div>
                    <span className="text-green-600 text-sm font-medium">✓ Signed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QR Code */}
        {visit.qrCode && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                📱
              </span>
              Visit QR Code
            </h2>
            
            <div className="flex flex-col items-center">
              <img 
                src={visit.qrCode} 
                alt="Visit QR Code" 
                className="w-48 h-48 border border-gray-200 rounded-lg"
              />
              <p className="text-sm text-gray-600 mt-2">Scan this QR code to access visit details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitDetails; 