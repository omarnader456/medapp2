import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header.jsx';

const AdminEditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`https://127.0.0.1:5000/api/users/${id}`, { withCredentials: true });
        const data = res.data.data;
        setName(data.name);
        setEmail(data.email);
        setRole(data.role);
        setLoading(false);
      } catch (err) {
        setErrorMsg('Failed to fetch user data.');
        setLoading(false);
      }
    };
    getUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    const body = {
        name: name,
        email: email,
        role: role
    };

    try {
      await axios.put(`https://127.0.0.1:5000/api/users/${id}`, body, { withCredentials: true });
      alert('User updated successfully!');
      navigate('/admin/users');
    } catch (err) {
      if (err.response && err.response.data) {
          setErrorMsg(err.response.data.msg);
      } else {
          setErrorMsg('Failed to update user.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <h1>Edit User Profile</h1>
      
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Email: </label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Role: </label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
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