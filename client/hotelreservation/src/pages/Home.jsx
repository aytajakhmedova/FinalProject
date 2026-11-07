import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import HolidaySection from '../components/HolidaySection/HolidaySection';
import Destinations from '../components/Destinations/Destinations';
import FeaturedHotels from '../components/FeaturedHotels/FeaturedHotels';
import HotelVideoModal from '../components/HotelVideoModal/HotelVideoModal';
import ImageGallery from '../components/ImageGallery/ImageGallery';
import './Home/Home.css';

const Home = ({ currency, favorites, onToggleFavorite }) => {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState('hotel');
  const [videoHotel, setVideoHotel] = useState(null);

  const handleSearch = (nextQuery) => {
    setServiceType(nextQuery.type);
    const params = new URLSearchParams();
    const guests = (nextQuery.guests?.adults || 0) + (nextQuery.guests?.children || 0);
    if (nextQuery.type === 'flight') {
      if (nextQuery.location) params.set('origin', nextQuery.location);
      if (nextQuery.destination) params.set('destination', nextQuery.destination);
      if (nextQuery.checkIn) params.set('date', nextQuery.checkIn);
      if (guests) params.set('passengers', String(guests));
      navigate(`/flight-results?${params.toString()}`);
      return;
    }
    if (nextQuery.type === 'tour') {
      if (nextQuery.location) params.set('destination', nextQuery.location);
      if (nextQuery.checkIn) params.set('date', nextQuery.checkIn);
      if (guests) params.set('guests', String(guests));
      navigate(`/tours?${params.toString()}`);
      return;
    }
    if (nextQuery.location) params.set('location', nextQuery.location);
    if (nextQuery.country) params.set('country', nextQuery.country);
    if (nextQuery.checkIn) params.set('checkIn', nextQuery.checkIn);
    if (nextQuery.checkOut) params.set('checkOut', nextQuery.checkOut);
    if (guests) params.set('guests', String(guests));
    params.set('adults', String(nextQuery.guests.adults));
    params.set('children', String(nextQuery.guests.children));
    params.set('rooms', String(nextQuery.guests.rooms));
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <main className="home-page home-redesign">
      <Hero
        onSearch={handleSearch}
        serviceType={serviceType}
        onServiceChange={setServiceType}
      />
      <HolidaySection />
      <Destinations />
      <FeaturedHotels
        currency={currency}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onPlayVideo={setVideoHotel}
      />
      <ImageGallery />
      {videoHotel && (
        <HotelVideoModal hotel={videoHotel} onClose={() => setVideoHotel(null)} />
      )}
    </main>
  );
};

export default Home;
