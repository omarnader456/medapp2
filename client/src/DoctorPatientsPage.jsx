import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header.jsx';

const DoctorPatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const [userRes, patientsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/auth/me', { withCredentials: true }),
          axios.get('http://localhost:5000/api/care-teams/my-patients', { withCredentials: true })
        ]);
        setCurrentUser(userRes.data.data);
        setPatients(patientsRes.data.data);
      } catch (err) {
        console.error('Failed to fetch patients');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  if (loading) return <div>Loading patients...</div>;

  return (
    <div>
      <Header />
      <h1>My Assigned Patients</h1>
      {patients.length === 0 ? (
        <p>You have no patients assigned to you.</p>
      ) : (
        patients.map((patient) => (
          <div key={patient._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h3>{patient.name}</h3>
            <p>Email: {patient.email}</p>
            <Link to={`/prescriptions/${patient._id}`}>Manage Prescriptions</Link>
            {}
            {currentUser && currentUser.role === 'doctor' && <span> | <Link to={`/diagnoses/${patient._id}`}>Manage Diagnoses</Link></span>}
          </div>
        ))
      )}
    </div>
  );
};

export default DoctorPatientsPage;