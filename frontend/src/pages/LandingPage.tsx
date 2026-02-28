import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Star, ChevronLeft, ChevronRight, Car } from "lucide-react";
import { MapBackground } from "../components/MapBackground";
import { GlassCard, GradientButton, SecondaryButton } from "../components/UI";
import { FEATURES, TESTIMONIALS } from "../constants";
import { AppStats } from "../types";

export const LandingPage = () => {
  const [stats, setStats] = useState<AppStats>({ users: 0, ridesCompleted: 0 });
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  const nextTestimonial = () => setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  const prevTestimonial = () => setTestimonialIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Vertical Rail Quote */}
      <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 z-20">
        <div className="flex items-center gap-4 origin-left -rotate-90">
          <div className="w-12 h-[1px] bg-white/20"></div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 whitespace-nowrap">
            The Future of Urban Mobility
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 text-center">
        <MapBackground />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 max-w-4xl"
        >
          <h1 className="text-5xl md:text-8xl font-display font-bold mb-8 leading-tight tracking-tight">
            Your Journey.<br />
            <span className="gradient-text">Reimagined.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience a premium, community-driven ride-sharing platform designed for the modern world. 
            Fast, secure, and futuristic.
          </p>
        </motion.div>

        {/* Quick Action Bar - New Placement */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-32 left-0 right-0 px-6 z-20"
        >
          <div className="max-w-2xl mx-auto">
            <GlassCard className="p-2 rounded-[2rem] flex flex-col sm:flex-row gap-2" variant="dark">
              <Link to="/book" className="flex-1">
                <GradientButton className="w-full h-16 rounded-[1.8rem] flex items-center justify-center gap-3 text-lg group">
                  Book a Ride 
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight size={18} />
                  </div>
                </GradientButton>
              </Link>
              <Link to="/offer" className="flex-1">
                <SecondaryButton className="w-full h-16 rounded-[1.8rem] flex items-center justify-center gap-3 text-lg hover:bg-white/10">
                  Offer a Ride
                  <Car size={20} className="text-primary-mid" />
                </SecondaryButton>
              </Link>
            </GlassCard>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="absolute bottom-8 left-0 right-0 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">{stats.users.toLocaleString()}+</div>
              <div className="text-xs text-white/40 uppercase tracking-widest mt-1">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">{stats.ridesCompleted.toLocaleString()}+</div>
              <div className="text-xs text-white/40 uppercase tracking-widest mt-1">Rides Completed</div>
            </div>
            <div className="hidden md:block text-center">
              <div className="text-3xl font-bold gradient-text">4.9/5</div>
              <div className="text-xs text-white/40 uppercase tracking-widest mt-1">User Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Why Choose Ride-Along?</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              We've built a platform that prioritizes your safety, comfort, and community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="h-full group">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">What Our Users Say</h2>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <GlassCard className="py-12 px-8 md:px-16" variant="dark">
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(TESTIMONIALS[testimonialIndex].rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-500 fill-yellow-500" size={16} />
                    ))}
                  </div>
                  <p className="text-xl md:text-2xl italic mb-8 text-white/80">
                    "{TESTIMONIALS[testimonialIndex].content}"
                  </p>
                  <div className="font-bold text-lg">{TESTIMONIALS[testimonialIndex].name}</div>
                  <div className="text-sm text-white/40">{TESTIMONIALS[testimonialIndex].role}</div>
                </GlassCard>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 gradient-bg rounded flex items-center justify-center">
                <Car className="text-white" size={18} />
              </div>
              <span className="text-xl font-display font-bold">RideAlong</span>
            </div>
            <p className="text-white/40 max-w-sm mb-6">
              Redefining urban mobility through technology and community. Join thousands of users reimagining their daily commute.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'Instagram', 'LinkedIn', 'GitHub'].map((social) => (
                <a key={social} href="#" className="text-white/40 hover:text-primary-mid transition-colors text-sm">
                  {social}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><Link to="/book" className="hover:text-white transition-colors">Book a Ride</Link></li>
              <li><Link to="/offer" className="hover:text-white transition-colors">Offer a Ride</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">User Dashboard</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Safety Center</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><Link to="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-xs text-white/20">
          &copy; 2026 Ride-Along Inc. All rights reserved. Built with passion for the future.
        </div>
      </footer>
    </div>
  );
};
