import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vendor, LocationType, LocationImage } from '../types';
import { vendorService } from '../services/api';

const VendorDashboard: React.FC = () => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showGalleryManager, setShowGalleryManager] = useState(false);
  const [galleryImages, setGalleryImages] = useState<LocationImage[]>([]);
  const [uploadingGalleryImage, setUploadingGalleryImage] = useState(false);
  const [businessData, setBusinessData] = useState({
    name: '',
    description: '',
    address: '',
    type: LocationType.Hotel,
    latitude: 0,
    longitude: 0,
    phoneNumber: '',
    website: '',
    imageUrl: '',
    isActive: true
  });

  const getBusinessTypeLabel = (type: LocationType) => {
    switch (type) {
      case LocationType.Hotel: return 'Hotel';
      case LocationType.Restaurant: return 'Restaurant';
      case LocationType.Attraction: return 'Attraction';
      case LocationType.Taxi: return 'Taxi Service';
      case LocationType.SouvenirShopping: return 'Souvenir Shopping';
      case LocationType.Airbnb: return 'Airbnb';
      default: return 'Business';
    }
  };

  const getBusinessSpecificFields = () => {
    switch (businessData.type) {
      case LocationType.Taxi:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
                Vehicle Type
              </label>
              <input
                type="text"
                placeholder="e.g., Sedan, SUV, Van"
                value={businessData.website}
                onChange={(e) => setBusinessData({...businessData, website: e.target.value})}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid #e1e5e9',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
                Passenger Capacity
              </label>
              <input
                type="number"
                placeholder="e.g., 4"
                onChange={(e) => setBusinessData({...businessData, latitude: parseInt(e.target.value) || 0})}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid #e1e5e9',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        );
      case LocationType.SouvenirShopping:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
                Specialty Items
              </label>
              <input
                type="text"
                placeholder="e.g., Local Crafts, Jewelry"
                value={businessData.website}
                onChange={(e) => setBusinessData({...businessData, website: e.target.value})}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid #e1e5e9',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
                Operating Hours
              </label>
              <input
                type="text"
                placeholder="e.g., Mon-Sat 9AM-6PM"
                onChange={(e) => setBusinessData({...businessData, phoneNumber: e.target.value})}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid #e1e5e9',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        );
      case LocationType.Airbnb:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
                Number of Bedrooms
              </label>
              <input
                type="number"
                placeholder="e.g., 3"
                onChange={(e) => setBusinessData({...businessData, latitude: parseInt(e.target.value) || 0})}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid #e1e5e9',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
                Property Type
              </label>
              <input
                type="text"
                placeholder="e.g., Villa, Apartment, House"
                value={businessData.website}
                onChange={(e) => setBusinessData({...businessData, website: e.target.value})}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid #e1e5e9',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        );
      case LocationType.Hotel:
      case LocationType.Restaurant:
      case LocationType.Attraction:
      default:
        return (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
              Website URL
            </label>
            <input
              type="url"
              placeholder="https://yourwebsite.com"
              value={businessData.website}
              onChange={(e) => setBusinessData({...businessData, website: e.target.value})}
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e1e5e9',
                borderRadius: '10px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
        );
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    const vendorId = localStorage.getItem('vendorId');
    if (!vendorId) {
      navigate('/vendor-login');
      return;
    }

    const fetchVendor = async () => {
      try {
        const data = await vendorService.getVendor(parseInt(vendorId));
        setVendor(data);
        
        // If vendor has a business (location), populate businessData for editing
        if (data.locations && data.locations.length > 0) {
          const existingBusiness = data.locations[0];
          setBusinessData({
            name: existingBusiness.name,
            description: existingBusiness.description || '',
            address: existingBusiness.address,
            type: existingBusiness.type,
            latitude: existingBusiness.latitude || 0,
            longitude: existingBusiness.longitude || 0,
            phoneNumber: existingBusiness.phoneNumber || '',
            website: existingBusiness.website || '',
            imageUrl: existingBusiness.imageUrl || '',
            isActive: existingBusiness.isActive
          });
          setImagePreview(existingBusiness.imageUrl || '');
        }
      } catch (error) {
        console.error('Error fetching vendor:', error);
        navigate('/vendor-login');
      }
    };

    fetchVendor();
  }, [navigate]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL for immediate display
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      try {
        console.log('Uploading image...');
        const imageUrl = await vendorService.uploadImage(file);
        console.log('Image uploaded successfully:', imageUrl);
        
        // Update businessData with the uploaded image URL
        setBusinessData(prev => ({...prev, imageUrl}));
        alert('Image uploaded successfully!');
      } catch (error) {
        console.error('Error uploading image:', error);
        alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;

    try {
      console.log('Submitting business data:', businessData);
      
      // In a real app, you would upload the image to a server/cloud storage
      // For now, we'll use a placeholder URL (can't use base64 as it exceeds 500 char limit)
      const imageUrl = businessData.imageUrl || 'https://via.placeholder.com/400x300?text=Business+Image';
      
      const locationData = {
        ...businessData,
        imageUrl,
        type: businessData.type
      };

      console.log('Location data to send:', locationData);

      if (isEditMode && vendor.locations && vendor.locations.length > 0) {
        // Update existing business
        const existingLocation = vendor.locations[0];
        const existingLocationId = existingLocation.id;
        
        if (!existingLocationId) {
          throw new Error('Location ID is missing');
        }
        
        console.log('Updating location:', {
          vendorId: vendor.id,
          locationId: existingLocationId,
          existingLocation,
          locationData
        });
        
        const updatedLocation = await vendorService.updateLocation(vendor.id, existingLocationId, locationData);
        console.log('Location updated successfully:', updatedLocation);
        
        // Update local state with the updated location
        setVendor({
          ...vendor,
          locations: [updatedLocation]
        });
        
        alert('Business updated successfully!');
      } else {
        // Add new business
        console.log('Calling addLocation API for vendor:', vendor.id);
        const location = await vendorService.addLocation(vendor.id, locationData);
        console.log('Location created successfully:', location);
        
        // Update local state with the new location
        setVendor({
          ...vendor,
          locations: [location] // Only one business allowed
        });
        
        alert('Business created successfully!');
      }
      
      setShowBusinessForm(false);
      setIsEditMode(false);
      setSelectedImage(null);
      setImagePreview('');
      setBusinessData({
        name: '',
        description: '',
        address: '',
        type: LocationType.Hotel,
        latitude: 0,
        longitude: 0,
        phoneNumber: '',
        website: '',
        imageUrl: '',
        isActive: true
      });
    } catch (error) {
      console.error('Error saving business:', error);
      alert(`Failed to save business: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vendorId');
    localStorage.removeItem('businessName');
    navigate('/');
  };

  const handleOpenGallery = async () => {
    if (!vendor || !vendor.locations || vendor.locations.length === 0) {
      alert('Please create a business first');
      return;
    }

    try {
      const locationId = vendor.locations[0].id!;
      const images = await vendorService.getGalleryImages(vendor.id, locationId);
      setGalleryImages(images);
      setShowGalleryManager(true);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      alert('Failed to load gallery images');
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !vendor || !vendor.locations || vendor.locations.length === 0) return;

    setUploadingGalleryImage(true);
    try {
      const locationId = vendor.locations[0].id!;
      const newImage = await vendorService.uploadGalleryImage(vendor.id, locationId, file);
      setGalleryImages([...galleryImages, newImage]);
      alert('Image added to gallery!');
    } catch (error) {
      console.error('Error uploading gallery image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingGalleryImage(false);
    }
  };

  const handleDeleteGalleryImage = async (imageId: number) => {
    if (!vendor || !vendor.locations || vendor.locations.length === 0) return;
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      const locationId = vendor.locations[0].id!;
      await vendorService.deleteGalleryImage(vendor.id, locationId, imageId);
      setGalleryImages(galleryImages.filter(img => img.id !== imageId));
      alert('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      alert('Failed to delete image');
    }
  };

  if (!vendor) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;

  // Calculate statistics
  const hasBusiness = vendor.locations && vendor.locations.length > 0;
  const business = hasBusiness ? vendor.locations![0] : null;
  const totalReviews = business?.reviewCount || 0;
  const averageRating = business?.averageRating || 0;
  const isActive = business?.isActive || false;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        padding: '2rem',
        background: 'linear-gradient(135deg, #00a86b, #ffd700)',
        borderRadius: '15px',
        color: 'white',
        boxShadow: '0 10px 30px rgba(0,168,107,0.3)'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            🏢 {vendor.businessName}
          </h1>
          <p style={{ opacity: 0.95, fontSize: '1.1rem' }}>Welcome back, {vendor.contactName}</p>
          <p style={{ opacity: 0.85, fontSize: '0.95rem', marginTop: '0.25rem' }}>
            {getBusinessTypeLabel(vendor.businessType)} • Registered {new Date(vendor.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(255,255,255,0.25)',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.4)',
            padding: '0.75rem 1.5rem',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
        >
          Logout
        </button>
      </div>

      {/* Stats Dashboard */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          textAlign: 'center',
          border: '1px solid #e8f5e9'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏢</div>
          <h3 style={{ fontSize: '2.5rem', color: '#00a86b', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            {hasBusiness ? '1' : '0'}
          </h3>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Business Setup</p>
          <p style={{ color: '#999', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            {hasBusiness ? (isActive ? 'Active' : 'Inactive') : 'Not setup'}
          </p>
        </div>
        
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          textAlign: 'center',
          border: '1px solid #fff8dc'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⭐</div>
          <h3 style={{ fontSize: '2.5rem', color: '#ffd700', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            {averageRating.toFixed(1)}
          </h3>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Rating</p>
          <p style={{ color: '#999', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            {hasBusiness ? 'Customer rating' : 'No reviews yet'}
          </p>
        </div>
        
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          textAlign: 'center',
          border: '1px solid #e8f4fd'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💬</div>
          <h3 style={{ fontSize: '2.5rem', color: '#2196f3', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            {totalReviews}
          </h3>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Reviews</p>
          <p style={{ color: '#999', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            {hasBusiness ? 'Customer feedback' : 'No reviews yet'}
          </p>
        </div>
        
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          textAlign: 'center',
          border: '1px solid #fce4ec'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
          <h3 style={{ fontSize: '2.5rem', color: '#e91e63', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            {vendor.isApproved ? 'Active' : 'Pending'}
          </h3>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Account Status</p>
          <p style={{ color: '#999', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            {vendor.isApproved ? 'Fully operational' : 'Under review'}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.5rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {vendor.locations && vendor.locations.length > 0 ? (
            <>
              <button
                onClick={() => {
                  setIsEditMode(true);
                  setShowBusinessForm(true);
                }}
                style={{
                  background: 'linear-gradient(135deg, #00a86b, #ffd700)',
                  color: 'white',
                  padding: '1.2rem 2.5rem',
                  border: 'none',
                  borderRadius: '30px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(0,168,107,0.3)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                ✏️ Edit Business
              </button>
              <button
                onClick={handleOpenGallery}
                style={{
                  background: 'linear-gradient(135deg, #2196f3, #00bcd4)',
                  color: 'white',
                  padding: '1.2rem 2.5rem',
                  border: 'none',
                  borderRadius: '30px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(33,150,243,0.3)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                🖼️ Manage Gallery
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setIsEditMode(false);
                setShowBusinessForm(true);
              }}
              style={{
                background: 'linear-gradient(135deg, #00a86b, #ffd700)',
                color: 'white',
                padding: '1.2rem 2.5rem',
                border: 'none',
                borderRadius: '30px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(0,168,107,0.3)',
                transition: 'transform 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              ➕ Setup Business
            </button>
          )}
          
          <button
            style={{
              background: 'white',
              color: '#00a86b',
              padding: '1.2rem 2.5rem',
              border: '2px solid #00a86b',
              borderRadius: '30px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#00a86b';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#00a86b';
            }}
          >
            📊 View Analytics
          </button>
        </div>
      </div>

      {/* Business Form */}
      {showBusinessForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '2rem',
          overflow: 'auto'
        }}>
          <div style={{
            background: 'white',
            padding: '2.5rem',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ 
              marginBottom: '0.5rem', 
              color: '#333', 
              fontSize: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {isEditMode ? '✏️ Edit Business' : '➕ Setup Business'}
            </h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              {isEditMode ? 'Update your business information' : 'Fill in the details to set up your business'}
            </p>
            
            <form onSubmit={handleBusinessSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
                  Business Name *
                </label>
                <input
                  type="text"
                  placeholder={`e.g., ${vendor.businessName} - Downtown`}
                  value={businessData.name}
                  onChange={(e) => setBusinessData({...businessData, name: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #e1e5e9',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
                  Business Type *
                </label>
                <select
                  value={businessData.type}
                  onChange={(e) => setBusinessData({...businessData, type: parseInt(e.target.value) as LocationType})}
                  required
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #e1e5e9',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  <option value={LocationType.Hotel}>🏨 Hotel</option>
                  <option value={LocationType.Restaurant}>🍽️ Restaurant</option>
                  <option value={LocationType.Attraction}>🎡 Attraction</option>
                  <option value={LocationType.Taxi}>🚕 Taxi Service</option>
                  <option value={LocationType.SouvenirShopping}>🛍️ Souvenir Shopping</option>
                  <option value={LocationType.Airbnb}>🏠 Airbnb</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
                    Address *
                  </label>
                  <input
                    type="text"
                    placeholder="123 Main Street, Kingston"
                    value={businessData.address}
                    onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e1e5e9',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 876-123-4567"
                    value={businessData.phoneNumber}
                    onChange={(e) => setBusinessData({...businessData, phoneNumber: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e1e5e9',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {getBusinessSpecificFields()}

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
                  Business Image
                </label>
                <div style={{
                  border: '2px dashed #e1e5e9',
                  borderRadius: '10px',
                  padding: '2rem',
                  textAlign: 'center',
                  background: '#fafafa',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#00a86b';
                  e.currentTarget.style.background = '#f0fdf4';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e1e5e9';
                  e.currentTarget.style.background = '#fafafa';
                }}
                onClick={() => document.getElementById('imageUpload')?.click()}>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  {imagePreview ? (
                    <div>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '300px',
                          borderRadius: '8px',
                          marginBottom: '1rem'
                        }} 
                      />
                      <p style={{ color: '#00a86b', fontWeight: '600' }}>
                        ✓ Image uploaded - Click to change
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
                      <p style={{ color: '#666', fontSize: '1rem', marginBottom: '0.5rem' }}>
                        Click to upload an image
                      </p>
                      <p style={{ color: '#999', fontSize: '0.85rem' }}>
                        PNG, JPG, GIF, WebP (max 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
                  Or paste Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={businessData.imageUrl}
                  onChange={(e) => setBusinessData({...businessData, imageUrl: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #e1e5e9',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
                  Description
                </label>
                <textarea
                  placeholder="Describe your business, amenities, and what makes it special..."
                  value={businessData.description}
                  onChange={(e) => setBusinessData({...businessData, description: e.target.value})}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #e1e5e9',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #00a86b, #ffd700)',
                    color: 'white',
                    padding: '1.2rem 2rem',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(0,168,107,0.3)'
                  }}
                >
                  {isEditMode ? '✓ Update Business' : '✓ Create Business'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBusinessForm(false);
                    setIsEditMode(false);
                  }}
                  style={{
                    flex: 1,
                    background: '#f5f5f5',
                    color: '#666',
                    padding: '1.2rem 2rem',
                    border: '2px solid #ddd',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  ✕ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Manager Modal */}
      {showGalleryManager && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '2rem',
          overflow: 'auto'
        }}>
          <div style={{
            background: 'white',
            padding: '2.5rem',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            maxWidth: '1000px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ color: '#333', fontSize: '2rem', margin: 0 }}>
                🖼️ Photo Gallery
              </h2>
              <button
                onClick={() => setShowGalleryManager(false)}
                style={{
                  background: '#f5f5f5',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  color: '#666'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              border: '2px dashed #00a86b',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem',
              textAlign: 'center',
              background: '#f0fdf4',
              cursor: 'pointer'
            }}
            onClick={() => document.getElementById('galleryImageUpload')?.click()}>
              <input
                id="galleryImageUpload"
                type="file"
                accept="image/*"
                onChange={handleGalleryImageUpload}
                style={{ display: 'none' }}
                disabled={uploadingGalleryImage}
              />
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
              <p style={{ color: '#00a86b', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {uploadingGalleryImage ? 'Uploading...' : 'Click to add photos'}
              </p>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Add multiple photos to showcase your business
              </p>
            </div>

            {galleryImages.length > 0 ? (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                gap: '1rem'
              }}>
                {galleryImages.map((image) => (
                  <div key={image.id} style={{
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    aspectRatio: '1',
                    background: '#f5f5f5'
                  }}>
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
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '0.5rem',
                        fontSize: '0.85rem',
                        textAlign: 'center'
                      }}>
                        {image.caption}
                      </div>
                    )}
                    <button
                      onClick={() => handleDeleteGalleryImage(image.id)}
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        background: 'rgba(255,0,0,0.8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}
                      title="Delete image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📷</div>
                <p style={{ fontSize: '1.2rem' }}>No photos yet. Add some to get started!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Business Display */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#333', fontSize: '1.8rem' }}>
            Your Business
          </h2>
        </div>

        {vendor.locations && vendor.locations.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {vendor.locations.slice(0, 1).map((location) => (
              <div key={location.id} style={{
                background: 'white',
                borderRadius: '15px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                border: '1px solid #f0f0f0'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
              }}>
                {location.imageUrl && (
                  <div style={{
                    height: '180px',
                    backgroundImage: `url(${location.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: location.isActive ? '#00a86b' : '#999',
                      color: 'white',
                      padding: '0.4rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold'
                    }}>
                      {location.isActive ? '✓ Active' : '⊗ Inactive'}
                    </div>
                  </div>
                )}
                
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ 
                    color: '#333', 
                    marginBottom: '0.5rem', 
                    fontSize: '1.3rem',
                    fontWeight: 'bold'
                  }}>
                    {location.name}
                  </h3>
                  
                  <p style={{ 
                    color: '#666', 
                    fontSize: '0.9rem', 
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    📍 {location.address}
                  </p>

                  {location.phoneNumber && (
                    <p style={{ 
                      color: '#666', 
                      fontSize: '0.9rem', 
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      📞 {location.phoneNumber}
                    </p>
                  )}

                  {location.description && (
                    <p style={{ 
                      color: '#777', 
                      fontSize: '0.85rem', 
                      marginBottom: '1rem',
                      lineHeight: '1.5',
                      maxHeight: '3em',
                      overflow: 'hidden'
                    }}>
                      {location.description.substring(0, 100)}{location.description.length > 100 ? '...' : ''}
                    </p>
                  )}

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
                        <div style={{ color: '#ffd700', fontWeight: 'bold', fontSize: '1.1rem' }}>
                          {(location.averageRating || 0).toFixed(1)}
                        </div>
                        <div style={{ color: '#999', fontSize: '0.75rem' }}>
                          {location.reviewCount || 0} reviews
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setIsEditMode(true);
                        setShowBusinessForm(true);
                      }}
                      style={{
                        background: '#f0f0f0',
                        color: '#666',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#00a86b';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#f0f0f0';
                        e.currentTarget.style.color = '#666';
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'white',
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏢</div>
            <h3 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '0.5rem' }}>
              No business set up yet
            </h3>
            <p style={{ color: '#999', marginBottom: '2rem' }}>
              Set up your {getBusinessTypeLabel(vendor.businessType).toLowerCase()} business to start showcasing to customers!
            </p>
            <button
              onClick={() => {
                setIsEditMode(false);
                setShowBusinessForm(true);
              }}
              style={{
                background: 'linear-gradient(135deg, #00a86b, #ffd700)',
                color: 'white',
                padding: '1rem 2rem',
                border: 'none',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,168,107,0.3)'
              }}
            >
              ➕ Setup Your Business
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;