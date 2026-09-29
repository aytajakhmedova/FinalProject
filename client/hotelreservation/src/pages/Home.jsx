import React, { useState } from 'react';
import Hero from '../components/Hero/Hero';
import HolidaySection from '../components/HolidaySection/HolidaySection';
import Destinations from '../components/Destinations/Destinations';
import FeaturedHotels from '../components/FeaturedHotels/FeaturedHotels';
import ImageGallery from '../components/ImageGallery/ImageGallery';

const Home = ({ currency, favorites, onToggleFavorite }) => {
  const [query, setQuery] = useState(null);
  const [serviceType, setServiceType] = useState('hotel');

  const handleSearch = (nextQuery) => {
    setQuery(nextQuery);
    setServiceType(nextQuery.type);
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
      />
      <ImageGallery />
    </>
  );
};

export default Home;
