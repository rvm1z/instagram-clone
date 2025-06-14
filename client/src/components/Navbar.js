import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ padding: 10, borderBottom: '1px solid #ccc', marginBottom: 20 }}>
      <Link to="/" style={{ marginRight: 15 }}>Feed</Link>
      {token ? (
        <>
          <Link to="/create-post" style={{ marginRight: 15 }}>Create Post</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: 15 }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
