import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Location, LocationType } from '../types';
import { locationService } from '../services/api';

const Explore: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [selectedType, setSelectedType] = useState<string>(() => {
    const saved = sessionStorage.getItem('selectedType');
    sessionStorage.removeItem('selectedType'); // Clear after use
    return saved || 'all';
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    // Clear sessionStorage filter when component unmounts
    return () => {
      sessionStorage.removeItem('selectedType');
    };
  }, []);

  useEffect(() => {
    if (selectedType === 'all') {
      setFilteredLocations(locations);
    } else {
      setFilteredLocations(locations.filter(loc => loc.type.toString() === selectedType));
    }
  }, [locations, selectedType]);

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

  const getTypeLabel = (type: LocationType) => {
    switch (type) {
      case LocationType.Hotel: return 'Hotel';
      case LocationType.Restaurant: return 'Restaurant';
      case LocationType.Attraction: return 'Attraction';
      case LocationType.Taxi: return 'Taxi';
      case LocationType.SouvenirShopping: return 'Shopping';
      case LocationType.Airbnb: return 'Airbnb';
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
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
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
        padding: '3rem 2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(0,168,107,0.2)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            🌴 Explore Jamaica
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'rgba(255,255,255,0.95)',
            maxWidth: '600px'
          }}>
            Discover amazing places, authentic experiences, and hidden gems across the island
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Filter Buttons */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#333', fontWeight: '600' }}>
            Filter by Category
          </h2>
          <div style={{ 
            display: 'flex', 
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setSelectedType('all')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                border: selectedType === 'all' ? 'none' : '2px solid #e1e5e9',
                background: selectedType === 'all' ? 'linear-gradient(135deg, #00a86b, #ffd700)' : 'white',
                color: selectedType === 'all' ? 'white' : '#666',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.95rem',
                boxShadow: selectedType === 'all' ? '0 4px 15px rgba(0,168,107,0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (selectedType !== 'all') {
                  e.currentTarget.style.borderColor = '#00a86b';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseOut={(e) => {
                if (selectedType !== 'all') {
                  e.currentTarget.style.borderColor = '#e1e5e9';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              🌟 All <span style={{ 
                background: selectedType === 'all' ? 'rgba(255,255,255,0.3)' : '#f0f0f0',
                padding: '0.2rem 0.5rem',
                borderRadius: '12px',
                marginLeft: '0.5rem',
                fontSize: '0.85rem'
              }}>
                {locations.length}
              </span>
            </button>
            
            {[
              { type: '1', icon: '🏨', label: 'Hotels', enumType: LocationType.Hotel },
              { type: '2', icon: '🍽️', label: 'Restaurants', enumType: LocationType.Restaurant },
              { type: '3', icon: '🎡', label: 'Attractions', enumType: LocationType.Attraction },
              { type: '4', icon: '🚕', label: 'Taxi', enumType: LocationType.Taxi },
              { type: '5', icon: '🛍️', label: 'Shopping', enumType: LocationType.SouvenirShopping },
              { type: '6', icon: '🏠', label: 'Airbnb', enumType: LocationType.Airbnb }
            ].map(({ type, icon, label, enumType }) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  border: selectedType === type ? 'none' : '2px solid #e1e5e9',
                  background: selectedType === type ? 'linear-gradient(135deg, #00a86b, #ffd700)' : 'white',
                  color: selectedType === type ? 'white' : '#666',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  boxShadow: selectedType === type ? '0 4px 15px rgba(0,168,107,0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (selectedType !== type) {
                    e.currentTarget.style.borderColor = '#00a86b';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedType !== type) {
                    e.currentTarget.style.borderColor = '#e1e5e9';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {icon} {label} <span style={{ 
                  background: selectedType === type ? 'rgba(255,255,255,0.3)' : '#f0f0f0',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '12px',
                  marginLeft: '0.5rem',
                  fontSize: '0.85rem'
                }}>
                  {locations.filter(l => l.type === enumType).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: '#666', fontSize: '1rem' }}>
            Showing <strong>{filteredLocations.length}</strong> {filteredLocations.length === 1 ? 'location' : 'locations'}
          </p>
        </div>

        {/* Location Cards Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '2rem'
        }}>
          {filteredLocations.map((location) => (
            <div 
              key={location.id} 
              style={{
                background: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
              }}
            >
              {location.imageUrl && (
                <div style={{ 
                  height: '200px',
                  backgroundImage: `url(${location.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(255,255,255,0.95)',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    color: '#00a86b',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
                  }}>
                    {getTypeLabel(location.type)}
                  </div>
                </div>
              )}
              
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ 
                  fontSize: '1.4rem', 
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: '#333'
                }}>
                  {location.name}
                </h3>
                
                <p style={{ 
                  color: '#777', 
                  marginBottom: '0.75rem',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  📍 {location.address}
                </p>
                
                <p style={{ 
                  color: '#666', 
                  marginBottom: '1.25rem',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  height: '3em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {location.description}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid #f0f0f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>⭐</span>
                    <div>
                      <div style={{ 
                        fontWeight: 'bold',
                        color: '#ffd700',
                        fontSize: '1.1rem'
                      }}>
                        {(location.averageRating || 0).toFixed(1)}
                      </div>
                      <div style={{ 
                        fontSize: '0.75rem',
                        color: '#999'
                      }}>
                        {location.reviewCount || 0} reviews
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/location/${location.id}`}
                    style={{
                      background: 'linear-gradient(135deg, #00a86b, #ffd700)',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '25px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      boxShadow: '0 4px 15px rgba(0,168,107,0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,168,107,0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,168,107,0.3)';
                    }}
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLocations.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '0.5rem' }}>
              No Locations Found
            </h3>
            <p style={{ color: '#999', fontSize: '1.1rem' }}>
              No locations found for the selected category. Try exploring another category!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;