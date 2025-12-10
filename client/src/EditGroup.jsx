import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header.jsx';

const EditAssignmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [docId, setDocId] = useState('');
  const [nurseId, setNurseId] = useState('');
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await axios.get('https://localhost:5000/api/users', { withCredentials: true });
        setUsers(userRes.data.data);

        const teamRes = await axios.get('https://localhost:5000/api/care-teams', { withCredentials: true });
        const list = teamRes.data.data;
        
        const found = list.find(item => item._id === id);
        
        if (found) {
          setDocId(found.doctor._id);
          setNurseId(found.nurse._id);
        }
        
      } catch (err) {
        console.log('Error loading data');
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  const doctors = users.filter(u => u.role === 'doctor');
  const nurses = users.filter(u => u.role === 'nurse');

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const body = {
          doctor: docId,
          nurse: nurseId
      };
      await axios.put(`https://localhost:5000/api/care-teams/${id}`, body, { withCredentials: true });
      alert('Saved!');
      navigate('/admin/assignments');
    } catch (err) {
      alert('Error updating assignment.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this assignment?')) {
      try {
        await axios.delete(`https://localhost:5000/api/care-teams/${id}`, { withCredentials: true });
        navigate('/admin/assignments');
      } catch (err) {
        alert('Error deleting.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <h1>Edit Assignment</h1>
      <form onSubmit={handleSave}>
        <div>
          <label>Assign Doctor: </label>
          <select value={docId} onChange={(e) => setDocId(e.target.value)}>
            <option value="">Select Doctor</option>
            {doctors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label>Assign Nurse: </label>
          <select value={nurseId} onChange={(e) => setNurseId(e.target.value)}>
            <option value="">Select Nurse</option>
            {nurses.map(n => <option key={n._id} value={n._id}>{n.name}</option>)}
          </select>
        </div>
        <button type="submit">Update Assignment</button>
      </form>
      <hr />
      <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>
        Delete Assignment
      </button>
    </div>
  );
};

export default EditAssignmentPage;