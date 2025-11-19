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

      {/* Role-specific navigation */}
      {user && user.role === 'admin' && (
        <nav>
          <Link to="/admin/users">View All Users</Link> |{' '}
          <Link to="/admin/assignments">View All Assignments</Link>
        </nav>
      )}
      {user && ['doctor', 'nurse', 'patient'].includes(user.role) && (
        <nav>
          <Link to="/my-assignments">View My Assignments</Link>
        </nav>
      )}
    </div>
  );
};

export default DashboardPage;