import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from './Header.jsx';

const PatientReports = () => {
  const { patientId } = useParams();
  const [list, setList] = useState([]);
  const [tit, setTit] = useState('');
  const [desc, setDesc] = useState('');
  const [me, setMe] = useState(null);

  const get = () => {
    axios.get(`https://localhost:5000/api/diagnoses/patient/${patientId}`, { withCredentials: true }).then(r => setList(r.data.data));
  };

  useEffect(() => {
    get();
    axios.get('https://localhost:5000/api/auth/me', { withCredentials: true }).then(r => setMe(r.data.data));
  }, [patientId]);

  const add = (e) => {
    e.preventDefault();
    axios.post('https://localhost:5000/api/diagnoses', { patientId, title: tit, description: desc }, { withCredentials: true })
      .then(() => { setTit(''); setDesc(''); get(); });
  };

  const del = (id) => {
    if(window.confirm('Del?')) {
        axios.delete(`https://localhost:5000/api/diagnoses/${id}`, { withCredentials: true }).then(get);
    }
  };

  return (
    <div>
      <Header />
      <h1>Diagnoses</h1>
      <form onSubmit={add}>
        <input value={tit} onChange={e => setTit(e.target.value)} placeholder="Title" />
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Details" />
        <button>Save</button>
      </form>
      {list.map(d => (
        <div key={d._id} style={{ border: '1px solid gray', margin: '5px' }}>
            <h3>{d.title}</h3>
            <p>{d.description}</p>
            {me && me._id === d.doctor._id && <button onClick={() => del(d._id)}>Del</button>}
        </div>
      ))}
    </div>
  );
};

export default PatientReports;