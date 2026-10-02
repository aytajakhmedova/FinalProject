import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaUsers } from 'react-icons/fa';
import './BookingCard.css';

const BookingCard = ({ hotel, room }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const getTodayISO = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setCheckIn(newCheckIn);
    
    // If checkout exists and is before or equal to new checkin, reset it
    if (checkOut && checkOut <= newCheckIn) {
      setCheckOut('');
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights();
  const pricePerNight = room?.pricePerNight || hotel?.pricePerNight || 0;
  const total = nights * pricePerNight;

  const handleBooking = (e) => {
    e.preventDefault();
    
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
      // Save booking data to localStorage for after login
      const bookingData = {
        hotelId: hotel?.id,
        roomId: room?.id,
        checkIn,
        checkOut,
        guests,
        nights,
        total,
      };
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      
      // Redirect to login with return path
      navigate('/login', { state: { from: location.pathname } });
    } else {
      // User is authenticated, proceed to booking
      // TODO: Navigate to booking page or show booking modal
      alert('Rezervasiya funksiyası gələcəkdə əlavə ediləcək');
    }
  };

  return (
    <div className="booking-card">
      <div className="booking-card-header">
        <div className="booking-price">
          <span className="booking-price-amount">₼{pricePerNight}</span>
          <span className="booking-price-unit">/ gecə</span>
        </div>
        <div className="booking-rating-small">
          <span className="rating-badge">★ {hotel?.rating || room?.rating || 0}</span>
          <span className="review-count-small">({hotel?.reviews || 0})</span>
        </div>
      </div>

      <form className="booking-form" onSubmit={handleBooking}>
        <div className="booking-input-group">
          <label className="booking-label">
            <FaCalendarAlt />
            <span>Giriş</span>
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={handleCheckInChange}
            className="booking-input"
            min={getTodayISO()}
            placeholder="Giriş tarixi seçin"
            required
          />
        </div>

        <div className="booking-input-group">
          <label className="booking-label">
            <FaCalendarAlt />
            <span>Çıxış</span>
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="booking-input"
            min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0] : new Date(Date.now() + 86400000).toISOString().split('T')[0]}
            placeholder="Çıxış tarixi seçin"
            disabled={!checkIn}
            required
          />
        </div>

        <div className="booking-input-group">
          <label className="booking-label">
            <FaUsers />
            <span>Qonaqlar</span>
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="booking-input"
          >
            {[1, 2, 3, 4, 5, 6].map(n => (
              <option key={n} value={n}>{n} nəfər</option>
            ))}
          </select>
        </div>

        {nights > 0 && (
          <div className="booking-summary">
            <div className="summary-row">
              <span>₼{pricePerNight} × {nights} gecə</span>
              <span>₼{total}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Cəmi</span>
              <span>₼{total}</span>
            </div>
          </div>
        )}

        <button type="submit" className="booking-submit-btn">
          Rezervasiya et
        </button>
      </form>

      <p className="booking-note">Hələ ödəniş tələb olunmur</p>
    </div>
  );
};

export default BookingCard;
