import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header.jsx';

const NewGroup = () => {
  const [users, setUsers] = useState([]);
  const [pat, setPat] = useState('');
  const [doc, setDoc] = useState('');
  const [nur, setNur] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios.get('https://127.0.0.1:5000/api/users', { withCredentials: true })
      .then(r => setUsers(r.data.data));
  }, []);

  const pats = users.filter(u => u.role === 'patient');
  const docs = users.filter(u => u.role === 'doctor');
  const nurs = users.filter(u => u.role === 'nurse');

  const save = async (e) => {
    e.preventDefault();
    if (!pat || !doc || !nur) { setMsg('Select all'); return; }
    
    try {
      await axios.post('https://127.0.0.1:5000/api/care-teams', { patientId: pat, doctorId: doc, nurseId: nur }, { withCredentials: true });
      setMsg('Done');
      setPat(''); setDoc(''); setNur('');
    } catch (e) { setMsg('Fail'); }
  };

  return (
    <div>
      <Header />
      <h1>New Team</h1>
      <p>{msg}</p>
      <form onSubmit={save}>
        <select value={pat} onChange={e => setPat(e.target.value)}>
            <option value="">Patient</option>
            {pats.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>
        <select value={doc} onChange={e => setDoc(e.target.value)}>
            <option value="">Doctor</option>
            {docs.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>
        <select value={nur} onChange={e => setNur(e.target.value)}>
            <option value="">Nurse</option>
            {nurs.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>
        <button>Save</button>
      </form>
    </div>
  );
};

export default NewGroup;