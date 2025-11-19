import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Import page components
import HomePage from './HomePage.jsx';
import LoginPage from './LoginPage.jsx';
import TwoFactorAuthPage from './TwoFactorAuthPage.jsx';
import DashboardPage from './DashboardPage.jsx';
import MyAssignmentsPage from './MyAssignmentsPage.jsx';
import AdminUsersPage from './AdminUsersPage.jsx';
import AdminAssignmentsPage from './AdminAssignmentsPage.jsx';
import EditAssignmentPage from './EditAssignmentPage.jsx';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public Routes - HomePage is now the entry point */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-2fa" element={<TwoFactorAuthPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/my-assignments" element={<MyAssignmentsPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/assignments" element={<AdminAssignmentsPage />} />
        <Route path="/admin/assignments/:id" element={<EditAssignmentPage />} />
      </Routes>
    </div>
  );
}

export default App;
