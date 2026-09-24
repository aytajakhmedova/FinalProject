import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import PromoSlider from './components/PromoSlider/PromoSlider';
import Stats from './components/Stats/Stats';
import HolidaySection from './components/HolidaySection/HolidaySection';
import FeaturedHotels from './components/FeaturedHotels/FeaturedHotels';
import Testimonials from './components/Testimonials/Testimonials';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // LocalStorage-dan theme oxu
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Hero />
      <PromoSlider />
      <Stats />
      <HolidaySection />
      <FeaturedHotels />
      <Testimonials />
    </div>
  );
}

export default App;
