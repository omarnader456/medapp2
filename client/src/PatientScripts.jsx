import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from './Header.jsx';

const PatientScripts = () => {
  const { patientId } = useParams();
  const [list, setList] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [sel, setSel] = useState('');
  const [time, setTime] = useState('');
  const [me, setMe] = useState(null);

  const refresh = () => {
    axios.get(`https://127.0.0.1:5000/api/prescriptions/patient/${patientId}`, { withCredentials: true }).then(r => setList(r.data.data));
  };

  useEffect(() => {
    refresh();
    axios.get('https://127.0.0.1:5000/api/medications', { withCredentials: true }).then(r => setDrugs(r.data.data));
    axios.get('https://127.0.0.1:5000/api/auth/me', { withCredentials: true }).then(r => setMe(r.data.data));
  }, [patientId]);

  const add = (e) => {
    e.preventDefault();
    axios.post('https://127.0.0.1:5000/api/prescriptions', { patientId, medicationId: sel, time }, { withCredentials: true })
      .then(() => { setSel(''); setTime(''); refresh(); });
  };

  return (
    <div>
      <Header />
      <h1>Scripts</h1>
      {me && me.role === 'doctor' && (
        <form onSubmit={add}>
            <select value={sel} onChange={e => setSel(e.target.value)}>
                <option value="">Pick Drug</option>
                {drugs.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
            <input value={time} onChange={e => setTime(e.target.value)} placeholder="Time" />
            <button>Give</button>
        </form>
      )}
      <ul>
        {list.map(x => <li key={x._id}>{x.medication.name} - {x.time}</li>)}
      </ul>
    </div>
  );
};

export default PatientScripts;