import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header.jsx';

const Profile = () => {
  const [n, setN] = useState('');
  const [e, setE] = useState('');
  const [oldP, setOldP] = useState('');
  const [newP, setNewP] = useState('');
  const [is2FA, setIs2FA] = useState(false); // State for 2FA
  const nav = useNavigate();

  useEffect(() => {
    // Fetch profile and 2FA status
    axios.get('https://127.0.0.1:5000/api/auth/me', { withCredentials: true })
      .then(r => {
        setN(r.data.data.name);
        setE(r.data.data.email);
        setIs2FA(r.data.data.twoFactorEnabled); // Set toggle
      })
      .catch(() => console.log('Error loading data'));
  }, []);

  const saveInfo = (ev) => {
    ev.preventDefault();
    axios.put('https://127.0.0.1:5000/api/auth/updatedetails', { name: n, email: e }, { withCredentials: true })
      .then(() => { alert('Updated'); nav('/dashboard'); });
  };

  const savePass = (ev) => {
    ev.preventDefault();
    axios.put('https://127.0.0.1:5000/api/auth/updatepassword', { currentPassword: oldP, newPassword: newP }, { withCredentials: true })
      .then(() => { setOldP(''); setNewP(''); alert('Password Changed'); })
      .catch(() => alert('Failed'));
  };

  // Logic to toggle 2FA
  const toggle2FA = () => {
    axios.post('https://127.0.0.1:5000/api/auth/enable-2fa', {}, { withCredentials: true })
      .then(r => {
        setIs2FA(r.data.status);
        alert(r.data.status ? '2FA is now ON' : '2FA is now OFF');
      })
      .catch(() => alert('Error toggling 2FA'));
  };

  return (
    <div>
      <Header />
      
      {/* New Security Section */}
      <div style={{ border: '1px solid #ccc', padding: '15px', margin: '20px 0' }}>
        <h2>Security Settings</h2>
        <p>Two-Factor Authentication: <strong>{is2FA ? 'ENABLED' : 'DISABLED'}</strong></p>
        <button 
          onClick={toggle2FA} 
          style={{ backgroundColor: is2FA ? 'red' : 'green', color: 'white' }}
        >
          {is2FA ? 'Disable 2FA' : 'Enable 2FA'}
        </button>
      </div>

      <hr/>

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