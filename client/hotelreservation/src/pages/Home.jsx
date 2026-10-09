import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import HolidaySection from '../components/HolidaySection/HolidaySection';
import Destinations from '../components/Destinations/Destinations';
import FeaturedHotels from '../components/FeaturedHotels/FeaturedHotels';
import HotelVideoModal from '../components/HotelVideoModal/HotelVideoModal';
import ImageGallery from '../components/ImageGallery/ImageGallery';

const Home = ({ currency, favorites, onToggleFavorite }) => {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState('hotel');
  const [videoHotel, setVideoHotel] = useState(null);

  const handleSearch = (nextQuery) => {
    setServiceType(nextQuery.type);
    if (nextQuery.type === 'flight') {
      navigate('/flights');
      return;
    }
    if (nextQuery.type === 'tour') {
      navigate('/tours');
      return;
    }
    const params = new URLSearchParams();
    if (nextQuery.location) params.set('location', nextQuery.location);
    if (nextQuery.checkIn) params.set('checkIn', nextQuery.checkIn);
    if (nextQuery.checkOut) params.set('checkOut', nextQuery.checkOut);
    const guests = (nextQuery.guests?.adults || 0) + (nextQuery.guests?.children || 0);
    if (guests) params.set('guests', String(guests));
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <>
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
    </>
  );
};

export default Home;
