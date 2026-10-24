import React, { useEffect, useMemo, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaBed, FaCheckCircle } from 'react-icons/fa';
import { getBookings, getHotels, getReservations } from '../../../api/client';
import './OccupancyCalendar.css';

const STATUS_LABELS = {
  confirmed: 'Təsdiqlənib',
  upcoming: 'Təsdiqlənib',
  'checked-in': 'Giriş edilib',
};

const occupiesRoom = (status) => {
  const value = String(status || '').toLowerCase();
  return value === 'confirmed' || value === 'checked-in' || value === 'upcoming';
};

const toISODate = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value.slice(0, 10);
  return String(value).slice(0, 10);
};

const shiftISODate = (iso, days) => {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const collectStays = (bookings, reservations) => {
  const items = [];

  bookings.forEach((booking) => {
    if (!occupiesRoom(booking.status)) return;
    if ((booking.bookingType || 'hotel') !== 'hotel') return;
    if (!booking.roomId || !booking.checkIn || !booking.checkOut) return;
    items.push({
      roomId: Number(booking.roomId),
      hotelId: Number(booking.hotelId) || null,
      hotelName: booking.hotelName || booking.location || '',
      roomName: booking.roomName || booking.roomType || booking.itemName || '',
      status: booking.status === 'checked-in' ? 'checked-in' : 'confirmed',
      code: booking.code || booking.confirmationNumber || '',
      guestName: booking.guestName || '',
      checkIn: toISODate(booking.checkIn),
      checkOut: toISODate(booking.checkOut),
    });
  });

  reservations.forEach((reservation) => {
    if (!occupiesRoom(reservation.status)) return;
    if (!reservation.roomId || !reservation.checkIn || !reservation.checkOut) return;
    items.push({
      roomId: Number(reservation.roomId),
      hotelId: Number(reservation.hotelId) || null,
      hotelName: reservation.hotelName || '',
      roomName: reservation.roomName || '',
      status: reservation.status === 'checked-in' ? 'checked-in' : 'confirmed',
      code: reservation.code || '',
      guestName: reservation.guestName || '',
      checkIn: toISODate(reservation.checkIn),
      checkOut: toISODate(reservation.checkOut),
    });
  });

  return items;
};

const buildOccupancyMap = (stays) => {
  const map = new Map();
  stays.forEach((stay) => {
    if (!stay.checkIn || !stay.checkOut || stay.checkOut <= stay.checkIn) return;
    for (let date = stay.checkIn; date < stay.checkOut; date = shiftISODate(date, 1)) {
      const key = `${stay.roomId}|${date}`;
      const current = map.get(key);
      if (!current || (stay.status === 'checked-in' && current.status !== 'checked-in')) {
        map.set(key, { ...stay, date });
      }
    }
  });
  return map;
};

const OccupancyCalendar = () => {
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [hotelId, setHotelId] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadData = () => {
    setLoading(true);
    return Promise.all([getHotels(), getBookings(), getReservations()])
      .then(([hotelItems, bookingItems, reservationItems]) => {
        setHotels(hotelItems);
        setBookings(bookingItems);
        setReservations(Array.isArray(reservationItems) ? reservationItems : []);
        setLoadError('');
        setHotelId((current) => {
          if (hotelItems.some((item) => String(item.id) === String(current))) return current;
          return hotelItems[0]?.id || '';
        });
      })
      .catch((error) => {
        setHotels([]);
        setBookings([]);
        setReservations([]);
        setLoadError(error.message || 'Doluluq məlumatları yüklənmədi.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const hotel = hotels.find((item) => item.id === Number(hotelId));
  const rooms = hotel?.rooms || [];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthValue = `${year}-${String(month + 1).padStart(2, '0')}`;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthName = currentDate.toLocaleDateString('az-AZ', { month: 'long', year: 'numeric' });
  const gridStyle = {
    gridTemplateColumns: `200px repeat(${daysInMonth}, minmax(36px, 40px))`,
  };

  const occupancyMap = useMemo(
    () => buildOccupancyMap(collectStays(bookings, reservations)),
    [bookings, reservations]
  );

  const stayFor = (roomId, day) => {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return occupancyMap.get(`${Number(roomId)}|${iso}`) || null;
  };

  const occupiedRoomsPerDay = days.map((day) =>
    rooms.filter((room) => Boolean(stayFor(room.id, day))).length
  );

  const totalRooms = rooms.length || 1;
  const averageOccupancy = (
    (occupiedRoomsPerDay.reduce((sum, count) => sum + count, 0) / (totalRooms * daysInMonth)) * 100
  ).toFixed(1);

  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
  const todayIndex = isCurrentMonth ? today.getDate() - 1 : -1;

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleMonthChange = (event) => {
    const value = event.target.value;
    if (!value) return;
    const [nextYear, nextMonth] = value.split('-').map(Number);
    setCurrentDate(new Date(nextYear, nextMonth - 1, 1));
  };

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
        {!loading && !loadError && hotels.length > 0 && (
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
      {loadError && (
        <div className="occupancy-message">
          <h2>Məlumat yüklənmədi</h2>
          <p>{loadError}</p>
          <button type="button" className="btn-occupancy-retry" onClick={loadData}>
            Yenidən yoxla
          </button>
        </div>
      )}

      {!loading && !loadError && hotels.length === 0 && (
        <div className="occupancy-message">
          <h2>Otel yoxdur</h2>
          <p>Doluluq təqvimi üçün əvvəlcə otel əlavə olunmalıdır.</p>
        </div>
      )}

      {!loading && !loadError && hotels.length > 0 && (
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
                <div className="stat-value">{rooms.length ? `${averageOccupancy}%` : '0%'}</div>
                <div className="stat-label">Orta Doluluq</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon available"><FaBed /></div>
              <div className="stat-content">
                <div className="stat-value">
                  {Math.max(0, rooms.length - (todayIndex >= 0 ? occupiedRoomsPerDay[todayIndex] || 0 : 0))}
                </div>
                <div className="stat-label">Bu gün Boş</div>
              </div>
            </div>
          </div>

          <div className="calendar-controls">
            <button type="button" className="btn-month-nav" onClick={previousMonth} aria-label="Əvvəlki ay">
              <FaChevronLeft />
            </button>
            <h2 className="current-month">{monthName}</h2>
            <button type="button" className="btn-month-nav" onClick={nextMonth} aria-label="Növbəti ay">
              <FaChevronRight />
            </button>
            <input
              type="month"
              className="occupancy-month-input"
              value={monthValue}
              onChange={handleMonthChange}
              aria-label="Ay seçimi"
            />
          </div>

          <div className="calendar-legend">
            <div className="legend-item">
              <span className="legend-indicator available"></span>
              <span>Boş</span>
            </div>
            <div className="legend-item">
              <span className="legend-indicator occupied confirmed"></span>
              <span>Təsdiqlənib</span>
            </div>
            <div className="legend-item">
              <span className="legend-indicator occupied checked-in"></span>
              <span>Giriş edilib</span>
            </div>
          </div>

          {rooms.length === 0 ? (
            <div className="occupancy-message">
              <h2>Otaq yoxdur</h2>
              <p>{hotel?.title || 'Bu otel'} üçün göstəriləcək otaq yoxdur.</p>
            </div>
          ) : (
            <div className="calendar-grid-container">
              <div className="calendar-grid">
                <div className="grid-header" style={gridStyle}>
                  <div className="room-column-header">
                    {hotel?.title || 'Otaq'}
                  </div>
                  {days.map((day) => (
                    <div key={day} className={`day-header${isCurrentMonth && day === today.getDate() ? ' today' : ''}`}>
                      {day}
                    </div>
                  ))}
                </div>
                {rooms.map((room) => (
                  <div key={room.id} className="grid-row" style={gridStyle}>
                    <div className="room-info">
                      <div className="room-number">#{room.id}</div>
                      <div className="room-type">{room.name}</div>
                      <div className="room-capacity">{hotel?.title}</div>
                    </div>
                    {days.map((day) => {
                      const stay = stayFor(room.id, day);
                      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const title = stay
                        ? `${stay.hotelName || hotel?.title || ''} · ${stay.roomName || room.name} · ${STATUS_LABELS[stay.status] || stay.status}${stay.code ? ` · ${stay.code}` : ''} · ${stay.guestName}`
                        : `${hotel?.title || ''} · ${room.name} · ${iso} · Boş`;
                      return (
                        <div
                          key={day}
                          className={`day-cell ${stay ? `occupied ${stay.status}` : 'available'}${isCurrentMonth && day === today.getDate() ? ' today' : ''}`}
                          title={title.trim()}
                        >
                          {stay && <span className="occupied-indicator">●</span>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OccupancyCalendar;
