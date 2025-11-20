import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header.jsx';

const AdminEditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`, { withCredentials: true });
        setFormData(res.data.data);
      } catch (err) {
        setError('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, formData, { withCredentials: true });
      alert('User updated successfully!');
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update user.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <Header />
      <h1>Edit User Profile</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>Name: </label>
          <input name="name" value={formData.name} onChange={onChange} required />
        </div>
        <div>
          <label>Email: </label>
          <input name="email" type="email" value={formData.email} onChange={onChange} required />
        </div>
        <div>
          <label>Role: </label>
          <select name="role" value={formData.role} onChange={onChange}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default AdminEditUserPage;