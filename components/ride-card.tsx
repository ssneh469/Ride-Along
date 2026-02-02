'use client';

import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, Star } from 'lucide-react';

interface RideCardProps {
  id: string;
  rider: string;
  avatar: string;
  source: string;
  destination: string;
  time: string;
  price: number;
  seats: number;
  rating: number;
  reviews: number;
  onBook: (rideId: string) => void;
}

export default function RideCard({
  id,
  rider,
  avatar,
  source,
  destination,
  time,
  price,
  seats,
  rating,
  reviews,
  onBook,
}: RideCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3 hover:shadow-md transition-shadow">
      {/* Rider Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground flex items-center justify-center font-bold text-lg">
            {avatar}
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">{rider}</h3>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" />
              <span className="text-xs text-muted-foreground">
                {rating} ({reviews} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Route */}
      <div className="space-y-2 bg-neutral-50 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">From</p>
            <p className="font-semibold text-foreground text-sm">{source}</p>
          </div>
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">To</p>
            <p className="font-semibold text-foreground text-sm">{destination}</p>
          </div>
        </div>
      </div>

      {/* Details Row */}
      <div className="flex items-center justify-between gap-2 pt-2">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-foreground font-medium">{time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-secondary" />
          <span className="text-foreground font-medium">{seats} seat{seats > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Price and Button */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground">Price per seat</p>
          <p className="text-2xl font-bold text-primary">₹{price}</p>
        </div>
        <Button
          onClick={() => onBook(id)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
        >
          Book Seat
        </Button>
      </div>
    </div>
  );
}
