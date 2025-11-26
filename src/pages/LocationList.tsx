import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Location, LocationType } from '../types';
import { locationService } from '../services/api';

const LocationList: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await locationService.getAll();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const getLocationTypeText = (type: LocationType) => {
    switch (type) {
      case LocationType.Hotel: return 'Hotel';
      case LocationType.Restaurant: return 'Restaurant';
      case LocationType.Attraction: return 'Attraction';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#666', fontSize: '1.2rem' }}>Loading locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '3rem' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #00a86b 0%, #ffd700 100%)',
        padding: '4rem 2rem',
        marginBottom: '3rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '0.5rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            All Locations
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.95)', 
            fontSize: '1.2rem' 
          }}>
            Explore {locations.length} amazing places in Jamaica 🇯🇲
          </p>
        </div>
      </div>

      {/* Location Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        {locations.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '4rem 2rem',
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏝️</div>
            <h2 style={{ color: '#333', marginBottom: '0.5rem' }}>No Locations Yet</h2>
            <p style={{ color: '#999', fontSize: '1.1rem' }}>Check back soon for amazing places to explore!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {locations.map(loc => (
              <div 
                key={loc.id}
                style={{
                  background: 'white',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,168,107,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
                }}
              >
                {/* Location Image */}
                <div style={{
                  height: '200px',
                  backgroundImage: loc.imageUrl 
                    ? `url(${loc.imageUrl})`
                    : 'linear-gradient(135deg, #00a86b 0%, #ffd700 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {!loc.imageUrl && (
                    <span style={{ fontSize: '4rem' }}>🏝️</span>
                  )}
                </div>

                {/* Location Info */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Link 
                    to={`/locations/${loc.id}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                  >
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#333',
                      marginBottom: '0.5rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#00a86b'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#333'}
                    >
                      {loc.name}
                    </h3>
                  </Link>
                  
                  <div style={{
                    display: 'inline-block',
                    background: '#00a86b',
                    color: 'white',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '15px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    width: 'fit-content'
                  }}>
                    {getLocationTypeText(loc.type)}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#999',
                    fontSize: '0.9rem',
                    marginBottom: '1rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    <span>📍</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {loc.address}
                    </span>
                  </div>

                  {/* Rating */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: '#fafafa',
                    borderRadius: '8px',
                    marginTop: 'auto'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#ffd700', fontSize: '1.1rem' }}>⭐</span>
                      <span style={{ fontWeight: 'bold', color: '#333', fontSize: '1.05rem' }}>
                        {loc.averageRating ? loc.averageRating.toFixed(1) : '0.0'}
                      </span>
                    </div>
                    <span style={{ color: '#999', fontSize: '0.9rem' }}>
                      {loc.reviewCount || 0} {loc.reviewCount === 1 ? 'review' : 'reviews'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationList;