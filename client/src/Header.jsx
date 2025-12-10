import React from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.get('https://localhost:5000/api/auth/logout', { withCredentials: true })
      .then(() => {
        navigate('/login');
      })
      .catch((err) => {
        console.log(err);
        alert('Logout failed.');
      });
  };

  return (
    <header style={{ padding: '10px', backgroundColor: 'black', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
        Back to Dashboard
      </Link>
      
      <button onClick={handleLogout} style={{ backgroundColor: '#333', color: 'white', border: '1px solid white', padding: '5px 10px', borderRadius: '5px' }}>
        Logout
      </button>
    </header>
  );
};

export default Header;