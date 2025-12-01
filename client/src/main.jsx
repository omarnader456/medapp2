import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import App from './App.jsx';

// GLOBAL AXIOS INTERCEPTOR FOR SILENT REFRESH
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh the token (cookies are handled automatically)
        await axios.get('http://localhost:5000/api/auth/refresh-token', { 
          withCredentials: true 
        });
        
        // Retry original request
        return axios(originalRequest);
      } catch (err) {
        // Refresh failed (e.g. refresh token expired) -> Force Logout
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);