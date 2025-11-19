import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header.jsx';

const MyAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/care-teams/my-assignments', {
          withCredentials: true,
        });
        setAssignments(res.data.data);
      } catch (err) {
        console.error('Failed to fetch assignments');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  if (loading) return <div>Loading assignments...</div>;

  return (
    <div>
      <Header />
      <h1>My Care Team Assignments</h1>
      {assignments.length === 0 ? (
        <p>You are not currently part of any care team.</p>
      ) : (
        assignments.map((team) => (
          <div key={team._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h3>Patient: {team.patient.name}</h3>
            <p>Doctor: {team.doctor.name} ({team.doctor.email})</p>
            <p>Nurse: {team.nurse.name} ({team.nurse.email})</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyAssignmentsPage;