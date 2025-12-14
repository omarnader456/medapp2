import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header.jsx';

const MyAssignmentsPage = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://127.0.0.1:5000/api/care-teams/my-assignments', { withCredentials: true })
      .then((res) => {
        setList(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error loading assignments");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <h1>My Care Team Assignments</h1>
      
      {list.length === 0 ? (
        <p>You are not currently part of any care team.</p>
      ) : (
        list.map((item) => (
          <div key={item._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h3>Patient: {item.patient.name}</h3>
            <p>Doctor: {item.doctor.name} ({item.doctor.email})</p>
            <p>Nurse: {item.nurse.name} ({item.nurse.email})</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyAssignmentsPage;