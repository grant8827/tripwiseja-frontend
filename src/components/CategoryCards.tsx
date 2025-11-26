import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCards: React.FC = () => {
  const categories = [
    {
      type: 'Hotels',
      icon: '🏨',
      description: 'Luxury resorts to cozy guesthouses',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      count: '200+'
    },
    {
      type: 'Restaurants',
      icon: '🍽️',
      description: 'Authentic Jamaican cuisine & international flavors',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      count: '150+'
    },
    {
      type: 'Attractions',
      icon: '🏖️',
      description: 'Beaches, waterfalls, and cultural sites',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      count: '100+'
    },
    {
      type: 'Taxi',
      icon: '🚕',
      description: 'Reliable transportation across the island',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      count: '50+'
    },
    {
      type: 'Shopping',
      icon: '🛍️',
      description: 'Authentic souvenirs and local crafts',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      count: '75+'
    },
    {
      type: 'Airbnb',
      icon: '🏡',
      description: 'Unique stays and local experiences',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      count: '120+'
    }
  ];

  return (
    <section style={{ padding: '4rem 2rem', background: '#f8f9fa' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', color: '#333' }}>
          Explore by Category
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          {categories.map((category, index) => (
            <Link 
              key={index}
              to={category.type === 'Shopping' ? '/explore' : `/explore`}
              style={{ textDecoration: 'none', color: 'inherit' }}
              onClick={() => {
                // Set filter based on category type
                const typeMap: {[key: string]: string} = {
                  'Hotels': '1',
                  'Restaurants': '2', 
                  'Attractions': '3',
                  'Taxi': '4',
                  'Shopping': '5',
                  'Airbnb': '6'
                };
                sessionStorage.setItem('selectedType', typeMap[category.type] || 'all');
              }}
            >
              <div style={{
                background: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              }}>
                <div style={{
                  height: '200px',
                  backgroundImage: `url(${category.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(0,168,107,0.9)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {category.count}
                  </div>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ 
                    fontSize: '1.5rem', 
                    marginBottom: '0.5rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem' 
                  }}>
                    <span style={{ fontSize: '2rem' }}>{category.icon}</span>
                    {category.type}
                  </h3>
                  <p style={{ color: '#666', lineHeight: '1.6' }}>{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;