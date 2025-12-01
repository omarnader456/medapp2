import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './TwoFactorAuthPage.css';

const TwoFactorAuthPage = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // FIX: Destructure twoFactorToken from state
  const { twoFactorToken } = location.state || {}; 

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!twoFactorToken) {
      setError('Session expired or invalid. Please login again.');
      return;
    }
    
    setError('');

    try {
      await axios.post(
        'http://localhost:5000/api/auth/verify-2fa',
        { twoFactorToken, token }, // Send the temp token + user code
        { withCredentials: true }
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to verify 2FA token.');
    }
  };

  return (
    <div className="two-fa-page-container">
      <h1 className="two-fa-title">Enter 2FA Code</h1>
      <p className="two-fa-subtitle">Enter the code sent to your email.</p>
      {error && <p className="two-fa-error-message" style={{ color: 'red' }}>{error}</p>}
      <form className="two-fa-form" onSubmit={onSubmit}>
        <div id="2fa-input-group">
          <input
            id="2fa-token-input"
            type="text"
            placeholder="6-digit code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        </div>
        <input className="two-fa-submit-button" type="submit" value="Verify" />
      </form>
    </div>
  );
};

export default TwoFactorAuthPage;