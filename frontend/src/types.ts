export interface Driver {
  id: string;
  name: string;
  avatar?: string | null;
  phone?: string | null;
}

export interface Ride {
  id: string;
  source: string;
  destination: string;
  departureTime: string;
  seats: number;
  seatsAvailable: number;
  pricePerSeat: number;
  status: 'active' | 'cancelled';
  driver: Driver;
  _count?: { bookings: number };
  createdAt: string;
}

export interface Booking {
  id: string;
  seats: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  ride: Ride;
  user?: Driver;
}

export interface AppStats {
  users: number;
  ridesCompleted: number;
}
