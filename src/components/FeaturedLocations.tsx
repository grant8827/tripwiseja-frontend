import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Location, LocationType } from '../types';
import { locationService } from '../services/api';

const FeaturedLocations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedLocations = async () => {
      try {
        const data = await locationService.getFeatured();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching featured locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedLocations();
  }, []);

  const getLocationTypeText = (type: LocationType) => {
    switch (type) {
      case LocationType.Hotel: return 'Hotel';
      case LocationType.Restaurant: return 'Restaurant';
      case LocationType.Attraction: return 'Attraction';
      default: return 'Location';
    }
  };

  const getTypeIcon = (type: LocationType) => {
    switch (type) {
      case LocationType.Hotel: return '🏨';
      case LocationType.Restaurant: return '🍽️';
      case LocationType.Attraction: return '🏖️';
      default: return '📍';
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading featured locations...</div>;

  return (
    <section style={{ padding: '4rem 2rem', background: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', color: '#333' }}>
          ⭐ Featured Locations
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '2rem' 
        }}>
          {locations.map((location) => (
            <Link 
              key={location.id}
              to={`/locations/${location.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
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
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              }}>
                <div style={{
                  height: '200px',
                  backgroundImage: location.imageUrl ? `url(${location.imageUrl})` : 'linear-gradient(135deg, #00a86b, #ffd700)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {getTypeIcon(location.type)} {getLocationTypeText(location.type)}
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(255,215,0,0.9)',
                    color: '#333',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    ⭐ {location.averageRating.toFixed(1)}
                  </div>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#333' }}>
                    {location.name}
                  </h3>
                  <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    📍 {location.address}
                  </p>
                  {location.vendor && (
                    <p style={{ 
                      color: '#00a86b', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold',
                      background: 'rgba(0,168,107,0.1)',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '15px',
                      display: 'inline-block'
                    }}>
                      By {location.vendor.businessName}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedLocations;