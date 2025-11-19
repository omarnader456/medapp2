import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const TwoFactorAuthPage = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {}; // Get userId from the login page

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError('No user ID found. Please try logging in again.');
      return;
    }
    setError('');

    try {
      await axios.post(
        'http://localhost:5000/api/auth/verify-2fa',
        { userId, token },
        { withCredentials: true }
      );
      // On successful verification, redirect to the main app page
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to verify 2FA token.');
    }
  };

  return (
    <div>
      <h1>Enter 2FA Code</h1>
      <p>Enter the code from your authenticator app.</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="6-digit code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        </div>
        <input type="submit" value="Verify" />
      </form>
    </div>
  );
};

export default TwoFactorAuthPage;