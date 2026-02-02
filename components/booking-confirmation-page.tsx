'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle, MapPin, Clock, Users, DollarSign, Phone, Star, Share2 } from 'lucide-react';

interface Ride {
  id: string;
  rider: string;
  avatar: string;
  source: string;
  destination: string;
  time: string;
  price: number;
  seats: number;
}

interface BookingConfirmationPageProps {
  ride: Ride;
  seatsBooked: number;
  onBackHome: () => void;
}

export default function BookingConfirmationPage({
  ride,
  seatsBooked,
  onBackHome,
}: BookingConfirmationPageProps) {
  const totalPrice = ride.price * seatsBooked;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8 px-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Success Badge */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg" />
            <div className="relative bg-background border-4 border-primary rounded-full p-3">
              <CheckCircle className="w-16 h-16 text-primary" />
            </div>
          </div>
        </div>

        {/* Confirmation Message */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Ride Booked!
          </h1>
          <p className="text-base text-muted-foreground">
            Your seat is confirmed. Driver will arrive soon.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          {/* Rider Info */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground flex items-center justify-center font-bold text-xl">
                {ride.avatar}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{ride.rider}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                  <span className="text-xs text-muted-foreground">Highly Rated</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full p-2 h-10 w-10 bg-transparent"
            >
              <Phone className="w-4 h-4" />
            </Button>
          </div>

          {/* Route */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Pickup</p>
                <p className="font-semibold text-foreground text-sm">
                  {ride.source}
                </p>
              </div>
            </div>

            <div className="relative pl-2">
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-secondary" />
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Dropoff</p>
                <p className="font-semibold text-foreground text-sm">
                  {ride.destination}
                </p>
              </div>
            </div>
          </div>

          {/* Ride Details */}
          <div className="grid grid-cols-3 gap-3 py-3 px-3 bg-neutral-50 rounded-lg">
            <div className="text-center">
              <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="text-sm font-semibold text-foreground">{ride.time}</p>
            </div>
            <div className="text-center border-l border-r border-border">
              <Users className="w-4 h-4 text-secondary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Seats</p>
              <p className="text-sm font-semibold text-foreground">{seatsBooked}</p>
            </div>
            <div className="text-center">
              <DollarSign className="w-4 h-4 text-accent mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Per Seat</p>
              <p className="text-sm font-semibold text-foreground">₹{ride.price}</p>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground font-medium">₹{(ride.price * seatsBooked).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Platform Fee</span>
            <span className="text-foreground font-medium">₹0</span>
          </div>
          <div className="border-t border-primary/20 pt-2 flex justify-between">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-xl font-bold text-primary">₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-foreground">What's Next?</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-bold text-primary min-w-6">1.</span>
              <span>Driver will arrive at pickup location</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-primary min-w-6">2.</span>
              <span>You'll receive a notification when driver is nearby</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-primary min-w-6">3.</span>
              <span>Get in and enjoy your ride!</span>
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            onClick={onBackHome}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            Back to Home
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 bg-transparent"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Booking Details
          </Button>
        </div>

        {/* Booking ID */}
        <div className="text-center bg-neutral-50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Booking ID</p>
          <p className="font-mono font-bold text-foreground text-sm">
            #RB{ride.id}{Math.random().toString(36).substring(7).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
