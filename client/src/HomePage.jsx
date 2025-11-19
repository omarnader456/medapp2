import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Medical App</h1>
      <p>This is the home page.</p>
      <Link to="/login">Login</Link>
    </div>
  );
};

export default HomePage;