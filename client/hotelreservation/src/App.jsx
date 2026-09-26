import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import PromoSlider from './components/PromoSlider/PromoSlider';
import Stats from './components/Stats/Stats';
import HolidaySection from './components/HolidaySection/HolidaySection';
import Destinations from './components/Destinations/Destinations';
import FeaturedHotels from './components/FeaturedHotels/FeaturedHotels';
import HotelResults from './components/HotelResults/HotelResults';
import HotelVideoModal from './components/HotelVideoModal/HotelVideoModal';
import Experiences from './components/Experiences/Experiences';
import ImageGallery from './components/ImageGallery/ImageGallery';
import Testimonials from './components/Testimonials/Testimonials';
import Newsletter from './components/Newsletter/Newsletter';
import Footer from './components/Footer/Footer';
import { HOTELS } from './data/travelData';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [currency, setCurrency] = useState('AZN');
  const [serviceType, setServiceType] = useState('hotel');
  const [query, setQuery] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [toast, setToast] = useState('');
  const [videoHotel, setVideoHotel] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedCurrency = localStorage.getItem('currency');
    const savedFavs = localStorage.getItem('favorites');
    if (savedTheme) setDarkMode(savedTheme === 'dark');
    if (savedCurrency) setCurrency(savedCurrency);
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const changeCurrency = (value) => {
    setCurrency(value);
    localStorage.setItem('currency', value);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('favorites', JSON.stringify(next));
      return next;
    });
  };

  const handleSearch = (nextQuery) => {
    setQuery(nextQuery);
    setServiceType(nextQuery.type);
    setToast(
      nextQuery.type === 'hotel'
        ? 'Otellər yeniləndi'
        : nextQuery.type === 'flight'
          ? 'Uçuş axtarışı hazırdır — aşağıda otel+transfer paketlərinə baxın'
          : nextQuery.type === 'tour'
            ? 'Turlar bölməsinə keçirik'
            : 'Taksi üçün otel transferlərini göstəririk'
    );
    const target = nextQuery.type === 'tour' ? '#tours' : '#results';
    setTimeout(() => {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleBook = (item) => {
    setToast(`“${item.title}” səbətə əlavə olundu — tezliklə təsdiq səhifəsi`);
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        currency={currency}
        onCurrencyChange={changeCurrency}
        onServiceChange={(type) => {
          setServiceType(type);
        }}
        favoriteCount={favorites.length}
      />
      <Hero
        onSearch={handleSearch}
        serviceType={serviceType}
        onServiceChange={setServiceType}
      />
      <PromoSlider />
      <Stats />
      <HolidaySection />
      <Destinations
        onPickCity={(country) =>
          handleSearch({
            type: 'hotel',
            location: country,
            checkIn: query?.checkIn,
            checkOut: query?.checkOut,
            guests: query?.guests || { adults: 2, children: 0, rooms: 1 },
          })
        }
      />
      <FeaturedHotels
        currency={currency}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onPlayVideo={setVideoHotel}
        onDiscover={(hotel) =>
          handleSearch({
            type: 'hotel',
            location: hotel.city,
            checkIn: query?.checkIn,
            checkOut: query?.checkOut,
            guests: query?.guests || { adults: 2, children: 0, rooms: 1 },
          })
        }
      />
      <HotelResults
        hotels={HOTELS}
        query={query}
        currency={currency}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onBook={handleBook}
        onPlayVideo={setVideoHotel}
      />
      <Experiences currency={currency} onBook={handleBook} />
      <ImageGallery />
      <Testimonials />
      <Newsletter />
      <Footer />

      {toast && <div className="app-toast">{toast}</div>}
      {videoHotel && (
        <HotelVideoModal hotel={videoHotel} onClose={() => setVideoHotel(null)} />
      )}
    </div>
  );
}

export default App;
