import React, { useState } from 'react';
import { vendorService } from '../services/api';
import { LocationType } from '../types';

interface VendorForm {
  businessName: string;
  contactName: string;
  email: string;
  phoneNumber: string;
  passwordHash: string;
  businessType: LocationType;
}

const VendorRegister: React.FC = () => {
  const [formData, setFormData] = useState<VendorForm>({
    businessName: '',
    contactName: '',
    email: '',
    phoneNumber: '',
    passwordHash: '',
    businessType: LocationType.Hotel
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await vendorService.register(formData);
      alert('Registration successful! Your account is pending approval.');
      setFormData({
        businessName: '',
        contactName: '',
        email: '',
        phoneNumber: '',
        passwordHash: '',
        businessType: LocationType.Hotel
      });
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.name === 'businessType' ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '1rem' }}>
          🏢 List Your Business
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          Join Jamaica's premier tourism platform and reach thousands of travelers
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '15px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
            Business Name *
          </label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '1rem',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            placeholder="e.g., Blue Mountain Resort"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
            Contact Name *
          </label>
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '1rem',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            placeholder="Your full name"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '1rem',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            placeholder="business@example.com"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
            Business Type *
          </label>
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '1rem',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          >
            <option value={LocationType.Hotel}>Hotel</option>
            <option value={LocationType.Restaurant}>Restaurant</option>
            <option value={LocationType.Attraction}>Attraction</option>
            <option value={LocationType.Taxi}>Taxi Service</option>
            <option value={LocationType.SouvenirShopping}>Souvenir Shopping</option>
            <option value={LocationType.Airbnb}>Airbnb</option>
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
            Phone Number *
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '1rem',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            placeholder="+1 876 XXX XXXX"
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
            Password *
          </label>
          <input
            type="password"
            name="passwordHash"
            value={formData.passwordHash}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '1rem',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            placeholder="Create a secure password"
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #00a86b, #ffd700)',
            color: 'white',
            padding: '1rem',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,168,107,0.3)'
          }}
        >
          Register My Business
        </button>

        <p style={{ 
          textAlign: 'center', 
          marginTop: '1rem', 
          fontSize: '0.9rem', 
          color: '#666' 
        }}>
          * Your registration will be reviewed and approved within 24-48 hours
        </p>
      </form>
    </div>
  );
};

export default VendorRegister;