import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header.jsx';

const DrugList = () => {
  const [list, setList] = useState([]);
  const [n, setN] = useState(''); 
  const [d, setD] = useState(''); 
  const [desc, setDesc] = useState(''); 
  const [se, setSe] = useState(''); 

  const get = () => {
    axios.get('https://127.0.0.1:5000/api/medications', { withCredentials: true })
      .then(r => setList(r.data.data));
  };

  useEffect(() => { get(); }, []);

  const add = (e) => {
    e.preventDefault();
    axios.post('https://127.0.0.1:5000/api/medications', { name: n, dosage: d, description: desc, sideEffects: se }, { withCredentials: true })
      .then(() => {
          setN(''); setD(''); setDesc(''); setSe('');
          get();
      });
  };

  const del = (id) => {
    if(window.confirm('Sure?')) {
        axios.delete(`https://127.0.0.1:5000/api/medications/${id}`, { withCredentials: true })
        .then(get);
    }
  };

  return (
    <div>
      <Header />
      <h1>Meds</h1>
      <form onSubmit={add}>
        <input value={n} onChange={e => setN(e.target.value)} placeholder="Name" />
        <input value={d} onChange={e => setD(e.target.value)} placeholder="Dose" />
        <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Desc" />
        <input value={se} onChange={e => setSe(e.target.value)} placeholder="Effects" />
        <button>Add</button>
      </form>
      <br/>
      {list.map(m => (
        <div key={m._id}>
            {m.name} - {m.dosage} 
            <Link to={`/admin/medications/${m._id}`}> Edit </Link>
            <button onClick={() => del(m._id)}>X</button>
        </div>
      ))}
    </div>
  );
};

export default DrugList;