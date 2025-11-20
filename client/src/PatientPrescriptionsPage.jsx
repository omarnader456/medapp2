import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header.jsx';

const PatientPrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyPrescriptions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/prescriptions/my-prescriptions', { withCredentials: true });
        setPrescriptions(res.data.data);
      } catch (err) {
        setError('Failed to load your prescriptions.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyPrescriptions();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <h1>My Medication Schedule</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
              <tr key={p._id}><td>{p.medication.name}</td><td>{p.medication.dosage}</td><td>{p.time}</td><td>{p.medication.description}</td><td>{p.medication.sideEffects}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientPrescriptionsPage;