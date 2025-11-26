import { Location, Vendor } from '../types';

const API_BASE_URL = 'http://localhost:5001/api';

export const locationService = {
  getAll: async (type?: string): Promise<Location[]> => {
    const url = type ? `${API_BASE_URL}/locations?type=${type}` : `${API_BASE_URL}/locations`;
    const response = await fetch(url);
    return response.json();
  },

  getFeatured: async (): Promise<Location[]> => {
    const response = await fetch(`${API_BASE_URL}/locations/featured`);
    return response.json();
  },

  getById: async (id: number): Promise<Location> => {
    const response = await fetch(`${API_BASE_URL}/locations/${id}`);
    return response.json();
  },

  create: async (location: Omit<Location, 'id' | 'averageRating' | 'reviewCount'>): Promise<Location> => {
    const response = await fetch(`${API_BASE_URL}/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    });
    return response.json();
  }
};

export const adminService = {
  getPendingVendors: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/vendors/pending`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Admin API error:', response.status, errorText);
      throw new Error(`Failed to fetch pending vendors: ${response.status}`);
    }
    const data = await response.json();
    console.log('Pending vendors data:', data);
    return data;
  },

  getApprovedVendors: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/vendors/approved`);
    if (!response.ok) {
      throw new Error('Failed to fetch approved vendors');
    }
    return response.json();
  },

  approveVendor: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admin/vendors/${id}/approve`, {
      method: 'PUT'
    });
    if (!response.ok) {
      throw new Error('Failed to approve vendor');
    }
  },

  suspendVendor: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admin/vendors/${id}/suspend`, {
      method: 'PUT'
    });
    if (!response.ok) {
      throw new Error('Failed to suspend vendor');
    }
  },

  updateVendor: async (id: number, data: any): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admin/vendors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update vendor');
    }
  },

  rejectVendor: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admin/vendors/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to reject vendor');
    }
  }
};

export const vendorService = {
  register: async (vendor: Omit<Vendor, 'id' | 'isApproved' | 'createdAt'>): Promise<Vendor> => {
    const response = await fetch(`${API_BASE_URL}/vendors/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendor),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Registration failed: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  },

  login: async (email: string, password: string): Promise<{ vendorId: number; businessName: string }> => {
    const response = await fetch(`${API_BASE_URL}/vendors/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error('Login failed');
    }
    return response.json();
  },

  getVendor: async (id: number): Promise<Vendor> => {
    const response = await fetch(`${API_BASE_URL}/vendors/${id}`);
    return response.json();
  },

  addLocation: async (vendorId: number, location: Omit<Location, 'id' | 'averageRating' | 'reviewCount' | 'vendorId'>): Promise<Location> => {
    console.log('API call - Adding location for vendor:', vendorId);
    console.log('Location data:', location);
    
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', response.status, errorText);
      throw new Error(`Failed to add location: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('API response:', result);
    return result;
  },

  updateLocation: async (vendorId: number, locationId: number, location: Omit<Location, 'id' | 'averageRating' | 'reviewCount' | 'vendorId'>): Promise<Location> => {
    console.log('API call - Updating location:', locationId, 'for vendor:', vendorId);
    console.log('Location data:', location);
    
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/locations/${locationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', response.status, errorText);
      throw new Error(`Failed to update location: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('API response:', result);
    return result;
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/vendors/upload-image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload image: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return `http://localhost:5001${result.imageUrl}`;
  },

  uploadGalleryImage: async (vendorId: number, locationId: number, file: File, caption?: string) => {
    const formData = new FormData();
    formData.append('image', file);
    if (caption) {
      formData.append('caption', caption);
    }

    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/locations/${locationId}/images`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload gallery image: ${response.status} - ${errorText}`);
    }

    return response.json();
  },

  getGalleryImages: async (vendorId: number, locationId: number) => {
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/locations/${locationId}/images`);
    if (!response.ok) throw new Error('Failed to fetch gallery images');
    return response.json();
  },

  deleteGalleryImage: async (vendorId: number, locationId: number, imageId: number) => {
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/locations/${locationId}/images/${imageId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete gallery image');
  }
};

export const userService = {
  register: async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Registration failed');
    }
    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }
    return response.json();
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  }
};

export const reviewService = {
  getLocationReviews: async (locationId: number) => {
    const response = await fetch(`${API_BASE_URL}/reviews/location/${locationId}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  },

  submitReview: async (review: { userId: number; locationId: number; rating: number; comment: string }) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to submit review');
    }
    return response.json();
  },

  submitAnonymousReview: async (review: { locationId: number; rating: number; comment: string; firstName: string; lastName: string; email: string }) => {
    const response = await fetch(`${API_BASE_URL}/reviews/anonymous`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to submit review');
    }
    return response.json();
  },

  updateReview: async (reviewId: number, review: { id: number; userId: number; locationId: number; rating: number; comment: string }) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    if (!response.ok) throw new Error('Failed to update review');
    return response.json();
  },

  deleteReview: async (reviewId: number) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete review');
  }
};

export const bookingService = {
  createBooking: async (booking: {
    userId: number;
    locationId: number;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    specialRequests?: string;
    totalPrice?: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to create booking');
    }
    return response.json();
  },

  getUserBookings: async (userId: number) => {
    const response = await fetch(`${API_BASE_URL}/bookings/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
  },

  getBooking: async (bookingId: number) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`);
    if (!response.ok) throw new Error('Failed to fetch booking');
    return response.json();
  },

  cancelBooking: async (bookingId: number) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'PUT'
    });
    if (!response.ok) throw new Error('Failed to cancel booking');
    return response.json();
  },

  updateBooking: async (bookingId: number, update: {
    checkInDate?: string;
    checkOutDate?: string;
    numberOfGuests?: number;
    specialRequests?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    });
    if (!response.ok) throw new Error('Failed to update booking');
    return response.json();
  }
};