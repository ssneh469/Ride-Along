import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Navigation, Calendar, Clock, Users, DollarSign, Check, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlassCard, GradientButton, SecondaryButton, cn } from "../components/UI";
import { api } from "../lib/api";

export const OfferRide = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    date: "",
    time: "",
    seats: 3,
    pricePerSeat: 10,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const departureTime = new Date(`${formData.date}T${formData.time}`).toISOString();
      const res = await api.createRide({
        source: formData.source,
        destination: formData.destination,
        departureTime,
        seats: formData.seats,
        pricePerSeat: formData.pricePerSeat,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create ride");
        setIsSubmitting(false);
        return;
      }
      navigate("/dashboard");
    } catch {
      setError("Failed to offer ride. Please try again.");
      setIsSubmitting(false);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative">
      <div className="max-w-2xl mx-auto relative z-10">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-2">
            Offer a <span className="gradient-text">Ride</span>
          </h1>
          <p className="text-white/40">Share your journey and help the community.</p>
        </header>

        {error && (
          <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl p-3 mb-6 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
                    step >= s
                      ? "gradient-bg text-white shadow-lg shadow-primary-mid/20"
                      : "bg-white/5 text-white/40 border border-white/10"
                  )}
                >
                  {step > s ? <Check size={20} /> : s}
                </div>
                <span
                  className={cn(
                    "text-[10px] uppercase font-bold tracking-widest",
                    step >= s ? "text-primary-mid" : "text-white/20"
                  )}
                >
                  {s === 1 ? "Route" : s === 2 ? "Schedule" : "Details"}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-bg"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <GlassCard className="p-8" variant="dark">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold mb-6">Where are you going?</h2>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-mid">
                      <MapPin size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="Starting Point"
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary-mid transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500">
                      <Navigation size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="Destination"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
                <GradientButton
                  disabled={!formData.source || !formData.destination}
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight size={20} />
                </GradientButton>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold mb-6">When are you leaving?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                      <Calendar size={20} />
                    </div>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary-mid transition-colors text-white"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                      <Clock size={20} />
                    </div>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary-mid transition-colors text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <SecondaryButton onClick={handleBack} className="flex-1 flex items-center justify-center gap-2">
                    <ChevronLeft size={20} /> Back
                  </SecondaryButton>
                  <GradientButton
                    disabled={!formData.date || !formData.time}
                    onClick={handleNext}
                    className="flex-[2] flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight size={20} />
                  </GradientButton>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold mb-6">Final Details</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3 block">
                      Available Seats
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-primary-mid">
                        <Users size={24} />
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="6"
                        value={formData.seats}
                        onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                        className="flex-1 accent-primary-mid"
                      />
                      <span className="text-2xl font-bold w-8 text-center">{formData.seats}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3 block">
                      Price Per Seat ($)
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500">
                        <DollarSign size={24} />
                      </div>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        step="0.5"
                        value={formData.pricePerSeat}
                        onChange={(e) => setFormData({ ...formData, pricePerSeat: parseFloat(e.target.value) || 0 })}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary-mid transition-colors"
                      />
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-5 space-y-3 border border-white/10">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Route</span>
                      <span className="font-semibold">{formData.source} → {formData.destination}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Departure</span>
                      <span className="font-semibold">{formData.date} at {formData.time}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Seats</span>
                      <span className="font-semibold">{formData.seats}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Price per seat</span>
                      <span className="font-semibold">${formData.pricePerSeat.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <SecondaryButton onClick={handleBack} className="flex-1 flex items-center justify-center gap-2">
                    <ChevronLeft size={20} /> Back
                  </SecondaryButton>
                  <GradientButton
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-[2] flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        <Check size={20} /> Post Ride
                      </>
                    )}
                  </GradientButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </div>
  );
};
