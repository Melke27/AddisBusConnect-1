// Base coordinates type
export interface Coordinates {
  lat: number;
  lng: number;
}

// Bus status types
export type BusOccupancy = 'low' | 'medium' | 'high';
export type BusStatus = 'in_transit' | 'at_stop' | 'out_of_service' | 'maintenance';

// Bus interface
export interface Bus {
  id: string;
  licensePlate: string;
  routeId: string;
  currentLocation: Coordinates;
  bearing: number; // in degrees (0-360)
  speed: number; // in km/h
  lastUpdated: string; // ISO date string
  nextStopId: string;
  previousStopId: string;
  occupancy: BusOccupancy;
  status: BusStatus;
  vehicleType: 'standard' | 'articulated' | 'minibus';
  capacity: number;
  currentPassengers: number;
  driverId?: string;
}

// Bus stop interface
export interface BusStop {
  id: string;
  name: string;
  location: Coordinates;
  code: string; // Stop code/identifier
  description?: string;
  address: string;
  routes: string[]; // Array of route IDs
  facilities: string[]; // e.g., ['shelter', 'seating', 'lighting']
  isAccessible: boolean;
  images?: string[]; // URLs of stop images
  schedule?: {
    weekdays: string[];
    saturday: string[];
    sunday: string[];
  };
}

// Route interface
export interface Route {
  id: string;
  name: string;
  shortName: string;
  description: string;
  color: string;
  textColor: string; // For text that appears on colored backgrounds
  stops: string[]; // Array of stop IDs in order
  path: Coordinates[]; // Detailed path coordinates for the route
  distance: number; // in kilometers
  estimatedDuration: number; // in minutes
  frequency: {
    peak: number; // minutes between buses during peak hours
    offPeak: number; // minutes between buses during off-peak hours
  };
  operatingHours: {
    start: string; // e.g., "05:00"
    end: string;   // e.g., "23:00"
  };
  isActive: boolean;
}

// User report interface
export interface Report {
  id: string;
  type: 'delay' | 'crowding' | 'safety' | 'maintenance' | 'other';
  userId: string;
  busId?: string;
  routeId?: string;
  stopId?: string;
  description: string;
  status: 'pending' | 'in_review' | 'resolved' | 'rejected';
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  images?: string[]; // URLs of uploaded images
  location?: Coordinates;
  severity: 'low' | 'medium' | 'high' | 'critical';
  adminNotes?: string;
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: 'admin' | 'user' | 'driver' | 'inspector';
  favorites: {
    routes: string[];
    stops: string[];
  };
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  createdAt: string; // ISO date string
  lastLogin: string; // ISO date string
}

// Trip interface for tracking user trips
export interface Trip {
  id: string;
  userId: string;
  startStopId: string;
  endStopId: string;
  routeId: string;
  busId: string;
  startTime: string; // ISO date string
  endTime?: string; // ISO date string (null if trip is in progress)
  fare: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'mobile' | 'pass';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string; // ISO date string
}

// Alert/Notification interface
export interface Alert {
  id: string;
  type: 'delay' | 'cancellation' | 'route_change' | 'general' | 'emergency';
  title: string;
  message: string;
  affectedRoutes: string[];
  affectedStops: string[];
  startTime: string; // ISO date string
  endTime?: string; // ISO date string (null if ongoing)
  priority: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  createdBy: string; // User ID of the admin who created the alert
}

// Feedback interface
export interface Feedback {
  id: string;
  userId: string;
  type: 'suggestion' | 'bug' | 'complaint' | 'praise';
  subject: string;
  message: string;
  rating?: number; // 1-5
  status: 'new' | 'in_review' | 'resolved' | 'rejected';
  response?: string;
  respondedAt?: string; // ISO date string
  respondedBy?: string; // User ID of the admin who responded
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
