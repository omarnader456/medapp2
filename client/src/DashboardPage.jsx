import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header.jsx';
import './DashboardPage.css';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true,
        });
        setUser(res.data.data);
      } catch (err) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-page-container">
      <Header />
      <h1 className="dashboard-title">Dashboard</h1>
      {user && (
        <div className="user-info-section">
          <p className="user-name"><strong>Name:</strong> {user.name}</p>
          <p className="user-email"><strong>Email:</strong> {user.email}</p>
          <p className="user-role"><strong>Role:</strong> {user.role}</p>
        </div>
      )}

      {}
      <nav className="user-actions-nav">
        <Link className="update-profile-link" to="/update-profile">Update My Profile</Link>
      </nav>

      {}
      {user && user.role === 'admin' && (
        <nav className="admin-nav-section">
          <Link className="admin-register-link" to="/admin/register">Create New User</Link> |{' '}
          <Link className="admin-users-link" to="/admin/users">View All Users</Link> |{' '}
          <Link className="admin-assignments-link" to="/admin/assignments">View All Assignments</Link> |{' '}
          <Link className="admin-create-team-link" to="/admin/create-care-team">Create Care Team</Link> |{' '}
          <Link className="admin-medications-link" to="/admin/medications">Manage Medications</Link>
        </nav>
      )}
      {user && ['doctor', 'nurse', 'patient'].includes(user.role) && (
        <nav id="clinical-nav-section">
          <Link id="my-assignments-link" to="/my-assignments">View My Care Team</Link>
          {user.role === 'patient' && <span> | <Link to="/my-prescriptions">View My Prescriptions</Link> | <Link to="/my-diagnoses">View My Diagnoses</Link></span>}
          {user.role === 'doctor' && <span> | <Link to="/doctor/my-patients">Manage Patient Prescriptions</Link></span>}
          {user.role === 'nurse' && <span> | <Link to="/doctor/my-patients">View Patient Prescriptions</Link></span>}
        </nav>
      )}
    </div>
  );
};

export default DashboardPage;