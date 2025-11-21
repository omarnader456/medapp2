import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header.jsx';

const UpdateProfilePage = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', { withCredentials: true });
        setFormData({ name: res.data.data.name, email: res.data.data.email });
      } catch (err) {
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onPasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.put('http://localhost:5000/api/auth/updatedetails', formData, { withCredentials: true });
      alert('Profile updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile.');
    }
  };

  const onPasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      return setPasswordError('New passwords do not match.');
    }
    if (passwordData.newPassword.length < 6) {
      return setPasswordError('New password must be at least 6 characters long.');
    }

    try {
      await axios.put('http://localhost:5000/api/auth/updatepassword', passwordData, { withCredentials: true });
      alert('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); 
    } catch (err) {
      setPasswordError(err.response?.data?.msg || 'Failed to update password.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <h1>Update My Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Name: </label>
          <input name="name" value={formData.name} onChange={onChange} required />
        </div>
        <div>
          <label>Email: </label>
          <input name="email" type="email" value={formData.email} onChange={onChange} required />
        </div>
        <button type="submit">Update Profile</button>
      </form>

      <hr style={{ margin: '20px 0' }} />

      <h2>Change Password</h2>
      {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
      <form onSubmit={onPasswordSubmit}>
        <div>
          <label>Current Password: </label>
          <input name="currentPassword" type="password" value={passwordData.currentPassword} onChange={onPasswordChange} required />
        </div>
        <div>
          <label>New Password: </label>
          <input name="newPassword" type="password" value={passwordData.newPassword} onChange={onPasswordChange} required />
        </div>
        <div>
          <label>Confirm New Password: </label>
          <input name="confirmNewPassword" type="password" value={passwordData.confirmNewPassword} onChange={onPasswordChange} required />
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default UpdateProfilePage;