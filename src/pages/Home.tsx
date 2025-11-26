import React from 'react';
import Hero from '../components/Hero';
import CategoryCards from '../components/CategoryCards';
import FeaturedLocations from '../components/FeaturedLocations';

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <CategoryCards />
      <FeaturedLocations />
      
      {/* Features Section */}
      <section style={{ padding: '4rem 2rem', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', color: '#333' }}>
            Why Choose TripWise Jamaica?
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem' 
          }}>
            <div style={{ padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#333' }}>Verified Reviews</h3>
              <p style={{ color: '#666' }}>Real reviews from real travelers to help you make the best choices</p>
            </div>
            <div style={{ padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#333' }}>Local Businesses</h3>
              <p style={{ color: '#666' }}>Support local Jamaican entrepreneurs and discover authentic experiences</p>
            </div>
            <div style={{ padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#333' }}>Easy Booking</h3>
              <p style={{ color: '#666' }}>Simple and secure booking process for all your Jamaica adventures</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #00a86b, #ffd700)', 
        padding: '4rem 2rem', 
        color: 'white', 
        textAlign: 'center' 
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Ready to Explore Jamaica?</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
            Join thousands of travelers discovering the best of Jamaica
          </p>
          <button style={{
            background: 'white',
            color: '#00a86b',
            padding: '1rem 2rem',
            borderRadius: '50px',
            border: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>
            Start Exploring
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;