import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header.jsx'; 

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '', 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const { name, email, password, role } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post(
        'http://localhost:5000/api/auth/register',
        formData,
        { withCredentials: true }
      );

      setSuccess(`Successfully created user: ${name} (${role})`);
      setFormData({ name: '', email: '', password: '', role: '' });
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.msg || 'Registration failed.';
      setError(errorMsg);
    }
  };

  return (
    <div>
      <Header />
      <h1>Create a New User Account</h1>
      <p>This page is for administrators to create new accounts.</p>

      {}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={onSubmit}>
        <div>
          <input type="text" placeholder="Full Name" name="name" value={name} onChange={onChange} required />
        </div>
        <div>
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required />
        </div>
        <div>
          <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
        </div>
        <div>
          <label>Role: </label>
          <select name="role" value={role} onChange={onChange}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <input type="submit" value="Create Account" />
      </form>
    </div>
  );
};

export default RegistrationPage;
