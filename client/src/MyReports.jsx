import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header.jsx';

const PatientDiagnosesPage = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const userRes = await axios.get('https://localhost:5000/api/auth/me', { withCredentials: true });
        const user = userRes.data.data;

        const diagRes = await axios.get(`https://localhost:5000/api/diagnoses/patient/${user._id}`, { withCredentials: true });
        setDiagnoses(diagRes.data.data);
        
      } catch (err) {
        setErrorMsg('Failed to load diagnoses.');
      }
      setLoading(false);
    };
    getData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <h1>My Medical Diagnoses</h1>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      
      {diagnoses.length === 0 ? (
        <p>You have no diagnoses on record.</p>
      ) : (
        diagnoses.map(d => (
          <div key={d._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h3>{d.title}</h3>
            <p><strong>Diagnosed by:</strong> Dr. {d.doctor.name}</p>
            <p><strong>Date:</strong> {new Date(d.date).toLocaleDateString()}</p>
            <p>{d.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default PatientDiagnosesPage;