import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header.jsx';

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
        // If fetching user fails, they are not logged in
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
    <div>
      <Header />
      <h1>Dashboard</h1>
      {user && (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}

      {/* Link for all users to update their own profile */}
      <nav>
        <Link to="/update-profile">Update My Profile</Link>
      </nav>

      {/* Role-specific navigation */}
      {user && user.role === 'admin' && (
        <nav>
          <Link to="/admin/register">Create New User</Link> |{' '}
          <Link to="/admin/users">View All Users</Link> |{' '}
          <Link to="/admin/assignments">View All Assignments</Link> |{' '}
          <Link to="/admin/create-care-team">Create Care Team</Link> |{' '}
          <Link to="/admin/medications">Manage Medications</Link>
        </nav>
      )}
      {user && ['doctor', 'nurse', 'patient'].includes(user.role) && (
        <nav>
          <Link to="/my-assignments">View My Care Team</Link>
          {user.role === 'patient' && <span> | <Link to="/my-prescriptions">View My Prescriptions</Link> | <Link to="/my-diagnoses">View My Diagnoses</Link></span>}
          {user.role === 'doctor' && <span> | <Link to="/doctor/my-patients">Manage Patient Prescriptions</Link></span>}
          {user.role === 'nurse' && <span> | <Link to="/doctor/my-patients">View Patient Prescriptions</Link></span>}
        </nav>
      )}
    </div>
  );
};

export default DashboardPage;