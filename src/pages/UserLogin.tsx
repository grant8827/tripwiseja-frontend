import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService, vendorService } from '../services/api';

const UserLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Try user login
      const result = await userService.login(email, password);
      localStorage.setItem('userId', result.id.toString());
      localStorage.setItem('userName', `${result.firstName} ${result.lastName}`);
      localStorage.setItem('userEmail', result.email);
      
      // Dispatch custom event to notify header of auth change
      window.dispatchEvent(new Event('storage-update'));
      
      // Redirect to user dashboard
      navigate('/user-dashboard');
    } catch (error: any) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingTop: '4rem', paddingBottom: '3rem' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏝️</div>
          <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '0.5rem' }}>
            Welcome Back!
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Login to access your account</p>
        </div>

        <form onSubmit={handleSubmit} style={{
          background: 'white',
          padding: '2.5rem',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          {error && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease'
              }}
              placeholder="your@email.com"
              onFocus={(e) => e.currentTarget.style.borderColor = '#00a86b'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e1e5e9'}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease'
              }}
              placeholder="Your password"
              onFocus={(e) => e.currentTarget.style.borderColor = '#00a86b'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e1e5e9'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #00a86b, #ffd700)',
              color: 'white',
              padding: '1rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(0,168,107,0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,168,107,0.4)';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,168,107,0.3)';
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ color: '#666' }}>
              Don't have an account?{' '}
              <Link to="/user-register" style={{ color: '#00a86b', textDecoration: 'none', fontWeight: 'bold' }}>
                Sign up as Customer
              </Link>
              {' or '}
              <Link to="/vendor-register" style={{ color: '#00a86b', textDecoration: 'none', fontWeight: 'bold' }}>
                Register Business
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
