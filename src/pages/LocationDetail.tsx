import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Location } from '../types';
import { locationService, reviewService, userService, bookingService } from '../services/api';

const LocationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [reviewData, setReviewData] = useState({ 
    rating: 5, 
    comment: '',
    firstName: '',
    lastName: '',
    email: ''
  });
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: '',
    needsAccount: false,
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [bookingError, setBookingError] = useState('');

  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    const fetchLocation = async () => {
      if (!id) return;
      
      try {
        const data = await locationService.getById(parseInt(id));
        setLocation(data);
      } catch (error) {
        console.error('Error fetching location:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmittingReview(true);
    setReviewError('');

    try {
      if (userId) {
        // Logged in user
        await reviewService.submitReview({
          userId: parseInt(userId),
          locationId: parseInt(id!),
          rating: reviewData.rating,
          comment: reviewData.comment
        });
      } else {
        // Guest user - validate required fields
        if (!reviewData.firstName || !reviewData.lastName || !reviewData.email) {
          setReviewError('Please fill in your name and email');
          setSubmittingReview(false);
          return;
        }
        
        await reviewService.submitAnonymousReview({
          locationId: parseInt(id!),
          rating: reviewData.rating,
          comment: reviewData.comment,
          firstName: reviewData.firstName,
          lastName: reviewData.lastName,
          email: reviewData.email
        });
      }

      // Refresh location data to show new review
      const updatedLocation = await locationService.getById(parseInt(id!));
      setLocation(updatedLocation);
      
      setShowReviewForm(false);
      setReviewData({ rating: 5, comment: '', firstName: '', lastName: '', email: '' });
      alert('Thank you for your review! 🌟');
    } catch (error: any) {
      setReviewError(error.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmittingBooking(true);
    setBookingError('');

    try {
      let currentUserId = userId;

      // If user not logged in and needs account, create one
      if (!currentUserId && bookingData.needsAccount) {
        if (!bookingData.firstName || !bookingData.lastName || !bookingData.email || !bookingData.password) {
          setBookingError('Please fill in all account details');
          setSubmittingBooking(false);
          return;
        }

        // Register new user
        const newUser = await userService.register({
          firstName: bookingData.firstName,
          lastName: bookingData.lastName,
          email: bookingData.email,
          password: bookingData.password
        });

        // Auto login
        localStorage.setItem('userId', newUser.id.toString());
        localStorage.setItem('userName', `${newUser.firstName} ${newUser.lastName}`);
        currentUserId = newUser.id.toString();
      }

      if (!currentUserId) {
        setBookingError('Please log in or create an account to book');
        setSubmittingBooking(false);
        return;
      }

      // Validate dates
      if (!bookingData.checkInDate || !bookingData.checkOutDate) {
        setBookingError('Please select check-in and check-out dates');
        setSubmittingBooking(false);
        return;
      }

      // Create booking
      await bookingService.createBooking({
        userId: parseInt(currentUserId),
        locationId: parseInt(id!),
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        numberOfGuests: bookingData.numberOfGuests,
        specialRequests: bookingData.specialRequests || undefined
      });

      alert('🎉 Booking confirmed! Check your dashboard to view details.');
      setShowBookingForm(false);
      setBookingData({
        checkInDate: '',
        checkOutDate: '',
        numberOfGuests: 1,
        specialRequests: '',
        needsAccount: false,
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      });

      // Redirect to user dashboard if they just created an account
      if (bookingData.needsAccount) {
        setTimeout(() => navigate('/user-dashboard'), 1500);
      }
    } catch (error: any) {
      setBookingError(error.message || 'Failed to create booking');
    } finally {
      setSubmittingBooking(false);
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
          <p style={{ color: '#666', fontSize: '1.2rem' }}>Loading location details...</p>
        </div>
      </div>
    );
  }
  
  if (!location) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>❌</div>
          <h2 style={{ color: '#333', marginBottom: '0.5rem' }}>Location Not Found</h2>
          <p style={{ color: '#999' }}>The location you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '3rem' }}>
      {/* Hero Image */}
      {location.imageUrl && (
        <div style={{
          height: '400px',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${location.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '3rem 2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '0.5rem',
              textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
            }}>
              {location.name}
            </h1>
            <p style={{ 
              color: 'rgba(255,255,255,0.95)', 
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📍 {location.address}
            </p>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Photo Gallery */}
        {location.images && location.images.length > 0 && (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '1.5rem', fontWeight: 'bold' }}>
              📸 Photo Gallery
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '1rem'
            }}>
              {location.images.map((image) => (
                <div key={image.id} style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  aspectRatio: '4/3',
                  background: '#f5f5f5',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onClick={() => window.open(`http://localhost:5001${image.imageUrl}`, '_blank')}>
                  <img
                    src={`http://localhost:5001${image.imageUrl}`}
                    alt={image.caption || 'Gallery image'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  {image.caption && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                      color: 'white',
                      padding: '1rem 0.75rem 0.75rem',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      {image.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⭐</div>
            <h3 style={{ fontSize: '2rem', color: '#ffd700', marginBottom: '0.25rem', fontWeight: 'bold' }}>
              {(location.averageRating || 0).toFixed(1)}
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{location.reviewCount || 0} Reviews</p>
          </div>

          {location.phoneNumber && (
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '15px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📞</div>
              <h3 style={{ fontSize: '1.1rem', color: '#333', marginBottom: '0.25rem', fontWeight: 'bold' }}>
                Contact
              </h3>
              <p style={{ color: '#00a86b', fontSize: '1rem', fontWeight: '600' }}>{location.phoneNumber}</p>
            </div>
          )}

          {location.website && (
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '15px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌐</div>
              <h3 style={{ fontSize: '1.1rem', color: '#333', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Website
              </h3>
              <a 
                href={location.website} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: '#00a86b',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}
              >
                Visit Site →
              </a>
            </div>
          )}
        </div>

        {/* Description */}
        <div style={{
          background: 'white',
          padding: '2.5rem',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '1rem', fontWeight: 'bold' }}>
            About This Place
          </h2>
          <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.8' }}>
            {location.description || 'No description available.'}
          </p>
        </div>

        {/* Book Now Section */}
        <div style={{
          background: 'linear-gradient(135deg, #00a86b, #ffd700)',
          padding: '2.5rem',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,168,107,0.3)',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '2.2rem', color: 'white', marginBottom: '1rem', fontWeight: 'bold' }}>
            Ready to Experience {location.name}?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Book your stay today and create unforgettable memories!
          </p>
          <button
            onClick={() => setShowBookingForm(true)}
            style={{
              background: 'white',
              color: '#00a86b',
              padding: '1rem 3rem',
              border: 'none',
              borderRadius: '30px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
          >
            📅 Book Now
          </button>
        </div>

        {/* Reviews Section */}
        <div style={{
          background: 'white',
          padding: '2.5rem',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#333', fontWeight: 'bold', margin: 0 }}>
              💬 Customer Reviews
            </h2>
            
            {!showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                style={{
                  background: 'linear-gradient(135deg, #00a86b, #ffd700)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,168,107,0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                ✍️ Write a Review
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div style={{
              background: '#f8f9fa',
              padding: '2rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              border: '2px solid #00a86b'
            }}>
              <h3 style={{ color: '#333', marginBottom: '1rem', fontSize: '1.3rem' }}>
                Share Your Experience
              </h3>
              
              {reviewError && (
                <div style={{
                  background: '#fee',
                  color: '#c33',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  marginBottom: '1rem',
                  fontSize: '0.95rem'
                }}>
                  {reviewError}
                </div>
              )}

              <form onSubmit={handleSubmitReview}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 'bold', color: '#333' }}>
                    Rating *
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewData({ ...reviewData, rating: star })}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '2rem',
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        {star <= reviewData.rating ? '⭐' : '☆'}
                      </button>
                    ))}
                    <span style={{ marginLeft: '1rem', alignSelf: 'center', color: '#666', fontSize: '1.1rem' }}>
                      {reviewData.rating}/5
                    </span>
                  </div>
                </div>

                {!userId && (
                  <>
                    <div style={{ marginBottom: '1rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px', border: '1px solid #00a86b' }}>
                      <p style={{ color: '#00a86b', margin: 0, fontSize: '0.95rem', fontWeight: '600' }}>
                        ℹ️ You're leaving a review as a guest. Please provide your details below.
                      </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={reviewData.firstName}
                          onChange={(e) => setReviewData({ ...reviewData, firstName: e.target.value })}
                          required
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #e1e5e9',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            boxSizing: 'border-box'
                          }}
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={reviewData.lastName}
                          onChange={(e) => setReviewData({ ...reviewData, lastName: e.target.value })}
                          required
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #e1e5e9',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            boxSizing: 'border-box'
                          }}
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={reviewData.email}
                        onChange={(e) => setReviewData({ ...reviewData, email: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e1e5e9',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          boxSizing: 'border-box'
                        }}
                        placeholder="your@email.com"
                      />
                    </div>
                  </>
                )}

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 'bold', color: '#333' }}>
                    Your Review *
                  </label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                    required
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    placeholder="Share your experience at this location..."
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    style={{
                      flex: 1,
                      background: submittingReview ? '#ccc' : 'linear-gradient(135deg, #00a86b, #ffd700)',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: submittingReview ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(false);
                      setReviewData({ rating: 5, comment: '', firstName: '', lastName: '', email: '' });
                      setReviewError('');
                    }}
                    style={{
                      flex: 1,
                      background: 'white',
                      color: '#666',
                      padding: '0.75rem 1.5rem',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Booking Form */}
          {showBookingForm && (
            <div style={{
              background: '#f8f9fa',
              padding: '2rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              border: '2px solid #00a86b'
            }}>
              <h3 style={{ color: '#333', marginBottom: '1rem', fontSize: '1.3rem' }}>
                Book Your Stay
              </h3>
              
              {bookingError && (
                <div style={{
                  background: '#fee',
                  color: '#c33',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  marginBottom: '1rem',
                  fontSize: '0.95rem'
                }}>
                  {bookingError}
                </div>
              )}

              <form onSubmit={handleSubmitBooking}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                      Check-In Date *
                    </label>
                    <input
                      type="date"
                      value={bookingData.checkInDate}
                      onChange={(e) => setBookingData({ ...bookingData, checkInDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e1e5e9',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                      Check-Out Date *
                    </label>
                    <input
                      type="date"
                      value={bookingData.checkOutDate}
                      onChange={(e) => setBookingData({ ...bookingData, checkOutDate: e.target.value })}
                      min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e1e5e9',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                    Number of Guests *
                  </label>
                  <input
                    type="number"
                    value={bookingData.numberOfGuests}
                    onChange={(e) => setBookingData({ ...bookingData, numberOfGuests: parseInt(e.target.value) || 1 })}
                    min="1"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                    Special Requests
                  </label>
                  <textarea
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    placeholder="Any special requirements or preferences..."
                  />
                </div>

                {!userId && (
                  <>
                    <div style={{ marginBottom: '1rem', padding: '1rem', background: '#fff8dc', borderRadius: '8px', border: '1px solid #ffd700' }}>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={bookingData.needsAccount}
                          onChange={(e) => setBookingData({ ...bookingData, needsAccount: e.target.checked })}
                          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <span style={{ color: '#333', fontWeight: '600' }}>
                          Create an account to manage your bookings
                        </span>
                      </label>
                      <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem', marginLeft: '28px' }}>
                        Already have an account? <a href="/user-login" style={{ color: '#00a86b', fontWeight: 'bold' }}>Log in here</a>
                      </p>
                    </div>

                    {bookingData.needsAccount && (
                      <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'white', borderRadius: '8px', border: '2px solid #00a86b' }}>
                        <h4 style={{ color: '#333', marginBottom: '1rem' }}>Create Your Account</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                              First Name *
                            </label>
                            <input
                              type="text"
                              value={bookingData.firstName}
                              onChange={(e) => setBookingData({ ...bookingData, firstName: e.target.value })}
                              required={bookingData.needsAccount}
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #e1e5e9',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                              Last Name *
                            </label>
                            <input
                              type="text"
                              value={bookingData.lastName}
                              onChange={(e) => setBookingData({ ...bookingData, lastName: e.target.value })}
                              required={bookingData.needsAccount}
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #e1e5e9',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                            Email *
                          </label>
                          <input
                            type="email"
                            value={bookingData.email}
                            onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                            required={bookingData.needsAccount}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              border: '2px solid #e1e5e9',
                              borderRadius: '8px',
                              fontSize: '1rem',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                            Password *
                          </label>
                          <input
                            type="password"
                            value={bookingData.password}
                            onChange={(e) => setBookingData({ ...bookingData, password: e.target.value })}
                            required={bookingData.needsAccount}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              border: '2px solid #e1e5e9',
                              borderRadius: '8px',
                              fontSize: '1rem',
                              boxSizing: 'border-box'
                            }}
                            minLength={6}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="submit"
                    disabled={submittingBooking}
                    style={{
                      flex: 1,
                      background: submittingBooking ? '#ccc' : 'linear-gradient(135deg, #00a86b, #ffd700)',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: submittingBooking ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {submittingBooking ? 'Processing...' : '✓ Confirm Booking'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingForm(false);
                      setBookingData({
                        checkInDate: '',
                        checkOutDate: '',
                        numberOfGuests: 1,
                        specialRequests: '',
                        needsAccount: false,
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: ''
                      });
                      setBookingError('');
                    }}
                    style={{
                      flex: 1,
                      background: 'white',
                      color: '#666',
                      padding: '0.75rem 1.5rem',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {location.reviews && location.reviews.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {location.reviews.map(review => (
                <div 
                  key={review.id} 
                  style={{ 
                    border: '1px solid #f0f0f0',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    background: '#fafafa'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div>
                      <p style={{ fontWeight: 'bold', color: '#333', fontSize: '1.05rem' }}>
                        {review.user.firstName} {review.user.lastName}
                      </p>
                      <p style={{ color: '#999', fontSize: '0.85rem' }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ 
                      background: '#ffd700',
                      color: 'white',
                      padding: '0.4rem 0.9rem',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      fontSize: '0.95rem'
                    }}>
                      ⭐ {review.rating}/5
                    </div>
                  </div>
                  <p style={{ color: '#555', fontSize: '1rem', lineHeight: '1.6' }}>
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💭</div>
              <p style={{ color: '#999', fontSize: '1.1rem' }}>No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationDetail;