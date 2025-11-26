import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to update auth state from localStorage
  const updateAuthState = () => {
    const name = localStorage.getItem('userName');
    const vendor = localStorage.getItem('businessName');
    setUserName(name);
    setBusinessName(vendor);
  };

  useEffect(() => {
    // Initial load
    updateAuthState();

    // Listen for custom storage events (for same-tab updates)
    const handleStorageChange = () => {
      updateAuthState();
    };

    window.addEventListener('storage-update', handleStorageChange);

    return () => {
      window.removeEventListener('storage-update', handleStorageChange);
    };
  }, []);

  // Update auth state whenever location changes (navigation)
  useEffect(() => {
    updateAuthState();
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('vendorId');
    localStorage.removeItem('businessName');
    setUserName(null);
    setBusinessName(null);
    navigate('/');
  };

  const isVendor = !!businessName;
  const isCustomer = !!userName;
  const isLoggedIn = isVendor || isCustomer;
  const displayName = businessName || userName;

  return (
    <header style={{ 
      background: 'linear-gradient(135deg, #00a86b, #ffd700)', 
      padding: '1rem 2rem', 
      color: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>🏝️ TripWise Jamaica</h1>
        </Link>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/explore" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Explore</Link>
          
          {isLoggedIn ? (
            <>
              <Link 
                to={isVendor ? "/vendor-dashboard" : "/user-dashboard"} 
                style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}
              >
                Dashboard
              </Link>
              <Link to="/vendor-register" style={{ 
                background: 'rgba(255,255,255,0.2)', 
                padding: '0.5rem 1rem', 
                borderRadius: '25px', 
                color: 'white', 
                textDecoration: 'none',
                fontWeight: '500',
                border: '1px solid rgba(255,255,255,0.3)'
              }}>
                {isVendor ? '🏢' : '👤'} {displayName}
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '1rem'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/user-login" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Login</Link>
              <Link to="/vendor-register" style={{ 
                background: 'rgba(255,255,255,0.2)', 
                padding: '0.5rem 1rem', 
                borderRadius: '25px', 
                color: 'white', 
                textDecoration: 'none',
                fontWeight: '500',
                border: '1px solid rgba(255,255,255,0.3)'
              }}>List Your Business</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;