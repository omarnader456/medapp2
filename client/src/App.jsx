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
import RegistrationPage from './RegistrationPage.jsx';
import AdminRoute from './AdminRoute.jsx';
import EditMedicationPage from './EditMedicationPage.jsx';
import UpdateProfilePage from './UpdateProfilePage.jsx';
import AdminEditUserPage from './AdminEditUserPage.jsx';
import AdminMedicationsPage from './AdminMedicationsPage.jsx';
import DoctorPatientsPage from './DoctorPatientsPage.jsx';
import CreateCareTeamPage from './CreateCareTeamPage.jsx';
import PatientPrescriptionsPage from './PatientPrescriptionsPage.jsx';
import PatientDiagnosesPage from './PatientDiagnosesPage.jsx';
import DoctorManageDiagnosesPage from './DoctorManageDiagnosesPage.jsx';
import ManagePrescriptionsPage from './ManagePrescriptionsPage.jsx';

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
        <Route path="/update-profile" element={<UpdateProfilePage />} />
        <Route path="/my-assignments" element={<MyAssignmentsPage />} />
        <Route path="/my-prescriptions" element={<PatientPrescriptionsPage />} />
        <Route path="/my-diagnoses" element={<PatientDiagnosesPage />} />

        {/* Doctor Routes */}
        <Route path="/doctor/my-patients" element={<DoctorPatientsPage />} />
        <Route path="/prescriptions/:patientId" element={<ManagePrescriptionsPage />} />
        <Route path="/diagnoses/:patientId" element={<DoctorManageDiagnosesPage />} />

        {/* Admin-Only Protected Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/register" element={<RegistrationPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/create-care-team" element={<CreateCareTeamPage />} />
          <Route path="/admin/users/:id" element={<AdminEditUserPage />} />
          <Route path="/admin/assignments" element={<AdminAssignmentsPage />} />
          <Route path="/admin/medications" element={<AdminMedicationsPage />} />
          <Route path="/admin/medications/:id" element={<EditMedicationPage />} />
          <Route path="/admin/assignments/:id" element={<EditAssignmentPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
