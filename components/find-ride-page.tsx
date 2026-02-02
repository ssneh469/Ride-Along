'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RideCard from '@/components/ride-card';
import { ArrowLeft, MapPin, Search } from 'lucide-react';

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

const MOCK_RIDES: Ride[] = [
  {
    id: '1',
    rider: 'Rahul',
    avatar: 'R',
    source: 'Downtown Metro Station',
    destination: 'Tech Park Campus',
    time: '08:30 AM',
    price: 60,
    seats: 2,
    rating: 4.9,
    reviews: 24,
  },
  {
    id: '2',
    rider: 'Priya',
    avatar: 'P',
    source: 'Central Bus Terminal',
    destination: 'Tech Park Campus',
    time: '08:45 AM',
    price: 50,
    seats: 1,
    rating: 4.8,
    reviews: 18,
  },
  {
    id: '3',
    rider: 'Arjun',
    avatar: 'A',
    source: 'Downtown Metro Station',
    destination: 'Tech Park Campus',
    time: '09:00 AM',
    price: 70,
    seats: 3,
    rating: 5.0,
    reviews: 12,
  },
  {
    id: '4',
    rider: 'Sneha',
    avatar: 'S',
    source: 'Airport Road',
    destination: 'Tech Park Campus',
    time: '08:15 AM',
    price: 120,
    seats: 1,
    rating: 4.7,
    reviews: 31,
  },
];

export default function FindRidePage({ onBack, onBookRide }: FindRidePageProps) {
  const [searchData, setSearchData] = useState({
    destination: '',
    date: '',
  });

  const [selectedSeats, setSelectedSeats] = useState<Record<string, number>>({});

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchData);
  };

  const handleBookRide = (rideId: string) => {
    const ride = MOCK_RIDES.find(r => r.id === rideId);
    const seats = selectedSeats[rideId] || 1;
    if (ride) {
      onBookRide(ride, seats);
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
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Available Rides <span className="text-muted-foreground">({MOCK_RIDES.length})</span>
          </h2>
          <p className="text-sm text-muted-foreground">Departing today</p>
        </div>

        <div className="space-y-3">
          {MOCK_RIDES.map(ride => (
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
