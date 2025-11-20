import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from './Header.jsx';

const ManagePrescriptionsPage = () => {
  const { patientId } = useParams();
  const [prescriptions, setPrescriptions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [formData, setFormData] = useState({ medicationId: '', time: '' });
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPageData = async () => {
    setLoading(true);
    try {
      // Fetch existing prescriptions for this patient
      const presRes = await axios.get(`http://localhost:5000/api/prescriptions/patient/${patientId}`, { withCredentials: true });
      setPrescriptions(presRes.data.data);

      // Fetch all available medications to populate the dropdown
      const medRes = await axios.get('http://localhost:5000/api/medications', { withCredentials: true });
      setMedications(medRes.data.data);

      // Fetch current user to check their role
      const userRes = await axios.get('http://localhost:5000/api/auth/me', { withCredentials: true });
      setCurrentUser(userRes.data.data);
    } catch (err) {
      setError('Failed to load prescription data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, [patientId]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/prescriptions', {
        patientId,
        medicationId: formData.medicationId,
        time: formData.time,
      }, { withCredentials: true });

      setFormData({ medicationId: '', time: '' }); // Clear form
      fetchPageData(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create prescription.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <h1>Manage Prescriptions for Patient</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Form to add new prescription - ONLY shown to doctors */}
      {currentUser && currentUser.role === 'doctor' && (
        <form onSubmit={onSubmit} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>Add New Prescription</h3>
          <div>
            <label>Medication: </label>
            <select name="medicationId" value={formData.medicationId} onChange={onChange} required>
              <option value="">Select a Medication</option>
              {medications.map(med => <option key={med._id} value={med._id}>{med.name} ({med.dosage})</option>)}
            </select>
          </div>
          <div>
            <label>Time: </label>
            <input name="time" value={formData.time} onChange={onChange} placeholder="e.g., Morning, 8:00 AM" required />
          </div>
          <button type="submit">Add Prescription</button>
        </form>
      )}

      {/* Table of existing prescriptions */}
      <h2>Current Prescriptions</h2>
      {prescriptions.length === 0 ? (
        <p>This patient has no active prescriptions.</p>
      ) : (
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Medication</th>
              <th>Dosage</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((pres) => (
              <tr key={pres._id}>
                <td>{pres.medication.name}</td>
                <td>{pres.medication.dosage}</td>
                <td>{pres.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManagePrescriptionsPage;