import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHotel, FaCalendarCheck, FaUsers, FaMoneyBillWave } from 'react-icons/fa';
import { getHotels, getBookings } from '../../../api/client';
import { STATUS_LABELS } from '../../../utils/bookingsStore';
import './AdminDashboard.css';

const money = (value) => {
  const amount = Number(value) || 0;
  return amount.toLocaleString('az-AZ', { maximumFractionDigits: 0 });
};

const paymentLabel = (method) => (method === 'hotel' ? 'Oteldə' : method === 'card' ? 'Kartla' : '—');

const statusColors = {
  confirmed: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e' },
  'checked-in': { bg: 'rgba(59, 130, 246, 0.12)', text: '#2563eb' },
  'checked-out': { bg: 'rgba(107, 114, 128, 0.12)', text: '#4b5563' },
  cancelled: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' },
};

const AdminDashboard = () => {
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
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
      })
      .catch((error) => {
        if (!active) return;
        setHotels([]);
        setBookings([]);
        setLoadError(error.message || 'Admin məlumatları yüklənmədi.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const active = bookings.filter((booking) => booking.status === 'confirmed' || booking.status === 'checked-in');
    const guests = new Set(bookings.map((booking) => booking.guestEmail).filter(Boolean));
    const revenue = bookings
      .filter((booking) => booking.status !== 'cancelled')
      .reduce((sum, booking) => sum + (Number(booking.totalPrice) || 0), 0);

    return [
      { icon: <FaHotel />, label: 'Otellər', value: String(hotels.length), color: '#8B5A3C' },
      { icon: <FaCalendarCheck />, label: 'Aktiv rezervasiyalar', value: String(active.length), color: '#22c55e' },
      { icon: <FaUsers />, label: 'Qonaqlar', value: String(guests.size), color: '#f59e0b' },
      { icon: <FaMoneyBillWave />, label: 'Ümumi gəlir', value: `₼${money(revenue)}`, color: '#8B5A3C' },
    ];
  }, [bookings, hotels.length]);

  const recent = bookings.slice(0, 6);

  const exportBookings = () => {
    const header = ['Təsdiq', 'Qonaq', 'Email', 'Otel', 'Otaq', 'Giriş', 'Çıxış', 'Ödəniş', 'Məbləğ', 'Status'];
    const rows = bookings.map((booking) => [
      booking.confirmationNumber,
      booking.guestName,
      booking.guestEmail,
      booking.hotelName,
      booking.roomType,
      booking.checkIn,
      booking.checkOut,
      paymentLabel(booking.paymentMethod),
      booking.totalPrice,
      STATUS_LABELS[booking.status] || booking.status,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rezervasiyalar.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Canlı rezervasiya və ödəniş xülasəsi</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn-secondary" onClick={exportBookings} disabled={!!loadError || loading}>İxrac et</button>
          <Link to="/admin/hotels" className="btn-primary">Otaqlar</Link>
        </div>
      </div>

      {loading && <p className="dashboard-subtitle">Yüklənir...</p>}
      {loadError && (
        <div className="bookings-table-card">
          <p className="dashboard-subtitle">{loadError}</p>
        </div>
      )}

      {!loading && !loadError && (
        <>
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-value">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Son rezervasiyalar</h2>
              <Link to="/admin/bookings" className="section-link">Hamısını gör →</Link>
            </div>

            <div className="bookings-table-card">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Təsdiq</th>
                    <th>Qonaq</th>
                    <th>Otel</th>
                    <th>Tarix</th>
                    <th>Ödəniş</th>
                    <th>Məbləğ</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((booking) => {
                    const tone = statusColors[booking.status] || statusColors.confirmed;
                    return (
                      <tr key={booking.id}>
                        <td>{booking.confirmationNumber}</td>
                        <td>
                          <div className="guest-cell">
                            <div className="guest-avatar">{(booking.guestName || 'Q').charAt(0)}</div>
                            <span>{booking.guestName}</span>
                          </div>
                        </td>
                        <td>
                          {booking.hotelName}
                          <div className="muted">{booking.roomType}</div>
                        </td>
                        <td>{booking.checkIn} → {booking.checkOut}</td>
                        <td>{paymentLabel(booking.paymentMethod)}</td>
                        <td>₼{money(booking.totalPrice)}</td>
                        <td>
                          <span className="status-badge" style={{ background: tone.bg, color: tone.text }}>
                            {STATUS_LABELS[booking.status] || booking.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {recent.length === 0 && (
                    <tr>
                      <td colSpan="7">Rezervasiya yoxdur</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
