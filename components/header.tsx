'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const toggleModal = () => setShowLoginModal(!showLoginModal);
  const toggleForm = () => setIsLogin(!isLogin);

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
              }}
              className="text-sm bg-primary text-primary-foreground hover:bg-primary hover:opacity-90"
            >
              Register
            </Button>
          </div>
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

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
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
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
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
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary hover:opacity-90 font-medium"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
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
