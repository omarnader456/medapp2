import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminRoute = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true,
        });

        if (res.data.data.role === 'admin') {
          setIsAuthorized(true);
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  if (loading) {
    return <div>Verifying authorization...</div>;
  }

  return isAuthorized ? <Outlet /> : null;
};

export default AdminRoute;
