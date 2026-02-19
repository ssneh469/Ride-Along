'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { login, register, logout, getUser, getToken } from '@/lib/api';

interface HeaderProps {
  onAuthChange?: (isLoggedIn: boolean) => void;
}

export default function Header({ onAuthChange }: HeaderProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  useEffect(() => {
    const token = getToken();
    const user = getUser();
    if (token && user) {
      setIsLoggedIn(true);
      setUserName(user.name);
      onAuthChange?.(true);
    }
  }, [onAuthChange]);

  const toggleModal = () => {
    setShowLoginModal(!showLoginModal);
    setError('');
    setFormData({ name: '', email: '', password: '', phone: '' });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let res;
      if (isLogin) {
        res = await login(formData.email, formData.password);
      } else {
        res = await register(formData.name, formData.email, formData.password, formData.phone);
      }

      if (res.ok) {
        const user = res.data.user as { name: string };
        setIsLoggedIn(true);
        setUserName(user.name);
        setShowLoginModal(false);
        onAuthChange?.(true);
      } else {
        setError((res.data.error as string) || 'Something went wrong');
      }
    } catch {
      setError('Cannot connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUserName('');
    onAuthChange?.(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">R</span>
            </div>
            <span className="font-semibold text-lg text-foreground">RideShare</span>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Hi, <span className="font-semibold text-foreground">{userName}</span>
              </span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-sm bg-transparent"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={toggleModal}
                className="text-sm bg-transparent"
              >
                Login
              </Button>
              <Button
                onClick={() => {
                  setIsLogin(false);
                  setShowLoginModal(true);
                  setError('');
                }}
                className="text-sm bg-primary text-primary-foreground hover:bg-primary hover:opacity-90"
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </header>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {isLogin ? 'Login' : 'Create Account'}
              </h2>
              <button
                onClick={toggleModal}
                className="text-neutral-600 hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary hover:opacity-90 font-medium"
              >
                {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-neutral-600">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
              </span>
              <button
                onClick={toggleForm}
                className="text-primary font-semibold hover:underline"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
