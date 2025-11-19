import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    setError(''); // Clear previous errors
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        formData,
        { withCredentials: true } // Important to send the cookie
      );

      if (res.data.require2fa) {
        // Redirect to 2FA page, passing the userId
        navigate('/verify-2fa', { state: { userId: res.data.userId } });
      } else {
        // If login is successful and no 2FA, redirect to home/dashboard
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred during login.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
        </div>
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default LoginPage;