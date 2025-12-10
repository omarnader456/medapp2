import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header.jsx';

const UserList = () => {
  const [list, setList] = useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    axios.get('https://localhost:5000/api/users', { withCredentials: true })
      .then(res => {
        setList(res.data.data);
        setLoad(false);
      })
      .catch(() => setLoad(false));
  }, []);

  if (load) return <div>Wait...</div>;

  return (
    <div>
      <Header />
      <h1>Users</h1>
      <table border="1">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Opt</th></tr>
        </thead>
        <tbody>
          {list.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td><Link to={'/admin/users/' + u._id}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;