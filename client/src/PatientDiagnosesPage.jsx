import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header.jsx';

const PatientDiagnosesPage = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const userRes = await axios.get('http://localhost:5000/api/auth/me', { withCredentials: true });
        const currentUser = userRes.data.data;

        const diagnosesRes = await axios.get(`http://localhost:5000/api/diagnoses/patient/${currentUser._id}`, { withCredentials: true });
        setDiagnoses(diagnosesRes.data.data);
      } catch (err) {
        setError('Failed to load your medical diagnoses.');
      } finally {
        setLoading(false);
      }
    };
    fetchDiagnoses();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <h1>My Medical Diagnoses</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {diagnoses.length === 0 ? (
        <p>You have no diagnoses on record.</p>
      ) : (
        diagnoses.map(diag => (
          <div key={diag._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h3>{diag.title}</h3>
            <p><strong>Diagnosed by:</strong> Dr. {diag.doctor.name}</p>
            <p><strong>Date:</strong> {new Date(diag.date).toLocaleDateString()}</p>
            <p>{diag.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default PatientDiagnosesPage;