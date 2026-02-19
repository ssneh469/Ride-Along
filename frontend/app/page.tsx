'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/header';
import HomePage from '@/components/home-page';
import OfferRidePage from '@/components/offer-ride-page';
import FindRidePage from '@/components/find-ride-page';
import BookingConfirmationPage from '@/components/booking-confirmation-page';

type PageState = 'home' | 'offer' | 'find' | 'confirmation';

interface BookingData {
  ride?: {
    id: string;
    rider: string;
    source: string;
    destination: string;
    time: string;
    price: number;
    seats: number;
    avatar: string;
  };
  seatsBooked?: number;
}

export default function Page() {
  const [currentPage, setCurrentPage] = useState<PageState>('home');
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [, setIsLoggedIn] = useState(false);

  const handleAuthChange = useCallback((loggedIn: boolean) => {
    setIsLoggedIn(loggedIn);
  }, []);

  const handleOfferRide = () => setCurrentPage('offer');
  const handleFindRide = () => setCurrentPage('find');
  const handleBackHome = () => setCurrentPage('home');
  
  const handleBookRide = (ride: BookingData['ride'], seats: number) => {
    setBookingData({ ride, seatsBooked: seats });
    setCurrentPage('confirmation');
  };

  return (
    <>
      <Header onAuthChange={handleAuthChange} />
      <main className="min-h-screen bg-background">
        {currentPage === 'home' && (
          <HomePage 
            onOfferRide={handleOfferRide}
            onFindRide={handleFindRide}
          />
        )}
        {currentPage === 'offer' && (
          <OfferRidePage onBack={handleBackHome} />
        )}
        {currentPage === 'find' && (
          <FindRidePage 
            onBack={handleBackHome}
            onBookRide={handleBookRide}
          />
        )}
      {currentPage === 'confirmation' && (
        <BookingConfirmationPage 
          ride={bookingData.ride!}
          seatsBooked={bookingData.seatsBooked!}
          onBackHome={handleBackHome}
        />
      )}
      </main>
    </>
  );
}
