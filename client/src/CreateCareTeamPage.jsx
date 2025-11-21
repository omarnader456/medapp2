import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header.jsx';

const CreateCareTeamPage = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    nurseId: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users', { withCredentials: true });
        setUsers(res.data.data);
      } catch (err) {
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const { patientId, doctorId, nurseId } = formData;

  const patients = users.filter(user => user.role === 'patient');
  const doctors = users.filter(user => user.role === 'doctor');
  const nurses = users.filter(user => user.role === 'nurse');

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!patientId || !doctorId || !nurseId) {
      return setError('Please select a patient, doctor, and nurse.');
    }

    try {
      await axios.post('http://localhost:5000/api/care-teams', formData, { withCredentials: true });
      setSuccess('Care team created successfully!');
      setFormData({ patientId: '', doctorId: '', nurseId: '' }); 
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create care team.');
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <Header />
      <h1>Create New Care Team</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Select Patient: </label>
          <select name="patientId" value={patientId} onChange={onChange} required>
            <option value="">-- Select Patient --</option>
            {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label>Select Doctor: </label>
          <select name="doctorId" value={doctorId} onChange={onChange} required>
            <option value="">-- Select Doctor --</option>
            {doctors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label>Select Nurse: </label>
          <select name="nurseId" value={nurseId} onChange={onChange} required>
            <option value="">-- Select Nurse --</option>
            {nurses.map(n => <option key={n._id} value={n._id}>{n.name}</option>)}
          </select>
        </div>
        <button type="submit">Create Team</button>
      </form>
    </div>
  );
};

export default CreateCareTeamPage;