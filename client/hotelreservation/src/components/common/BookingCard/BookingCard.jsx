import React, { useState } from 'react';
import { FaCalendarAlt, FaUsers } from 'react-icons/fa';
import './BookingCard.css';

const BookingCard = ({ hotel }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights();
  const total = nights * hotel.pricePerNight;

  const handleBooking = (e) => {
    e.preventDefault();
    alert('Rezervasiya funksiyası gələcəkdə əlavə ediləcək');
  };

  return (
    <div className="booking-card">
      <div className="booking-card-header">
        <div className="booking-price">
          <span className="booking-price-amount">₼{hotel.pricePerNight}</span>
          <span className="booking-price-unit">/ gecə</span>
        </div>
        <div className="booking-rating-small">
          <span className="rating-badge">★ {hotel.rating}</span>
          <span className="review-count-small">({hotel.reviews})</span>
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
            onChange={(e) => setCheckIn(e.target.value)}
            className="booking-input"
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
            min={checkIn}
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
              <span>₼{hotel.pricePerNight} × {nights} gecə</span>
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
