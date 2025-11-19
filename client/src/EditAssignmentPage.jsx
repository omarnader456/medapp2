import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header.jsx';

const EditAssignmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState({ doctorId: '', nurseId: '' });
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users to populate dropdowns
        const usersRes = await axios.get('http://localhost:5000/api/users', { withCredentials: true });
        setAllUsers(usersRes.data.data);

        // Fetch the specific assignment to pre-fill the form
        const assignmentRes = await axios.get('http://localhost:5000/api/care-teams', { withCredentials: true });
        const currentAssignment = assignmentRes.data.data.find(a => a._id === id);
        if (currentAssignment) {
          setAssignment({
            doctorId: currentAssignment.doctor._id,
            nurseId: currentAssignment.nurse._id
          });
        }
      } catch (err) {
        console.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const doctors = allUsers.filter(u => u.role === 'doctor');
  const nurses = allUsers.filter(u => u.role === 'nurse');

  const onChange = (e) => setAssignment({ ...assignment, [e.target.name]: e.target.value });

  const onUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/care-teams/${id}`, {
        doctor: assignment.doctorId,
        nurse: assignment.nurseId
      }, { withCredentials: true });
      alert('Assignment updated successfully!');
      navigate('/admin/assignments');
    } catch (err) {
      alert('Failed to update assignment.');
    }
  };

  const onDelete = async () => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await axios.delete(`http://localhost:5000/api/care-teams/${id}`, { withCredentials: true });
        alert('Assignment deleted successfully!');
        navigate('/admin/assignments');
      } catch (err) {
        alert('Failed to delete assignment.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <h1>Edit Assignment (ID: {id})</h1>
      <form onSubmit={onUpdate}>
        <div>
          <label>Assign Doctor: </label>
          <select name="doctorId" value={assignment.doctorId} onChange={onChange}>
            <option value="">Select a Doctor</option>
            {doctors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label>Assign Nurse: </label>
          <select name="nurseId" value={assignment.nurseId} onChange={onChange}>
            <option value="">Select a Nurse</option>
            {nurses.map(n => <option key={n._id} value={n._id}>{n.name}</option>)}
          </select>
        </div>
        <button type="submit">Update Assignment</button>
      </form>
      <hr />
      <button onClick={onDelete} style={{ backgroundColor: 'red', color: 'white' }}>Delete Assignment</button>
    </div>
  );
};

export default EditAssignmentPage;