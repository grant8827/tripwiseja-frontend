import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { LocationType } from '../types';

interface PendingVendor {
  id: number;
  businessName: string;
  contactName: string;
  email: string;
  phoneNumber: string;
  businessType: LocationType;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [pendingVendors, setPendingVendors] = useState<PendingVendor[]>([]);
  const [approvedVendors, setApprovedVendors] = useState<PendingVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [editingVendor, setEditingVendor] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phoneNumber: '',
    businessType: 0
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const [pending, approved] = await Promise.all([
        adminService.getPendingVendors(),
        adminService.getApprovedVendors()
      ]);
      setPendingVendors(pending);
      setApprovedVendors(approved);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      alert('Error loading vendors. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await adminService.approveVendor(id);
      await fetchVendors();
      alert('Vendor approved successfully!');
    } catch (error) {
      console.error('Error approving vendor:', error);
      alert('Failed to approve vendor');
    }
  };

  const handleReject = async (id: number) => {
    if (!window.confirm('Are you sure you want to reject this vendor? This action cannot be undone.')) {
      return;
    }
    
    try {
      await adminService.rejectVendor(id);
      await fetchVendors();
      alert('Vendor rejected successfully!');
    } catch (error) {
      console.error('Error rejecting vendor:', error);
      alert('Failed to reject vendor');
    }
  };

  const handleSuspend = async (id: number) => {
    if (!window.confirm('Are you sure you want to suspend this vendor?')) {
      return;
    }
    
    try {
      await adminService.suspendVendor(id);
      await fetchVendors();
      alert('Vendor suspended successfully!');
    } catch (error) {
      console.error('Error suspending vendor:', error);
      alert('Failed to suspend vendor');
    }
  };

  const handleEditClick = (vendor: PendingVendor) => {
    setEditingVendor(vendor.id);
    setEditForm({
      businessName: vendor.businessName,
      contactName: vendor.contactName,
      email: vendor.email,
      phoneNumber: vendor.phoneNumber,
      businessType: vendor.businessType
    });
  };

  const handleUpdateVendor = async (id: number) => {
    try {
      await adminService.updateVendor(id, editForm);
      setEditingVendor(null);
      await fetchVendors();
      alert('Vendor updated successfully!');
    } catch (error) {
      console.error('Error updating vendor:', error);
      alert('Failed to update vendor');
    }
  };

  const getBusinessTypeLabel = (type: LocationType) => {
    switch (type) {
      case LocationType.Hotel: return 'Hotel';
      case LocationType.Restaurant: return 'Restaurant';
      case LocationType.Attraction: return 'Attraction';
      case LocationType.Taxi: return 'Taxi Service';
      case LocationType.SouvenirShopping: return 'Souvenir Shopping';
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
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#666', fontSize: '1.2rem' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalPending = pendingVendors.length;
  const totalApproved = approvedVendors.length;

  const displayVendors = activeTab === 'pending' ? pendingVendors : approvedVendors;

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1400px', 
      margin: '0 auto',
      background: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '2.5rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        color: 'white',
        marginBottom: '2rem',
        boxShadow: '0 15px 40px rgba(102, 126, 234, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '3rem' }}>👨‍💼</div>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Admin Dashboard
            </h1>
            <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>
              Manage vendor applications and platform operations
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          textAlign: 'center',
          border: '1px solid #fff3e0'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⏰</div>
          <h3 style={{ fontSize: '2.5rem', color: '#ff9800', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            {totalPending}
          </h3>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Pending Approvals</p>
          <p style={{ color: '#999', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Awaiting review
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          textAlign: 'center',
          border: '1px solid #e8f5e9'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
          <h3 style={{ fontSize: '2.5rem', color: '#00a86b', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            {totalApproved}
          </h3>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Approved Vendors</p>
          <p style={{ color: '#999', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Active businesses
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          textAlign: 'center',
          border: '1px solid #e3f2fd'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📊</div>
          <h3 style={{ fontSize: '2.5rem', color: '#2196f3', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            100%
          </h3>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>System Health</p>
          <p style={{ color: '#999', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            All systems operational
          </p>
        </div>
      </div>

      {/* Vendors Section with Tabs */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        padding: '2.5rem'
      }}>
        {/* Tabs */}
        <div style={{ 
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '2px solid #f0f0f0'
        }}>
          <button
            onClick={() => setActiveTab('pending')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'pending' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
              color: activeTab === 'pending' ? 'white' : '#666',
              border: 'none',
              borderBottom: activeTab === 'pending' ? '3px solid #667eea' : '3px solid transparent',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              borderRadius: '8px 8px 0 0',
              transition: 'all 0.3s ease'
            }}
          >
            ⏰ Pending ({totalPending})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'approved' ? 'linear-gradient(135deg, #00a86b, #00d084)' : 'transparent',
              color: activeTab === 'approved' ? 'white' : '#666',
              border: 'none',
              borderBottom: activeTab === 'approved' ? '3px solid #00a86b' : '3px solid transparent',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              borderRadius: '8px 8px 0 0',
              transition: 'all 0.3s ease'
            }}
          >
            ✅ Approved ({totalApproved})
          </button>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '2px solid #f0f0f0'
        }}>
          <h2 style={{ 
            fontSize: '2rem', 
            color: '#333',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '2rem' }}>{activeTab === 'pending' ? '📋' : '🏢'}</span>
            {activeTab === 'pending' ? 'Pending Vendor Approvals' : 'Approved Vendors'}
          </h2>
          <span style={{
            background: activeTab === 'pending' ? (totalPending > 0 ? '#fff3e0' : '#e8f5e9') : '#e8f5e9',
            color: activeTab === 'pending' ? (totalPending > 0 ? '#ff9800' : '#00a86b') : '#00a86b',
            padding: '0.5rem 1.5rem',
            borderRadius: '25px',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            {displayVendors.length} {displayVendors.length === 1 ? 'Vendor' : 'Vendors'}
          </span>
        </div>
        
        {displayVendors.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: '#f8f9fa',
            borderRadius: '15px'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
              {activeTab === 'pending' ? '✅' : '🏢'}
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '0.5rem' }}>
              {activeTab === 'pending' ? 'All Caught Up!' : 'No Approved Vendors'}
            </h3>
            <p style={{ color: '#999', fontSize: '1.1rem' }}>
              {activeTab === 'pending' 
                ? 'No pending vendor approvals at this time'
                : 'No approved vendors yet'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {displayVendors.map((vendor) => (
              <div 
                key={vendor.id} 
                style={{
                  background: '#fafafa',
                  border: '2px solid #e8e8e8',
                  borderRadius: '15px',
                  padding: '2rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e8e8e8';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem' }}>
                  {/* Vendor Info */}
                  <div style={{ flex: 1 }}>
                    {editingVendor === vendor.id ? (
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Business Name</label>
                          <input
                            type="text"
                            value={editForm.businessName}
                            onChange={(e) => setEditForm({...editForm, businessName: e.target.value})}
                            style={{ width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Contact Name</label>
                          <input
                            type="text"
                            value={editForm.contactName}
                            onChange={(e) => setEditForm({...editForm, contactName: e.target.value})}
                            style={{ width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' }}
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Email</label>
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                              style={{ width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Phone</label>
                            <input
                              type="tel"
                              value={editForm.phoneNumber}
                              onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                              style={{ width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ marginBottom: '1.5rem' }}>
                          <h3 style={{ 
                            fontSize: '1.8rem', 
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                          }}>
                            🏢 {vendor.businessName}
                          </h3>
                          <span style={{
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            color: 'white',
                            padding: '0.4rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            display: 'inline-block'
                          }}>
                            {getBusinessTypeLabel(vendor.businessType)}
                          </span>
                        </div>

                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '1rem',
                          marginBottom: '1rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>👤</span>
                            <div>
                              <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.1rem' }}>
                                Contact Person
                              </p>
                              <p style={{ color: '#555', fontWeight: '500' }}>{vendor.contactName}</p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>📧</span>
                            <div>
                              <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.1rem' }}>
                                Email
                              </p>
                              <p style={{ color: '#555', fontWeight: '500' }}>{vendor.email}</p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>📞</span>
                            <div>
                              <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.1rem' }}>
                                Phone
                              </p>
                              <p style={{ color: '#555', fontWeight: '500' }}>{vendor.phoneNumber}</p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>📅</span>
                            <div>
                              <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.1rem' }}>
                                {activeTab === 'pending' ? 'Applied' : 'Approved'}
                              </p>
                              <p style={{ color: '#555', fontWeight: '500' }}>
                                {new Date(vendor.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '1rem',
                    minWidth: '140px'
                  }}>
                    {activeTab === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApprove(vendor.id)}
                          style={{
                            background: 'linear-gradient(135deg, #00a86b, #00d084)',
                            color: 'white',
                            padding: '1rem 1.5rem',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            boxShadow: '0 4px 15px rgba(0, 168, 107, 0.3)',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 168, 107, 0.4)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 168, 107, 0.3)';
                          }}
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleReject(vendor.id)}
                          style={{
                            background: 'white',
                            color: '#dc2626',
                            padding: '1rem 1.5rem',
                            border: '2px solid #dc2626',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#dc2626';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = '#dc2626';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          ✕ Reject
                        </button>
                      </>
                    ) : (
                      <>
                        {editingVendor === vendor.id ? (
                          <>
                            <button
                              onClick={() => handleUpdateVendor(vendor.id)}
                              style={{
                                background: 'linear-gradient(135deg, #2196f3, #21cbf3)',
                                color: 'white',
                                padding: '1rem 1.5rem',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              💾 Save
                            </button>
                            <button
                              onClick={() => setEditingVendor(null)}
                              style={{
                                background: 'white',
                                color: '#666',
                                padding: '1rem 1.5rem',
                                border: '2px solid #666',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1rem'
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(vendor)}
                              style={{
                                background: 'linear-gradient(135deg, #2196f3, #21cbf3)',
                                color: 'white',
                                padding: '1rem 1.5rem',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleSuspend(vendor.id)}
                              style={{
                                background: 'white',
                                color: '#ff9800',
                                padding: '1rem 1.5rem',
                                border: '2px solid #ff9800',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = '#ff9800';
                                e.currentTarget.style.color = 'white';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.color = '#ff9800';
                              }}
                            >
                              ⏸️ Suspend
                            </button>
                          </>
                        )}
                      </>
                    )}
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

export default AdminDashboard;