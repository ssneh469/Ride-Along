'use client';

import { Button } from '@/components/ui/button';
import { MapPin, Users } from 'lucide-react';

interface HomePageProps {
  onOfferRide: () => void;
  onFindRide: () => void;
}

export default function HomePage({ onOfferRide, onFindRide }: HomePageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br from-background via-background to-neutral-50">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground text-balance">
            RideShare
          </h1>
          <p className="text-base text-muted-foreground">
            Quick. Simple. Trustworthy.
          </p>
        </div>

        {/* Main Actions */}
        <div className="space-y-3">
          <Button
            onClick={onOfferRide}
            size="lg"
            className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Offer a Ride
          </Button>

          <Button
            onClick={onFindRide}
            size="lg"
            variant="outline"
            className="w-full h-14 text-base font-semibold border-2 border-secondary text-secondary hover:bg-secondary/10 bg-transparent"
          >
            <Users className="w-5 h-5 mr-2" />
            Find a Ride
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-3 pt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">500+</div>
            <div className="text-xs text-muted-foreground">Active Rides</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">4.9★</div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">100%</div>
            <div className="text-xs text-muted-foreground">Safe</div>
          </div>
        </div>
      </div>
    </div>
  );
}
