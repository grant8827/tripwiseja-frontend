import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Booking } from '../types';
import { bookingService, userService } from '../services/api';

const UserDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/user-login');
      return;
    }

    const fetchData = async () => {
      try {
        const [userBookings, userDetails] = await Promise.all([
          bookingService.getUserBookings(parseInt(userId)),
          userService.getById(parseInt(userId))
        ]);

        setBookings(userBookings);
        setUserName(`${userDetails.firstName} ${userDetails.lastName}`);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate]);

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'Cancelled' } : b
      ));
      alert('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    }
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#ffa500';
      case 'Confirmed': return '#00a86b';
      case 'Cancelled': return '#dc3545';
      case 'Completed': return '#6c757d';
      default: return '#333';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return '⏳';
      case 'Confirmed': return '✅';
      case 'Cancelled': return '❌';
      case 'Completed': return '✓';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
        <p style={{ color: '#666', fontSize: '1.2rem' }}>Loading your dashboard...</p>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending');
  const pastBookings = bookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled');

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        marginBottom: '2rem',
        padding: '2rem',
        background: 'linear-gradient(135deg, #00a86b, #ffd700)',
        borderRadius: '15px',
        color: 'white',
        boxShadow: '0 10px 30px rgba(0,168,107,0.3)'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          🏝️ My Travel Dashboard
        </h1>
        <p style={{ opacity: 0.95, fontSize: '1.1rem' }}>Welcome back, {userName}!</p>
      </div>

      {/* Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
          <h3 style={{ fontSize: '2rem', color: '#00a86b', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            {upcomingBookings.length}
          </h3>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Upcoming Trips</p>
        </div>
        
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎯</div>
          <h3 style={{ fontSize: '2rem', color: '#ffd700', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            {bookings.length}
          </h3>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Total Bookings</p>
        </div>
        
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✓</div>
          <h3 style={{ fontSize: '2rem', color: '#2196f3', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            {bookings.filter(b => b.status === 'Completed').length}
          </h3>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Completed</p>
        </div>
      </div>

      {/* Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            🎉 Upcoming Adventures
          </h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {upcomingBookings.map((booking) => (
              <div key={booking.id} style={{
                background: 'white',
                borderRadius: '15px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: '200px 1fr',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
              }}>
                {booking.location.imageUrl && (
                  <div style={{
                    backgroundImage: `url(${booking.location.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} />
                )}
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        {booking.location.name}
                      </h3>
                      <p style={{ color: '#666', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        📍 {booking.location.address}
                      </p>
                    </div>
                    <div style={{
                      background: getStatusColor(booking.status),
                      color: 'white',
                      padding: '0.4rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      {getStatusIcon(booking.status)} {booking.status}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <p style={{ color: '#999', fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Check-In</p>
                      <p style={{ color: '#333', fontWeight: 'bold', fontSize: '0.95rem' }}>
                        {new Date(booking.checkInDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: '#999', fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Check-Out</p>
                      <p style={{ color: '#333', fontWeight: 'bold', fontSize: '0.95rem' }}>
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: '#999', fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Guests</p>
                      <p style={{ color: '#333', fontWeight: 'bold', fontSize: '0.95rem' }}>
                        {booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'Guest' : 'Guests'}
                      </p>
                    </div>
                  </div>

                  {booking.specialRequests && (
                    <div style={{ 
                      background: '#f8f9fa', 
                      padding: '0.75rem', 
                      borderRadius: '8px', 
                      marginBottom: '1rem',
                      border: '1px solid #e9ecef'
                    }}>
                      <p style={{ color: '#999', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Special Requests:</p>
                      <p style={{ color: '#666', fontSize: '0.9rem' }}>{booking.specialRequests}</p>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={() => navigate(`/location/${booking.location.id}`)}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #00a86b, #ffd700)',
                        color: 'white',
                        padding: '0.6rem 1rem',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      View Details
                    </button>
                    {booking.status !== 'Cancelled' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        style={{
                          background: 'white',
                          color: '#dc3545',
                          padding: '0.6rem 1rem',
                          border: '2px solid #dc3545',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            📚 Past Bookings
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {pastBookings.map((booking) => (
              <div key={booking.id} style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: 0.85
              }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', color: '#333', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    {booking.location.name}
                  </h4>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                  </p>
                </div>
                <div style={{
                  background: getStatusColor(booking.status),
                  color: 'white',
                  padding: '0.4rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold'
                }}>
                  {getStatusIcon(booking.status)} {booking.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {bookings.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🏖️</div>
          <h3 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '0.5rem' }}>
            No bookings yet!
          </h3>
          <p style={{ color: '#999', marginBottom: '2rem', fontSize: '1.1rem' }}>
            Start planning your Jamaican adventure today
          </p>
          <button
            onClick={() => navigate('/explore')}
            style={{
              background: 'linear-gradient(135deg, #00a86b, #ffd700)',
              color: 'white',
              padding: '1rem 2.5rem',
              border: 'none',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,168,107,0.3)'
            }}
          >
            Explore Destinations
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
