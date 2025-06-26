import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
      <div className="font-bold text-xl">
        <Link to="/dashboard">Visitor Management</Link>
      </div>
      <div className="space-x-4">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/visitors" className="hover:underline">Visitors</Link>
            <Link to="/visits" className="hover:underline">Visits</Link>
            <Link to="/documents" className="hover:underline">Documents</Link>
            <Link to="/send-email" className="hover:underline">Send Email</Link>
            <button onClick={handleLogout} className="ml-2 bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 