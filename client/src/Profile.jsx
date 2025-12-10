import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header.jsx';

const Profile = () => {
  const [n, setN] = useState('');
  const [e, setE] = useState('');
  const [oldP, setOldP] = useState('');
  const [newP, setNewP] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    axios.get('https://localhost:5000/api/auth/me', { withCredentials: true }).then(r => {
        setN(r.data.data.name);
        setE(r.data.data.email);
    });
  }, []);

  const saveInfo = (ev) => {
    ev.preventDefault();
    axios.put('https://localhost:5000/api/auth/updatedetails', { name: n, email: e }, { withCredentials: true })
      .then(() => nav('/dashboard'));
  };

  const savePass = (ev) => {
    ev.preventDefault();
    axios.put('https://localhost:5000/api/auth/updatepassword', { currentPassword: oldP, newPassword: newP }, { withCredentials: true })
      .then(() => { setOldP(''); setNewP(''); alert('Done'); });
  };

  return (
    <div>
      <Header />
      <h2>Info</h2>
      <form onSubmit={saveInfo}>
        <input value={n} onChange={e => setN(e.target.value)} />
        <input value={e} onChange={e => setE(e.target.value)} />
        <button>Update Info</button>
      </form>
      <hr/>
      <h2>Pass</h2>
      <form onSubmit={savePass}>
        <input type="password" value={oldP} onChange={e => setOldP(e.target.value)} placeholder="Old" />
        <input type="password" value={newP} onChange={e => setNewP(e.target.value)} placeholder="New" />
        <button>Update Pass</button>
      </form>
    </div>
  );
};

export default Profile;