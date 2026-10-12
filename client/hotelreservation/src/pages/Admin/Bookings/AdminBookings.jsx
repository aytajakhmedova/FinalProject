import React, { useEffect, useState } from 'react';
import { getBookings, updateBookingStatus } from '../../../api/client';
import { NEXT_STATUSES, STATUS_LABELS } from '../../../utils/bookingsStore';
import '../Hotels/AdminHotels.css';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');

  const loadBookings = () => {
    setLoading(true);
    return getBookings()
      .then((items) => {
        setBookings(items);
        setLoadError('');
      })
      .catch((error) => {
        setBookings([]);
        setLoadError(error.message || 'Rezervasiyalar yüklənmədi.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const visible = filter === 'all'
    ? bookings
    : bookings.filter((booking) => booking.status === filter);

  const changeStatus = (booking, status) => {
    updateBookingStatus(booking.id, status)
      .then(() => {
        setActionError('');
        return loadBookings();
      })
      .catch((error) => {
        setActionError(error.message || 'Status yenilənmədi.');
      });
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Rezervasiyalar</h1>
        <p className="page-subtitle">Status həyat dövrü: təsdiqlənib → giriş → çıxış / ləğv</p>
      </div>

      {loading && <p className="page-subtitle">Yüklənir...</p>}
      {loadError && (
        <div className="coming-soon-card">
          <h2>Məlumat yüklənmədi</h2>
          <p>{loadError}</p>
        </div>
      )}

      {!loading && !loadError && (
        <>
          {actionError && <p className="muted">{actionError}</p>}
          <div className="inventory-toolbar">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Hamısı</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Təsdiq</th>
                  <th>Qonaq</th>
                  <th>Otel / Otaq</th>
                  <th>Tarix</th>
                  <th>Ödəniş</th>
                  <th>Məbləğ</th>
                  <th>Status</th>
                  <th>Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((booking) => (
                  <tr key={booking.id}>
                    <td><strong>{booking.confirmationNumber}</strong></td>
                    <td>
                      {booking.guestName}
                      <div className="muted">{booking.guestEmail}</div>
                    </td>
                    <td>
                      {booking.hotelName}
                      <div className="muted">{booking.roomType}</div>
                    </td>
                    <td>{booking.checkIn} → {booking.checkOut}</td>
                    <td>{booking.paymentMethod === 'hotel' ? 'Oteldə' : booking.paymentMethod === 'card' ? 'Kartla' : '—'}</td>
                    <td>₼{Number(booking.totalPrice || 0).toLocaleString('az-AZ', { maximumFractionDigits: 0 })}</td>
                    <td>{STATUS_LABELS[booking.status] || booking.status}</td>
                    <td className="table-actions">
                      {(NEXT_STATUSES[booking.status] || []).map((status) => (
                        <button key={status} onClick={() => changeStatus(booking, status)}>
                          {STATUS_LABELS[status]}
                        </button>
                      ))}
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan="8">Rezervasiya yoxdur</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminBookings;
