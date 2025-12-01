import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        formData,
        { withCredentials: true } 
      );

      // FIX: Ensure we extract the token correctly if 2FA is required
      if (res.data.require2fa) {
        // We need to pass the temporary 2FA token to the next page
        navigate('/verify-2fa', { 
            state: { 
                twoFactorToken: res.data.twoFactorToken 
            } 
        });
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred during login.');
    }
  };

  return (
    <div className="login-page-container">
      <h1 className="login-title">Login</h1>
      <div className="login-form-container">
        {error && <p className="login-error-message" style={{ color: 'red' }}>{error}</p>}
        <form className="login-form" onSubmit={onSubmit}>
          <div id="email-input-group">
            <input
              id="email-input"
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div id="password-input-group">
            <input
              id="password-input"
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <input className="login-submit-button" type="submit" value="Login" />
        </form>
      </div>
    </div>
  );
};

export default LoginPage;