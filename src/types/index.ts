export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface LocationImage {
  id: number;
  imageUrl: string;
  caption?: string;
  displayOrder: number;
}

export interface Location {
  id: number;
  name: string;
  description: string;
  address: string;
  type: LocationType;
  latitude: number;
  longitude: number;
  phoneNumber?: string;
  website?: string;
  imageUrl?: string;
  isActive: boolean;
  averageRating: number;
  reviewCount: number;
  vendorId?: number;
  vendor?: Vendor;
  reviews?: Review[];
  images?: LocationImage[];
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  userId: number;
  locationId: number;
  user: User;
}

export interface Vendor {
  id: number;
  businessName: string;
  contactName: string;
  email: string;
  phoneNumber: string;
  isApproved: boolean;
  createdAt: string;
  businessType: LocationType;
  locations?: Location[];
}

export interface Booking {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
  status: string;
  totalPrice?: number;
  createdAt: string;
  updatedAt: string;
  location: Location;
  user?: User;
}

export enum LocationType {
  Hotel = 1,
  Restaurant = 2,
  Attraction = 3,
  Taxi = 4,
  SouvenirShopping = 5,
  Airbnb = 6
}