import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { FaCheckCircle, FaHotel, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import { formatDate } from '../../data/roomsData';
import './BookingSuccess.css';

const BookingSuccess = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return <Navigate to="/dashboard" replace />;
  }

  const confirmation = booking.confirmationNumber || booking.id;
  const hotelName = booking.hotelName || booking.hotel?.name || booking.hotel?.title;
  const roomName = booking.roomType || booking.room?.name;
  const total = booking.totalPrice ?? booking.priceBreakdown?.total ?? 0;

  return (
    <div className="booking-success-page">
      <div className="booking-success-card">
        <FaCheckCircle className="success-icon" />
        <h1>Rezervasiya təsdiqləndi</h1>
        <p className="success-lead">Təsdiq nömrənizi saxlayın — otelə gəldikdə bunu göstərin.</p>

        <div className="confirmation-box">
          <span>Təsdiq nömrəsi</span>
          <strong>{confirmation}</strong>
        </div>

        <div className="success-details">
          <div>
            <FaHotel />
            <span>{hotelName} · {roomName}</span>
          </div>
          <div>
            <FaCalendarAlt />
            <span>{formatDate(booking.checkIn)} — {formatDate(booking.checkOut)}</span>
          </div>
          <div>
            <FaUsers />
            <span>{booking.guests} nəfər · {booking.nights} gecə · ₼{total}</span>
          </div>
        </div>

        <div className="success-actions">
          <Link to={`/reservations/${booking.id}`} className="btn-success-primary">
            Rezervasiyaya bax
          </Link>
          <Link to="/dashboard" className="btn-success-secondary">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
