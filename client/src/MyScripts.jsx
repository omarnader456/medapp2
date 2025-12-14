import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header.jsx';

const PatientPrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get('https://127.0.0.1:5000/api/prescriptions/my-prescriptions', { withCredentials: true });
        setPrescriptions(res.data.data);
      } catch (err) {
        setErrorMsg('Failed to load your prescriptions.');
      }
      setLoading(false);
    };
    getData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <h1>My Medication Schedule</h1>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      
      {prescriptions.length === 0 ? (
        <p>You have no prescriptions assigned to you.</p>
      ) : (
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Medication</th>
              <th>Dosage</th>
              <th>Time</th>
              <th>Description</th>
              <th>Side Effects</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map(p => (
              <tr key={p._id}>
                <td>{p.medication.name}</td>
                <td>{p.medication.dosage}</td>
                <td>{p.time}</td>
                <td>{p.medication.description}</td>
                <td>{p.medication.sideEffects}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientPrescriptionsPage;