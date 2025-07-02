export interface BusStop {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  routes: string[];
  amenities: string[];
}

export interface BusRoute {
  id: string;
  name: string;
  color: string;
  stops: string[];
  fare: number;
  frequency: number; // minutes
}

export interface LiveBus {
  id: string;
  routeId: string;
  currentStop: string;
  nextStop: string;
  estimatedArrival: number; // minutes
  distance: number; // kilometers
  occupancy: 'low' | 'medium' | 'high';
}

export interface Ticket {
  id: string;
  routeId: string;
  fromStop: string;
  toStop: string;
  fare: number;
  purchaseTime: Date;
  validUntil: Date;
  status: 'active' | 'used' | 'expired';
  qrCode: string;
  seats?: string[];
  passengerName?: string;
  passengerPhone?: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  address: string;
}