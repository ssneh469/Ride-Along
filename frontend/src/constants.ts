import { Car, Shield, Zap, Users, MapPin, Clock, CreditCard, Star } from "lucide-react";

export const VEHICLE_TYPES = [
  { id: 'Economy', name: 'Economy', icon: Car, priceMultiplier: 1, description: 'Affordable, everyday rides' },
  { id: 'Premium', name: 'Premium', icon: Shield, priceMultiplier: 1.5, description: 'Spacious sedans with top-rated drivers' },
  { id: 'Luxury', name: 'Luxury', icon: Zap, priceMultiplier: 2.5, description: 'High-end luxury vehicles' },
];

export const FEATURES = [
  { title: 'Safe & Secure', description: 'Verified drivers and 24/7 support for your peace of mind.', icon: Shield },
  { title: 'Community Driven', description: 'Built by the community, for the community. Share rides, save costs.', icon: Users },
  { title: 'Real-time Tracking', description: 'Track your ride in real-time with our advanced mapping system.', icon: MapPin },
  { title: 'Instant Booking', description: 'Get a ride in minutes with our lightning-fast matching algorithm.', icon: Zap },
];

export const TESTIMONIALS = [
  { name: 'Alex Johnson', role: 'Daily Commuter', content: 'Ride-Along has completely changed how I travel to work. The interface is so smooth!', rating: 5 },
  { name: 'Sarah Williams', role: 'Student', content: 'I love the community feel. Offering rides has helped me cover my fuel costs easily.', rating: 5 },
  { name: 'Michael Chen', role: 'Business Traveler', content: 'The Luxury option is fantastic for meeting clients. Premium service every time.', rating: 4 },
];
