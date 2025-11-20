import React from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/api/auth/logout', {
        withCredentials: true,
      });
      // On successful logout, redirect to the login page
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <header style={{ padding: '10px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* Link to go back to the main dashboard */}
      <Link to="/dashboard">Back to Dashboard</Link>
      {/* Logout button */}
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
};

export default Header;