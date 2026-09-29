import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Hotels from './pages/Hotels/Hotels';
import HotelDetail from './pages/HotelDetail/HotelDetail';
import RoomDetail from './pages/RoomDetail/RoomDetail';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile/Profile';
import AdminLayout from './layouts/AdminLayout/AdminLayout';
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import AdminHotels from './pages/Admin/Hotels/AdminHotels';
import AdminBookings from './pages/Admin/Bookings/AdminBookings';
import AdminUsers from './pages/Admin/Users/AdminUsers';
import AdminAnalytics from './pages/Admin/Analytics/AdminAnalytics';
import AdminSettings from './pages/Admin/Settings/AdminSettings';
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
        <Routes>
          {/* Public Routes with Header & Footer */}
          <Route path="/" element={
            <>
              <Header
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                currency={currency}
                onCurrencyChange={changeCurrency}
                onServiceChange={(type) => setServiceType(type)}
                favoriteCount={favorites.length}
              />
              <Home 
                currency={currency}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
              <Footer />
            </>
          } />
          
          <Route path="/hotels" element={
            <>
              <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} currency={currency} onCurrencyChange={changeCurrency} onServiceChange={(type) => setServiceType(type)} favoriteCount={favorites.length} />
              <Hotels />
              <Footer />
            </>
          } />
          
          <Route path="/hotels/:id" element={
            <>
              <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} currency={currency} onCurrencyChange={changeCurrency} onServiceChange={(type) => setServiceType(type)} favoriteCount={favorites.length} />
              <HotelDetail />
              <Footer />
            </>
          } />
          
          <Route path="/rooms/:id" element={
            <>
              <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} currency={currency} onCurrencyChange={changeCurrency} onServiceChange={(type) => setServiceType(type)} favoriteCount={favorites.length} />
              <RoomDetail />
              <Footer />
            </>
          } />
          
          <Route path="/dashboard" element={
            <>
              <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} currency={currency} onCurrencyChange={changeCurrency} onServiceChange={(type) => setServiceType(type)} favoriteCount={favorites.length} />
              <Dashboard />
              <Footer />
            </>
          } />
          
          <Route path="/profile" element={
            <>
              <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} currency={currency} onCurrencyChange={changeCurrency} onServiceChange={(type) => setServiceType(type)} favoriteCount={favorites.length} />
              <Profile />
              <Footer />
            </>
          } />
          
          {/* Auth Routes without Header & Footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="hotels" element={<AdminHotels />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>

        {toast && <div className="app-toast">{toast}</div>}
      </div>
    </BrowserRouter>
  );
}

export default App;
