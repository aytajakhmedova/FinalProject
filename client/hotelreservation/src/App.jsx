import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Hotels from './pages/Hotels/Hotels';
import HotelDetail from './pages/HotelDetail/HotelDetail';
import RoomDetail from './pages/RoomDetail/RoomDetail';
import Dashboard from './pages/Dashboard/Dashboard';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [currency, setCurrency] = useState('AZN');
  const [serviceType, setServiceType] = useState('hotel');
  const [favorites, setFavorites] = useState([]);
  const [toast, setToast] = useState('');

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

  return (
    <BrowserRouter>
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
        
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                currency={currency}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            } 
          />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

        <Footer />

        {toast && <div className="app-toast">{toast}</div>}
      </div>
    </BrowserRouter>
  );
}

export default App;
