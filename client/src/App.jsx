import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './HomePage.jsx';
import Login from './Login.jsx';
import VerifyCode from './VerifyCode.jsx';
import Dash from './Dash.jsx';
import MyTeam from './MyAssignmentsPage.jsx';
import UserList from './UserList.jsx';
import GroupList from './GroupList.jsx';
import EditGroup from './EditGroup.jsx';
import Signup from './Signup.jsx';
import AdminCheck from './AdminCheck.jsx';
import EditDrug from './EditDrug.jsx';
import Profile from './Profile.jsx';
import AdminEditUser from './AdminEditUserPage.jsx'; 
import DrugList from './DrugList.jsx';
import MyPatients from './MyPatients.jsx';
import NewGroup from './NewGroup.jsx';
import MyScripts from './MyScripts.jsx'; 
import MyReports from './MyReports.jsx'; 
import PatientReports from './PatientReports.jsx';
import PatientScripts from './PatientScripts.jsx';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-2fa" element={<VerifyCode />} />
        <Route path="/dashboard" element={<Dash />} />
        <Route path="/update-profile" element={<Profile />} />
        <Route path="/my-assignments" element={<MyTeam />} />
        <Route path="/my-prescriptions" element={<MyScripts />} />
        <Route path="/my-diagnoses" element={<MyReports />} />

        <Route path="/doctor/my-patients" element={<MyPatients />} />
        <Route path="/prescriptions/:patientId" element={<PatientScripts />} />
        <Route path="/diagnoses/:patientId" element={<PatientReports />} />

        <Route element={<AdminCheck />}>
          <Route path="/admin/register" element={<Signup />} />
          <Route path="/admin/users" element={<UserList />} />
          <Route path="/admin/create-care-team" element={<NewGroup />} />
          <Route path="/admin/users/:id" element={<AdminEditUser />} />
          <Route path="/admin/assignments" element={<GroupList />} />
          <Route path="/admin/medications" element={<DrugList />} />
          <Route path="/admin/medications/:id" element={<EditDrug />} />
          <Route path="/admin/assignments/:id" element={<EditGroup />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;