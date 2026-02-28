import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  History,
  LogOut,
  Plus,
  Car,
  MapPin,
  Clock,
  ChevronRight,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard, GradientButton, cn } from "../components/UI";
import { Booking } from "../types";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    api
      .getMyBookings()
      .then((res) => res.json())
      .then((data) => {
        setBookings(data.bookings || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCancelBooking = async (id: string) => {
    try {
      await api.cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const sidebarLinks = [
    { name: "Overview", icon: LayoutDashboard, id: "overview" },
    { name: "My Bookings", icon: History, id: "history" },
  ];

  const upcomingBooking = bookings.find(
    (b) => b.status === "confirmed" && new Date(b.ride.departureTime) > new Date()
  );

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div className="min-h-screen pt-20 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-white/5 p-6 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                activeTab === link.id
                  ? "gradient-bg text-white shadow-lg shadow-primary-mid/20"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <link.icon size={18} />
              {link.name}
            </button>
          ))}
        </div>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all text-sm font-medium w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-display font-bold">
              Welcome back,{" "}
              <span className="gradient-text">{user?.name?.split(" ")[0] ?? "Rider"}</span>
            </h1>
            <p className="text-white/40 text-sm mt-1">Check your latest ride updates and bookings.</p>
          </div>
          <div
            className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center font-bold text-sm cursor-default"
            title={user?.name}
          >
            {initials}
          </div>
        </header>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-lg font-bold mb-4">Upcoming Booking</h2>
                {upcomingBooking ? (
                  <GlassCard className="relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 gradient-bg opacity-10 blur-3xl -mr-16 -mt-16 group-hover:opacity-20 transition-opacity"></div>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary-mid/20 flex items-center justify-center">
                            <Car className="text-primary-mid" size={24} />
                          </div>
                          <div>
                            <div className="text-xs text-white/40 uppercase tracking-widest font-bold">Ride to</div>
                            <div className="text-xl font-bold">{upcomingBooking.ride.destination}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/40">
                              <MapPin size={16} />
                            </div>
                            <div>
                              <div className="text-[10px] text-white/40 uppercase">Pickup</div>
                              <div className="text-sm font-medium">{upcomingBooking.ride.source}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/40">
                              <Clock size={16} />
                            </div>
                            <div>
                              <div className="text-[10px] text-white/40 uppercase">Departure</div>
                              <div className="text-sm font-medium">
                                {new Date(upcomingBooking.ride.departureTime).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 w-full md:w-auto">
                        <button
                          onClick={() => handleCancelBooking(upcomingBooking.id)}
                          className="text-sm text-red-400 hover:text-red-300 transition-colors py-2"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ) : (
                  <GlassCard className="flex flex-col items-center justify-center py-12 text-center border-dashed border-white/10">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <Car className="text-white/20" size={32} />
                    </div>
                    <h3 className="text-lg font-bold">No upcoming rides</h3>
                    <p className="text-white/40 text-sm mb-6">Ready to go somewhere? Find your next journey now.</p>
                    <Link to="/book">
                      <GradientButton>Find a Ride</GradientButton>
                    </Link>
                  </GlassCard>
                )}
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Recent Bookings</h2>
                  <button
                    onClick={() => setActiveTab("history")}
                    className="text-xs text-primary-mid font-bold uppercase tracking-widest hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {isLoading ? (
                    [...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 w-full glass rounded-2xl animate-pulse"></div>
                    ))
                  ) : bookings.length === 0 ? (
                    <p className="text-white/40 text-sm">No bookings yet.</p>
                  ) : (
                    bookings.slice(0, 3).map((booking) => (
                      <GlassCard key={booking.id} className="py-4 px-6 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center",
                              booking.status === "confirmed"
                                ? "bg-primary-mid/20 text-primary-mid"
                                : "bg-red-500/20 text-red-500"
                            )}
                          >
                            {booking.status === "confirmed" ? <CheckCircle2 size={20} /> : <X size={20} />}
                          </div>
                          <div>
                            <div className="font-bold text-sm">
                              {booking.ride.source} ? {booking.ride.destination}
                            </div>
                            <div className="text-xs text-white/40">
                              {new Date(booking.ride.departureTime).toLocaleDateString()} · {booking.seats} seat{booking.seats > 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="font-bold text-sm">${booking.totalPrice.toFixed(2)}</div>
                            <div
                              className={cn(
                                "text-[10px] font-bold uppercase tracking-widest",
                                booking.status === "confirmed" ? "text-primary-mid" : "text-red-500"
                              )}
                            >
                              {booking.status}
                            </div>
                          </div>
                          <ChevronRight size={20} className="text-white/20 group-hover:text-white transition-colors" />
                        </div>
                      </GlassCard>
                    ))
                  )}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <section>
                <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/book" className="block">
                    <GlassCard className="p-4 flex flex-col items-center gap-3 text-center hover:bg-white/10">
                      <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary-mid/20">
                        <Plus size={20} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest">Find Ride</span>
                    </GlassCard>
                  </Link>
                  <Link to="/offer" className="block">
                    <GlassCard className="p-4 flex flex-col items-center gap-3 text-center hover:bg-white/10">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Car size={20} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest">Offer Ride</span>
                    </GlassCard>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">All Bookings</h2>
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-24 w-full glass rounded-2xl animate-pulse"></div>
              ))
            ) : bookings.length === 0 ? (
              <GlassCard className="flex flex-col items-center py-16 text-center">
                <AlertCircle className="text-white/20 mb-4" size={48} />
                <p className="text-white/40">No bookings found.</p>
                <Link to="/book" className="mt-4">
                  <GradientButton>Find a Ride</GradientButton>
                </Link>
              </GlassCard>
            ) : (
              bookings.map((booking) => (
                <GlassCard key={booking.id} className="py-6 px-8 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                      <Car size={24} className="text-white/40" />
                    </div>
                    <div>
                      <div className="text-lg font-bold">
                        {booking.ride.source} ? {booking.ride.destination}
                      </div>
                      <div className="text-sm text-white/40">
                        {new Date(booking.ride.departureTime).toLocaleString()} · {booking.seats} seat{booking.seats > 1 ? "s" : ""} · Driver: {booking.ride.driver?.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xl font-bold">${booking.totalPrice.toFixed(2)}</div>
                      <div
                        className={cn(
                          "text-xs font-bold uppercase tracking-widest",
                          booking.status === "confirmed" ? "text-primary-mid" : "text-red-500"
                        )}
                      >
                        {booking.status}
                      </div>
                    </div>
                    {booking.status === "confirmed" && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-xs text-red-400 hover:text-red-300 border border-red-400/20 hover:border-red-400/40 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};
