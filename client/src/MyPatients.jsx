import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header.jsx';

const MyPatients = () => {
  const [list, setList] = useState([]);
  const [me, setMe] = useState(null);

  useEffect(() => {
    axios.get('https://localhost:5000/api/auth/me', { withCredentials: true }).then(r => setMe(r.data.data));
    axios.get('https://localhost:5000/api/care-teams/my-patients', { withCredentials: true }).then(r => setList(r.data.data));
  }, []);

  return (
    <div>
      <Header />
      <h1>Patients</h1>
      {list.map(p => (
        <div key={p._id} style={{border:'1px solid black', padding:'10px', margin:'5px'}}>
            <b>{p.name}</b> ({p.email}) <br/>
            <Link to={`/prescriptions/${p._id}`}>Scripts</Link> 
            {me && me.role === 'doctor' && (
                <span> | <Link to={`/diagnoses/${p._id}`}>Reports</Link></span>
            )}
        </div>
      ))}
    </div>
  );
};

export default MyPatients;