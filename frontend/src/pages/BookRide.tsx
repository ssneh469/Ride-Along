import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Navigation, Users, Car, Search, Check, AlertCircle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlassCard, GradientButton, SecondaryButton } from "../components/UI";
import { Ride } from "../types";
import { api } from "../lib/api";

export const BookRide = () => {
  const [step, setStep] = useState<"search" | "results" | "confirm">("search");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [rides, setRides] = useState<Ride[]>([]);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [seats, setSeats] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setError("");
    try {
      const res = await api.getRides({ source, destination });
      const data = await res.json();
      setRides(data.rides || []);
      setStep("results");
    } catch {
      setError("Failed to search rides. Is the backend running?");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (ride: Ride) => {
    setSelectedRide(ride);
    setStep("confirm");
  };

  const handleBook = async () => {
    if (!selectedRide) return;
    setIsBooking(true);
    setError("");
    try {
      const res = await api.createBooking(selectedRide.id, seats);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Booking failed");
        setIsBooking(false);
        return;
      }
      navigate("/dashboard");
    } catch {
      setError("Booking failed. Please try again.");
      setIsBooking(false);
    }
  };

  const totalPrice = selectedRide ? selectedRide.pricePerSeat * seats : 0;

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative">
      <div className="max-w-3xl mx-auto relative z-10">
        <header className="mb-10">
          <h1 className="text-4xl font-display font-bold mb-2">
            Find a <span className="gradient-text">Ride</span>
          </h1>
          <p className="text-white/40">Search available rides and book your seat.</p>
        </header>

        {error && (
          <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl p-3 mb-6 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === "search" && (
            <motion.div key="search" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <GlassCard className="p-8" variant="dark">
                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-mid">
                        <MapPin size={20} />
                      </div>
                      <input
                        type="text"
                        placeholder="From (e.g. New York)"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary-mid transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500">
                        <Navigation size={20} />
                      </div>
                      <input
                        type="text"
                        placeholder="To (e.g. Boston)"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                  <GradientButton
                    type="submit"
                    disabled={isSearching}
                    className="w-full h-14 flex items-center justify-center gap-2 text-lg"
                  >
                    {isSearching ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        <Search size={20} /> Search Rides
                      </>
                    )}
                  </GradientButton>
                </form>
              </GlassCard>
            </motion.div>
          )}

          {step === "results" && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/60 text-sm">
                  {rides.length} ride{rides.length !== 1 ? "s" : ""} found
                  {source && ` from ${source}`}
                  {destination && ` to ${destination}`}
                </p>
                <button onClick={() => setStep("search")} className="text-xs text-primary-mid font-bold uppercase tracking-widest hover:underline">
                  ← New Search
                </button>
              </div>

              {rides.length === 0 ? (
                <GlassCard className="flex flex-col items-center py-16 text-center">
                  <Car className="text-white/20 mb-4" size={48} />
                  <h3 className="text-lg font-bold">No rides found</h3>
                  <p className="text-white/40 text-sm mb-6">Try a different route or check back later.</p>
                  <GradientButton onClick={() => setStep("search")}>Search Again</GradientButton>
                </GlassCard>
              ) : (
                rides.map((ride) => (
                  <GlassCard
                    key={ride.id}
                    className="py-5 px-6 flex items-center justify-between cursor-pointer hover:bg-white/10"
                    onClick={() => handleSelect(ride)}
                  >
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">
                        {ride.source} → {ride.destination}
                      </div>
                      <div className="text-sm text-white/40 flex items-center gap-4">
                        <span>{new Date(ride.departureTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>
                        <span className="flex items-center gap-1">
                          <Users size={14} /> {ride.seatsAvailable} seat{ride.seatsAvailable !== 1 ? "s" : ""} left
                        </span>
                        <span>Driver: {ride.driver?.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary-mid">${ride.pricePerSeat.toFixed(2)}</div>
                        <div className="text-[10px] text-white/40 uppercase">per seat</div>
                      </div>
                      <ChevronRight size={20} className="text-white/40" />
                    </div>
                  </GlassCard>
                ))
              )}
            </motion.div>
          )}

          {step === "confirm" && selectedRide && (
            <motion.div key="confirm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <GlassCard className="p-8 space-y-6" variant="dark">
                <h2 className="text-xl font-bold">Confirm Booking</h2>

                <div className="space-y-4 bg-white/5 rounded-xl p-5 border border-white/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Route</span>
                    <span className="font-semibold">{selectedRide.source} → {selectedRide.destination}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Departure</span>
                    <span className="font-semibold">
                      {new Date(selectedRide.departureTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Driver</span>
                    <span className="font-semibold">{selectedRide.driver?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Price per seat</span>
                    <span className="font-semibold">${selectedRide.pricePerSeat.toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3 block">
                    Number of Seats
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSeats((s) => Math.max(1, s - 1))}
                      className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white transition-colors text-xl font-bold"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold w-8 text-center">{seats}</span>
                    <button
                      onClick={() => setSeats((s) => Math.min(selectedRide.seatsAvailable, s + 1))}
                      className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white transition-colors text-xl font-bold"
                    >
                      +
                    </button>
                    <span className="text-sm text-white/40 ml-2">
                      ({selectedRide.seatsAvailable} available)
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                  <div>
                    <div className="text-white/40 text-sm">Total</div>
                    <div className="text-2xl font-bold gradient-text">${totalPrice.toFixed(2)}</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <SecondaryButton onClick={() => setStep("results")} className="flex-1">
                    Back
                  </SecondaryButton>
                  <GradientButton
                    onClick={handleBook}
                    disabled={isBooking}
                    className="flex-[2] flex items-center justify-center gap-2"
                  >
                    {isBooking ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        <Check size={18} /> Confirm Booking
                      </>
                    )}
                  </GradientButton>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
