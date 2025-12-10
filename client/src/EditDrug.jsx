import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header.jsx';

const EditMedicationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [description, setDescription] = useState('');
  const [sideEffects, setSideEffects] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    axios.get('https://localhost:5000/api/medications', { withCredentials: true })
      .then(res => {
        const found = res.data.data.find(m => m._id === id);
        if (found) {
            setName(found.name);
            setDosage(found.dosage);
            setDescription(found.description);
            setSideEffects(found.sideEffects);
        } else {
            setErrorMsg('Medication not found.');
        }
        setLoading(false);
      })
      .catch(err => {
        setErrorMsg('Error loading data.');
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    const body = {
        name: name,
        dosage: dosage,
        description: description,
        sideEffects: sideEffects
    };

    try {
      await axios.put(`https://localhost:5000/api/medications/${id}`, body, { withCredentials: true });
      alert('Updated successfully!');
      navigate('/admin/medications');
    } catch (err) {
      setErrorMsg('Failed to update.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (errorMsg) return <div>Error: {errorMsg}</div>;

  return (
    <div>
      <Header />
      <h1>Edit Medication</h1>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Name: </label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Dosage: </label>
          <input value={dosage} onChange={(e) => setDosage(e.target.value)} required />
        </div>
        <div>
          <label>Description: </label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '300px', height: '100px' }} />
        </div>
        <div>
          <label>Side Effects: </label>
          <textarea value={sideEffects} onChange={(e) => setSideEffects(e.target.value)} style={{ width: '300px', height: '100px' }} />
        </div>
        <button type="submit">Update Medication</button>
      </form>
    </div>
  );
};

export default EditMedicationPage;