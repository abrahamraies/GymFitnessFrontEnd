import React from 'react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        backgroundColor: '#282c34',
        color: 'white',
      }}
    >
      <h1 style={{ margin: 0 }}>Gym & Fitness Guide</h1>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Home
        </Link>
        <Link to="/test" style={{ color: 'white', textDecoration: 'none' }}>
          Test
        </Link>
        <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>
          About
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
