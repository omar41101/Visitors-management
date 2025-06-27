import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import Alert from './Alert';
import useAlert from '../hooks/useAlert';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [validating, setValidating] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const { alert, showSuccess, showError, hideAlert } = useAlert();

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
      }
    } catch (error) {
      showError('Unable to access camera. Please check permissions.');
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
    setResult(null);
  };

  const validateQRCode = async (qrData) => {
    if (validating) return;
    
    setValidating(true);
    hideAlert();
    
    try {
      const response = await api.post('/visits/validate-qr', { qrData });
      
      if (response.data.valid) {
        setResult(response.data.visit);
        showSuccess('QR Code validated successfully!');
        stopScanning();
        setManualInput('');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid QR code';
      showError(errorMessage);
    } finally {
      setValidating(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      validateQRCode(manualInput.trim());
    }
  };

  const handleExit = async () => {
    if (!result) return;
    
    try {
      await api.put(`/visits/${result._id}/exit`);
      showSuccess('Visitor exit recorded successfully!');
      setResult(null);
    } catch (error) {
      showError('Failed to record exit. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">QR Code Scanner</h2>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          {!scanning && !result && (
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Scan Visitor QR Code</h3>
              <p className="text-gray-600 mb-6">
                Scan visitor QR codes to validate and record exits. You can also manually enter the QR code URL.
              </p>
              
              {/* Manual Input Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3">Manual QR Code Input</h4>
                <form onSubmit={handleManualSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Enter QR code URL or data..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={validating}
                  />
                  <button
                    type="submit"
                    disabled={validating || !manualInput.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {validating ? 'Validating...' : 'Validate'}
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2">
                  Example: http://localhost:5173/visit-details/[visit-id]
                </p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={startScanning}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
                >
                  Start Camera Scan
                </button>
              </div>
            </div>
          )}

          {scanning && (
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Scanning QR Code</h3>
              <div className="relative mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-w-md mx-auto border-2 border-gray-300 rounded-lg"
                />
                {validating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <div className="bg-white p-4 rounded-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm">Validating...</p>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Point your camera at the QR code. For testing, you can manually enter the QR code URL above.
              </p>
              <button
                onClick={stopScanning}
                className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
              >
                Stop Scanning
              </button>
            </div>
          )}

          {result && (
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Visitor Information</h3>
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Visitor Name</label>
                    <p className="mt-1 text-sm text-gray-900">{result.visitor.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{result.visitor.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <p className="mt-1 text-sm text-gray-900">{result.visitor.company || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{result.visitor.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Purpose</label>
                    <p className="mt-1 text-sm text-gray-900">{result.purpose}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Host</label>
                    <p className="mt-1 text-sm text-gray-900">{result.host}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Entry Time</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(result.entryTime)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className="mt-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {result.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleExit}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
                >
                  Record Exit
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-700 transition"
                >
                  Scan Another
                </button>
              </div>
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

export default QRScanner; 