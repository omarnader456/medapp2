import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header.jsx';

const AdminMedicationsPage = () => {
  const [medications, setMedications] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    description: '',
    sideEffects: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMedications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/medications', { withCredentials: true });
      setMedications(res.data.data);
    } catch (err) {
      setError('Failed to fetch medications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/medications', formData, { withCredentials: true });
      setFormData({ name: '', dosage: '', description: '', sideEffects: '' }); 
      fetchMedications(); 
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create medication.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        await axios.delete(`http://localhost:5000/api/medications/${id}`, { withCredentials: true });
        fetchMedications(); 
      } catch (err) {
        setError('Failed to delete medication.');
      }
    }
  };

  if (loading) return <div>Loading medications...</div>;

  return (
    <div>
      <Header />
      <h1>Manage Medications</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {}
      <form onSubmit={onSubmit} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h3>Add New Medication</h3>
        <input name="name" value={formData.name} onChange={onChange} placeholder="Name" required />
        <input name="dosage" value={formData.dosage} onChange={onChange} placeholder="Dosage" required />
        <input name="description" value={formData.description} onChange={onChange} placeholder="Description" required />
        <input name="sideEffects" value={formData.sideEffects} onChange={onChange} placeholder="Side Effects" />
        <button type="submit">Add Medication</button>
      </form>

      {}
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Dosage</th>
            <th>Description</th>
            <th>Side Effects</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {medications.map((med) => (
            <tr key={med._id}>
              <td>{med.name}</td>
              <td>{med.dosage}</td>
              <td>{med.description}</td>
              <td>{med.sideEffects}</td>
              <td>
                <Link to={`/admin/medications/${med._id}`} style={{ marginRight: '10px' }}>
                  Edit
                </Link>
                <button onClick={() => handleDelete(med._id)} style={{ backgroundColor: 'red', color: 'white' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminMedicationsPage;