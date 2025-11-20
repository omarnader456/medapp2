import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from './Header.jsx';

const DoctorManageDiagnosesPage = () => {
  const { patientId } = useParams();
  const [diagnoses, setDiagnoses] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null); // ID of the diagnosis being edited
  const [editFormData, setEditFormData] = useState({ title: '', description: '' });

  const fetchDiagnoses = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/diagnoses/patient/${patientId}`, { withCredentials: true });
      setDiagnoses(res.data.data);
    } catch (err) {
      setError('Failed to load patient diagnoses.');
    }
  };

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      try {
        const userRes = await axios.get('http://localhost:5000/api/auth/me', { withCredentials: true });
        setCurrentUser(userRes.data.data);
        await fetchDiagnoses();
      } catch (err) {
        setError('Failed to load page data.');
      }
      setLoading(false);
    };
    fetchPageData();
  }, [patientId]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/diagnoses', { ...formData, patientId }, { withCredentials: true });
      setFormData({ title: '', description: '' }); // Clear form
      fetchDiagnoses(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add diagnosis.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this diagnosis?')) {
      try {
        await axios.delete(`http://localhost:5000/api/diagnoses/${id}`, { withCredentials: true });
        fetchDiagnoses(); // Refresh list
      } catch (err) {
        setError('Failed to delete diagnosis.');
      }
    }
  };

  const handleEditClick = (diagnosis) => {
    setEditingId(diagnosis._id);
    setEditFormData({ title: diagnosis.title, description: diagnosis.description });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({ title: '', description: '' });
  };

  const onEditChange = (e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value });

  const onEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/diagnoses/${editingId}`, editFormData, { withCredentials: true });
      setEditingId(null);
      fetchDiagnoses(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update diagnosis.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <h1>Manage Patient Diagnoses</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Form for doctor to add a new diagnosis */}
      <form onSubmit={onSubmit} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h3>Add New Diagnosis</h3>
        <div>
          <input name="title" value={formData.title} onChange={onChange} placeholder="Diagnosis Title" required />
        </div>
        <div>
          <textarea name="description" value={formData.description} onChange={onChange} placeholder="Detailed description..." required style={{ width: '300px', height: '100px' }} />
        </div>
        <button type="submit">Add Diagnosis</button>
      </form>

      {/* List of existing diagnoses */}
      <h2>Existing Diagnoses</h2>
      {diagnoses.length === 0 ? (
        <p>This patient has no diagnoses on record.</p>
      ) : (
        diagnoses.map(diag =>
          editingId === diag._id ? (
            // EDITING VIEW
            <form key={diag._id} onSubmit={onEditSubmit} style={{ border: '2px solid blue', margin: '10px', padding: '10px' }}>
              <h3>Editing Diagnosis</h3>
              <input name="title" value={editFormData.title} onChange={onEditChange} />
              <textarea name="description" value={editFormData.description} onChange={onEditChange} style={{ width: '300px', height: '100px' }} />
              <button type="submit">Save</button>
              <button type="button" onClick={handleCancelEdit}>Cancel</button>
            </form>
          ) : (
            // DISPLAY VIEW
            <div key={diag._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <h3>{diag.title}</h3>
              <p><strong>Diagnosed by:</strong> Dr. {diag.doctor.name}</p>
              <p><strong>Date:</strong> {new Date(diag.date).toLocaleDateString()}</p>
              <p>{diag.description}</p>
              {/* Only show edit/delete buttons if the logged-in doctor is the one who created the diagnosis */}
              {currentUser && currentUser._id === diag.doctor._id && (
                <div>
                  <button onClick={() => handleEditClick(diag)}>Edit</button>
                  <button onClick={() => handleDelete(diag._id)} style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px' }}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          )
        )
      )}
    </div>
  );
};

export default DoctorManageDiagnosesPage;