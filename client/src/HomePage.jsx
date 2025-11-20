import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Welcome to the Medical App</h1>
      <p className="homepage-subtitle">This is the home page.</p>
      <Link className="homepage-login-link" to="/login">Login</Link>
    </div>
  );
};

export default HomePage;