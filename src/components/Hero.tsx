import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section style={{
      background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '800px', padding: '2rem' }}>
        <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          Discover Jamaica's Hidden Gems
        </h2>
        <p style={{ fontSize: '1.3rem', marginBottom: '2rem', opacity: 0.9 }}>
          Find the best hotels, restaurants, and attractions across the beautiful island of Jamaica
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/locations" style={{
            background: '#00a86b',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '50px',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(0,168,107,0.3)',
            transition: 'transform 0.3s ease'
          }}>
            🔍 Explore Now
          </Link>
          <Link to="/vendor-register" style={{
            background: 'transparent',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '50px',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            border: '2px solid white',
            transition: 'all 0.3s ease'
          }}>
            🏢 List Your Business
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;