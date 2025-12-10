import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header.jsx'; 

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    
    if (!role) { setErr('Role?'); return; }

    try {
      const data = { name, email, password, role };
      await axios.post('https://localhost:5000/api/auth/register', data, { withCredentials: true });
      setMsg(`Made user: ${name}`);
      setName(''); setEmail(''); setPassword('');
    } catch (e) {
      setErr('Failed.');
    }
  };

  return (
    <div>
      <Header />
      <h1>New User</h1>
      {err && <p style={{ color: 'red' }}>{err}</p>}
      {msg && <p style={{ color: 'green' }}>{msg}</p>}

      <form onSubmit={submit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Pass" required />
        <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
            <option value="admin">Admin</option>
        </select>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default Signup;