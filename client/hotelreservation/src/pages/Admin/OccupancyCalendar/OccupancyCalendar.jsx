import React, { useEffect, useMemo, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaBed, FaCheckCircle } from 'react-icons/fa';
import { getBookings, getHotels } from '../../../api/client';
import './OccupancyCalendar.css';

const OccupancyCalendar = () => {
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [hotelId, setHotelId] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([getHotels(), getBookings()])
      .then(([hotelItems, bookingItems]) => {
        if (!active) return;
        setHotels(hotelItems);
        setBookings(bookingItems);
        setLoadError('');
        setHotelId((current) => {
          if (hotelItems.some((item) => String(item.id) === String(current))) return current;
          return hotelItems[0]?.id || '';
        });
      })
      .catch((error) => {
        if (!active) return;
        setHotels([]);
        setBookings([]);
        setLoadError(error.message || 'Doluluq məlumatları yüklənmədi.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const hotel = hotels.find((item) => item.id === Number(hotelId));
  const rooms = hotel?.rooms || [];

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getMonthName = (date) => date.toLocaleDateString('az-AZ', { month: 'long', year: 'numeric' });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isRoomOccupied = (roomId, day) => {
    const cellISO = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bookings.some((booking) => {
      if (String(booking.roomId) !== String(roomId)) return false;
      if (booking.status === 'cancelled' || booking.status === 'checked-out') return false;
      if (!booking.checkIn || !booking.checkOut) return false;
      return booking.checkIn <= cellISO && cellISO < booking.checkOut;
    });
  };

  const occupiedRoomsPerDay = days.map((day) =>
    rooms.filter((room) => isRoomOccupied(room.id, day)).length
  );

  const totalRooms = rooms.length || 1;
  const averageOccupancy = (
    (occupiedRoomsPerDay.reduce((sum, count) => sum + count, 0) / (totalRooms * daysInMonth)) * 100
  ).toFixed(1);

  const today = new Date();
  const todayIndex = today.getMonth() === month && today.getFullYear() === year
    ? today.getDate() - 1
    : 0;

  const hotelSelect = useMemo(() => hotels.map((item) => (
    <option key={item.id} value={item.id}>{item.title}</option>
  )), [hotels]);

  return (
    <div className="occupancy-calendar-page">
      <div className="calendar-header">
        <div className="header-title">
          <FaCalendarAlt />
          <h1>Doluluq Təqvimi</h1>
        </div>
        <p className="header-subtitle">Cari və gələcək rezervasiyaların otaq üzrə görünüşü</p>
        {!loading && !loadError && (
          <select
            className="occupancy-hotel-select"
            value={hotelId}
            onChange={(e) => setHotelId(Number(e.target.value))}
          >
            {hotelSelect}
          </select>
        )}
      </div>

      {loading && <p className="header-subtitle">Yüklənir...</p>}
      {loadError && <p className="header-subtitle">{loadError}</p>}

      {!loading && !loadError && (
        <>
          <div className="calendar-stats">
            <div className="stat-card">
              <div className="stat-icon rooms"><FaBed /></div>
              <div className="stat-content">
                <div className="stat-value">{rooms.length}</div>
                <div className="stat-label">Cəmi Otaq</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon occupancy"><FaCheckCircle /></div>
              <div className="stat-content">
                <div className="stat-value">{averageOccupancy}%</div>
                <div className="stat-label">Orta Doluluq</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon available"><FaBed /></div>
              <div className="stat-content">
                <div className="stat-value">
                  {Math.max(0, rooms.length - (occupiedRoomsPerDay[todayIndex] || 0))}
                </div>
                <div className="stat-label">Bu gün Boş</div>
              </div>
            </div>
          </div>

          <div className="calendar-controls">
            <button className="btn-month-nav" onClick={previousMonth}><FaChevronLeft /></button>
            <h2 className="current-month">{getMonthName(currentDate)}</h2>
            <button className="btn-month-nav" onClick={nextMonth}><FaChevronRight /></button>
          </div>

          <div className="calendar-legend">
            <div className="legend-item">
              <span className="legend-indicator available"></span>
              <span>Boş</span>
            </div>
            <div className="legend-item">
              <span className="legend-indicator occupied"></span>
              <span>Dolu</span>
            </div>
          </div>

          <div className="calendar-grid-container">
            <div className="calendar-grid">
              <div className="grid-header">
                <div className="room-column-header">Otaq</div>
                {days.map((day) => (
                  <div key={day} className="day-header">{day}</div>
                ))}
              </div>
              {rooms.map((room) => (
                <div key={room.id} className="grid-row">
                  <div className="room-info">
                    <div className="room-number">#{room.id}</div>
                    <div className="room-type">{room.name}</div>
                    <div className="room-capacity">{room.capacity} nəfər</div>
                  </div>
                  {days.map((day) => (
                    <div
                      key={day}
                      className={`day-cell ${isRoomOccupied(room.id, day) ? 'occupied' : 'available'}`}
                      title={isRoomOccupied(room.id, day) ? 'Dolu' : 'Boş'}
                    >
                      {isRoomOccupied(room.id, day) && <span className="occupied-indicator">●</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OccupancyCalendar;
