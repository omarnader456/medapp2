import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyCode = () => {
  const [c, setC] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();
  const loc = useLocation();
  
  const tok = loc.state && loc.state.token;

  const send = async (e) => {
    e.preventDefault();
    if (!tok) { setErr('Expired'); return; }
    
    try {
      await axios.post('https://127.0.0.1:5000/api/auth/verify-2fa', { twoFactorToken: tok, token: c }, { withCredentials: true });
      nav('/dashboard');
    } catch (e) {
      setErr('Wrong code');
    }
  };

  return (
    <div>
      <h1>Enter Code</h1>
      {err && <p style={{ color: 'red' }}>{err}</p>}
      <form onSubmit={send}>
        <input value={c} onChange={e => setC(e.target.value)} placeholder="123456" />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default VerifyCode;