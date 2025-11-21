import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header.jsx';

const EditMedicationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    description: '',
    sideEffects: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMedication = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/medications', { withCredentials: true });
        const medicationToEdit = res.data.data.find(med => med._id === id);

        if (medicationToEdit) {
          setFormData(medicationToEdit);
        } else {
          setError('Medication not found.');
        }
      } catch (err) {
        setError('Failed to fetch medication data.');
      } finally {
        setLoading(false);
      }
    };
    fetchMedication();
  }, [id]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.put(`http://localhost:5000/api/medications/${id}`, formData, { withCredentials: true });
      alert('Medication updated successfully!');
      navigate('/admin/medications');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update medication.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Header />
      <h1>Edit Medication</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>Name: </label>
          <input name="name" value={formData.name} onChange={onChange} required />
        </div>
        <div>
          <label>Dosage: </label>
          <input name="dosage" value={formData.dosage} onChange={onChange} required />
        </div>
        <div>
          <label>Description: </label>
          <textarea name="description" value={formData.description} onChange={onChange} required style={{ width: '300px', height: '100px' }} />
        </div>
        <div>
          <label>Side Effects: </label>
          <textarea name="sideEffects" value={formData.sideEffects} onChange={onChange} style={{ width: '300px', height: '100px' }} />
        </div>
        <button type="submit">Update Medication</button>
      </form>
    </div>
  );
};

export default EditMedicationPage;