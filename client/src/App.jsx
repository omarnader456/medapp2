import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Import page components
import HomePage from './HomePage.jsx';
import LoginPage from './LoginPage.jsx';
import TwoFactorAuthPage from './TwoFactorAuthPage.jsx';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-2fa" element={<TwoFactorAuthPage />} />
      </Routes>
    </div>
  );
}

export default App;
