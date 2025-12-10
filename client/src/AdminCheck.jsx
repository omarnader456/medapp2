import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminRoute = () => {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      try {
        const res = await axios.get('https://localhost:5000/api/auth/me', {
          withCredentials: true,
        });

        const user = res.data.data;
        
        if (user.role === 'admin') {
          setAuthorized(true);
        } else {
          navigate('/dashboard');
        }
        setLoading(false);
      } catch (err) {
        navigate('/login');
        setLoading(false);
      }
    };

    check();
  }, [navigate]);

  if (loading) {
    return <div>Verifying...</div>;
  }

  return authorized ? <Outlet /> : null;
};

export default AdminRoute;