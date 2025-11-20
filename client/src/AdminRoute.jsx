import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

// This component acts as a guard for admin-only pages
const AdminRoute = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Get the current user's data from the backend
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true,
        });

        // Check if the user's role is 'admin'
        if (res.data.data.role === 'admin') {
          setIsAuthorized(true);
        } else {
          // If not an admin, redirect to the dashboard
          navigate('/dashboard');
        }
      } catch (err) {
        // If there's any error (e.g., not logged in), redirect to login
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  // While checking, show a loading message
  if (loading) {
    return <div>Verifying authorization...</div>;
  }

  // If authorized, render the child route (e.g., the RegistrationPage)
  // <Outlet /> is a placeholder for the nested route component
  return isAuthorized ? <Outlet /> : null;
};

export default AdminRoute;
