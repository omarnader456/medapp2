import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header.jsx';
import './DashboardPage.css';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://localhost:5000/api/auth/me', { withCredentials: true })
      .then(res => {
        setUser(res.data.data);
        setIsLoading(false);
      })
      .catch(err => {
        navigate('/login');
        setIsLoading(false);
      });
  }, [navigate]);

  if (isLoading) {
    return <div>Loading Dashboard...</div>;
  }

  const renderAdminLinks = () => {
    if (user && user.role === 'admin') {
      return (
        <nav className="admin-nav-section">
          <Link to="/admin/register">Create New User</Link> |{' '}
          <Link to="/admin/users">View All Users</Link> |{' '}
          <Link to="/admin/assignments">View All Assignments</Link> |{' '}
          <Link to="/admin/create-care-team">Create Care Team</Link> |{' '}
          <Link to="/admin/medications">Manage Medications</Link>
        </nav>
      );
    }
    return null;
  };

  const renderClinicalLinks = () => {
    if (!user) return null;
    
    const clinicalRoles = ['doctor', 'nurse', 'patient'];
    if (!clinicalRoles.includes(user.role)) return null;

    return (
        <nav id="clinical-nav-section">
          <Link to="/my-assignments">View My Care Team</Link>
          
          {user.role === 'patient' && (
            <span> 
                | <Link to="/my-prescriptions">View My Prescriptions</Link> 
                | <Link to="/my-diagnoses">View My Diagnoses</Link>
            </span>
          )}
          
          {(user.role === 'doctor' || user.role === 'nurse') && (
            <span> 
                | <Link to="/doctor/my-patients">
                    {user.role === 'doctor' ? 'Manage' : 'View'} Patient Prescriptions
                  </Link>
            </span>
          )}
        </nav>
    );
  };

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

      <nav className="user-actions-nav">
        <Link className="update-profile-link" to="/update-profile">Update My Profile</Link>
      </nav>

      {renderAdminLinks()}
      {renderClinicalLinks()}
    </div>
  );
};

export default DashboardPage;