import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header.jsx';

const GroupList = () => {
  const [list, setList] = useState([]);
  
  useEffect(() => {
    axios.get('https://localhost:5000/api/care-teams', { withCredentials: true })
      .then(r => setList(r.data.data))
      .catch(e => console.log('Err'));
  }, []);

  return (
    <div>
      <Header />
      <h1>Teams</h1>
      {list.map(g => (
        <div key={g._id} style={{ border: '1px solid #ccc', margin: '5px' }}>
          <p>Pat: {g.patient.name}</p>
          <p>Doc: {g.doctor.name}</p>
          <p>Nur: {g.nurse.name}</p>
          <Link to={'/admin/assignments/' + g._id}>Edit</Link>
        </div>
      ))}
    </div>
  );
};

export default GroupList;