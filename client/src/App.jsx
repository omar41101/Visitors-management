import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Visitors from './pages/Visitors';
import Visits from './pages/Visits';
import VisitHistory from './pages/VisitHistory';
import VisitDetails from './pages/VisitDetails';
import QRScanner from './components/QRScanner';
import Documents from './pages/Documents';
import SendEmail from './pages/SendEmail';
import PublicRoute from './components/PublicRoute';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/visitors" element={
            <ProtectedRoute>
              <Visitors />
            </ProtectedRoute>
          } />
          <Route path="/visits" element={
            <ProtectedRoute>
              <Visits />
            </ProtectedRoute>
          } />
          <Route path="/visit-history" element={
            <ProtectedRoute>
              <VisitHistory />
            </ProtectedRoute>
          } />
          <Route path="/visit-details/:visitId" element={
            <ProtectedRoute>
              <VisitDetails />
            </ProtectedRoute>
          } />
          <Route path="/qr-scanner" element={
            <ProtectedRoute>
              <QRScanner />
            </ProtectedRoute>
          } />
          <Route path="/documents" element={
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          } />
          <Route path="/send-email" element={
            <ProtectedRoute>
              <SendEmail />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 