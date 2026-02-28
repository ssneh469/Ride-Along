import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Car, Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn, GradientButton } from "./UI";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Book Ride", path: "/book" },
    { name: "Offer Ride", path: "/offer" },
  ];

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-black/60 backdrop-blur-md border-bottom border-white/10" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center shadow-lg shadow-primary-mid/20 group-hover:rotate-12 transition-transform">
            <Car className="text-white" size={24} />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight">
            Ride<span className="gradient-text">Along</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {!isAuthPage && navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary-mid",
                location.pathname === link.path ? "text-primary-mid" : "text-white/70"
              )}
            >
              {link.name}
            </Link>
          ))}
          {!isAuthPage && <div className="h-6 w-[1px] bg-white/10 mx-2"></div>}

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center font-bold text-sm cursor-default"
                title={user?.name}
              >
                {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-red-400 transition-colors"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          ) : (
            <>
              {location.pathname !== "/login" && (
                <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                  Sign In
                </Link>
              )}
              {location.pathname !== "/register" && (
                <Link to="/register">
                  <GradientButton className="px-5 py-2 text-sm h-auto">Join</GradientButton>
                </Link>
              )}
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {!isAuthPage && navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-lg font-medium py-2",
                    location.pathname === link.path ? "text-primary-mid" : "text-white/70"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              {!isAuthPage && <div className="h-[1px] bg-white/10 my-2"></div>}

              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center font-bold text-sm">
                      {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-white/70">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-lg font-medium py-2 text-red-400"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  {location.pathname !== "/login" && (
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium py-2 text-white/70">
                      Sign In
                    </Link>
                  )}
                  {location.pathname !== "/register" && (
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <GradientButton className="w-full">Join Now</GradientButton>
                    </Link>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
