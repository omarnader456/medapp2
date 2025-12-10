import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const Login = () => {
  const [mail, setMail] = useState('');
  const [pass, setPass] = useState('');
  const [txt, setTxt] = useState('');
  const nav = useNavigate();

  const go = async (e) => {
    e.preventDefault();
    setTxt('');
    
    try {
      const res = await axios.post('https://localhost:5000/api/auth/login', { email: mail, password: pass }, { withCredentials: true });

      if (res.data.need2fa) {
        nav('/verify-2fa', { state: { token: res.data.tmpToken } });
      } else {
        nav('/dashboard');
      }
    } catch (e) {
      setTxt('Bad login');
    }
  };

  return (
    <div className="login-page-container">
      <h1 className="login-title">Login</h1>
      <div className="login-form-container">
        {txt && <p style={{ color: 'red' }}>{txt}</p>}
        <form className="login-form" onSubmit={go}>
          <input type="email" placeholder="Email" value={mail} onChange={e => setMail(e.target.value)} required />
          <input type="password" placeholder="Pass" value={pass} onChange={e => setPass(e.target.value)} required />
          <button type="submit">Go</button>
        </form>
      </div>
    </div>
  );
};

export default Login;