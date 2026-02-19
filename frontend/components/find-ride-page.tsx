'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RideCard from '@/components/ride-card';
import { ArrowLeft, MapPin, Search } from 'lucide-react';
import { getRides, createBooking, getToken } from '@/lib/api';

interface Ride {
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
}

interface FindRidePageProps {
  onBack: () => void;
  onBookRide: (ride: Ride, seats: number) => void;
}

export default function FindRidePage({ onBack, onBookRide }: FindRidePageProps) {
  const [searchData, setSearchData] = useState({
    destination: '',
    date: '',
  });

  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSeats, setSelectedSeats] = useState<Record<string, number>>({});

  // Fetch rides on mount
  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async (destination?: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await getRides(destination ? { destination } : undefined);
      if (res.ok) {
        const apiRides = (res.data.rides as Array<{
          id: string;
          source: string;
          destination: string;
          departureTime: string;
          pricePerSeat: number;
          seatsAvailable: number;
          driver: { id: string; name: string; avatar: string | null };
        }>).map(r => ({
          id: r.id,
          rider: r.driver.name,
          avatar: r.driver.avatar || r.driver.name.charAt(0),
          source: r.source,
          destination: r.destination,
          time: r.departureTime,
          price: r.pricePerSeat,
          seats: r.seatsAvailable,
          rating: 4.8,
          reviews: Math.floor(Math.random() * 30) + 5,
        }));
        setRides(apiRides);
      } else {
        setError('Failed to load rides');
      }
    } catch {
      setError('Cannot connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRides(searchData.destination);
  };

  const handleBookRide = async (rideId: string) => {
    if (!getToken()) {
      setError('Please login first to book a ride.');
      return;
    }

    const ride = rides.find(r => r.id === rideId);
    const seats = selectedSeats[rideId] || 1;
    if (!ride) return;

    try {
      const res = await createBooking(rideId, seats);
      if (res.ok) {
        onBookRide(ride, seats);
      } else {
        setError((res.data.error as string) || 'Failed to book ride');
      }
    } catch {
      setError('Cannot connect to server. Make sure the backend is running.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border p-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Find a Ride</h1>
      </div>

      {/* Search Form */}
      <div className="bg-card border-b border-border p-4">
        <form onSubmit={handleSearch} className="space-y-3 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 bg-neutral-50 rounded-lg px-3 py-2">
            <MapPin className="w-5 h-5 text-secondary flex-shrink-0" />
            <Input
              type="text"
              placeholder="Where are you going?"
              value={searchData.destination}
              onChange={(e) =>
                setSearchData(prev => ({ ...prev, destination: e.target.value }))
              }
              className="flex-1 bg-transparent border-0 p-0 text-foreground placeholder-muted-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="date"
              value={searchData.date}
              onChange={(e) =>
                setSearchData(prev => ({ ...prev, date: e.target.value }))
              }
              className="w-full"
            />
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </form>
      </div>

      {/* Results */}
      <div className="p-4 max-w-2xl mx-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Available Rides <span className="text-muted-foreground">({rides.length})</span>
          </h2>
          <p className="text-sm text-muted-foreground">Departing today</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading rides...</div>
        ) : rides.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No rides available yet.</div>
        ) : (
        <div className="space-y-3">
          {rides.map(ride => (
            <div key={ride.id} className="space-y-3">
              <RideCard
                {...ride}
                onBook={handleBookRide}
              />
              <div className="bg-neutral-50 rounded-lg p-3 flex items-center gap-3">
                <label className="text-sm font-medium text-foreground">Seats:</label>
                <select
                  value={selectedSeats[ride.id] || 1}
                  onChange={(e) =>
                    setSelectedSeats(prev => ({
                      ...prev,
                      [ride.id]: parseInt(e.target.value),
                    }))
                  }
                  className="px-3 py-1.5 border border-border rounded-lg bg-background text-sm text-foreground"
                >
                  {Array.from({ length: ride.seats }, (_, i) => i + 1).map(
                    num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Seat' : 'Seats'}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full mt-6 bg-transparent"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
