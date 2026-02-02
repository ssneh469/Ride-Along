'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MapPin, Clock, Users, DollarSign } from 'lucide-react';

interface OfferRidePageProps {
  onBack: () => void;
}

export default function OfferRidePage({ onBack }: OfferRidePageProps) {
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    time: '',
    seats: '1',
    pricePerSeat: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Ride offered! ' + JSON.stringify(formData));
    onBack();
  };

  const isFormValid = formData.source && formData.destination && formData.time && formData.pricePerSeat;

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
        <h1 className="text-xl font-bold text-foreground">Offer a Ride</h1>
      </div>

      {/* Form */}
      <div className="p-4 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Route Section */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">Route</label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <Input
                  type="text"
                  name="source"
                  placeholder="Pickup location"
                  value={formData.source}
                  onChange={handleChange}
                  className="flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                <Input
                  type="text"
                  name="destination"
                  placeholder="Dropoff location"
                  value={formData.destination}
                  onChange={handleChange}
                  className="flex-1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Time Section */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Clock className="w-4 h-4 text-primary" />
              Departure Time
            </label>
            <Input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full"
              required
            />
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Users className="w-4 h-4 text-secondary" />
                Seats
              </label>
              <select
                name="seats"
                value={formData.seats}
                onChange={(e) => setFormData(prev => ({ ...prev, seats: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="1">1 Seat</option>
                <option value="2">2 Seats</option>
                <option value="3">3 Seats</option>
                <option value="4">4 Seats</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <DollarSign className="w-4 h-4 text-accent" />
                Price/Seat
              </label>
              <Input
                type="number"
                name="pricePerSeat"
                placeholder="₹50"
                value={formData.pricePerSeat}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3 mt-6">
            <h3 className="font-semibold text-foreground">Ride Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Route:</span>
                <span className="text-foreground font-medium">
                  {formData.source || '—'} → {formData.destination || '—'}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Time:</span>
                <span className="text-foreground font-medium">{formData.time || '—'}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Total Earnings:</span>
                <span className="text-primary font-bold">
                  ₹{formData.pricePerSeat && formData.seats ? (parseInt(formData.pricePerSeat) * parseInt(formData.seats)).toLocaleString('en-IN') : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-4">
            <Button
              type="submit"
              disabled={!isFormValid}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              List Your Ride
            </Button>
            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="w-full h-12 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
