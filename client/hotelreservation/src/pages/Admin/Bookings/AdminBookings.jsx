import React, { useEffect, useMemo, useState } from 'react';
import { getBookings, updateBookingStatus } from '../../../api/client';
import { NEXT_STATUSES, STATUS_LABELS } from '../../../utils/bookingsStore';
import '../Hotels/AdminHotels.css';

const TYPE_LABELS = {
  hotel: 'Otel',
  flight: 'Uçuş',
  tour: 'Tur',
};

const bookingTypeOf = (booking) => (booking.bookingType || 'hotel').toLowerCase();

const serviceName = (booking) => {
  const type = bookingTypeOf(booking);
  if (type === 'flight') {
    return booking.itemName || booking.flightNumber || 'Uçuş';
  }
  if (type === 'tour') {
    return booking.tourName || booking.itemName || 'Tur';
  }
  const hotel = booking.hotelName || booking.itemName || '';
  const room = booking.roomName || booking.roomType || '';
  return room && hotel ? `${hotel} · ${room}` : hotel || room || 'Otel';
};

const formatDates = (booking) => {
  const start = booking.checkIn || '';
  const end = booking.checkOut || '';
  if (start && end) return `${start} → ${end}`;
  return start || '—';
};

const allowedNextStatuses = (status) => NEXT_STATUSES[status] || [];

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadBookings = (silent = false) => {
    if (!silent) setLoading(true);
    return getBookings()
      .then((items) => {
        setBookings(items);
        setLoadError('');
      })
      .catch((error) => {
        setBookings([]);
        setLoadError(error.message || 'Rezervasiyalar yüklənmədi.');
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return bookings.filter((booking) => {
      const type = bookingTypeOf(booking);
      if (statusFilter !== 'all' && booking.status !== statusFilter) return false;
      if (typeFilter !== 'all' && type !== typeFilter) return false;
      if (!query) return true;
      const haystack = [
        booking.code,
        booking.confirmationNumber,
        booking.guestName,
        booking.guestEmail,
        booking.guestPhone,
        TYPE_LABELS[type],
        type,
        serviceName(booking),
        booking.itemName,
        booking.hotelName,
        booking.roomName,
        booking.flightNumber,
        booking.tourName,
        booking.location,
        STATUS_LABELS[booking.status],
        booking.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [bookings, search, statusFilter, typeFilter]);

  const changeStatus = (booking, status) => {
    if (!allowedNextStatuses(booking.status).includes(status) || updatingId) return;
    setUpdatingId(booking.id);
    setActionError('');
    setSuccessMessage('');
    updateBookingStatus(booking.id, status)
      .then(() => {
        setSuccessMessage('Status yeniləndi.');
        return loadBookings(true);
      })
      .catch((error) => {
        setActionError(error.message || 'Status yenilənmədi.');
      })
      .finally(() => setUpdatingId(null));
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Rezervasiyalar</h1>
        <p className="page-subtitle">Otel, uçuş və tur rezervasiyalarını status qaydalarına uyğun idarə edin</p>
      </div>

      {loading && <p className="page-subtitle">Yüklənir...</p>}
      {loadError && (
        <div className="coming-soon-card">
          <h2>Məlumat yüklənmədi</h2>
          <p>{loadError}</p>
          <div className="admin-form-actions">
            <button type="button" className="btn-admin-primary" onClick={() => loadBookings()}>
              Yenidən yoxla
            </button>
          </div>
        </div>
      )}

      {!loading && !loadError && (
        <>
          <div className="inventory-toolbar">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kod, müştəri və ya xidmət axtar"
            />
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">Bütün xidmətlər</option>
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Bütün statuslar</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {successMessage && <p className="page-subtitle">{successMessage}</p>}
          {actionError && <p className="muted">{actionError}</p>}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Kod</th>
                  <th>Müştəri</th>
                  <th>Xidmət növü</th>
                  <th>Tarixlər</th>
                  <th>Ümumi qiymət</th>
                  <th>Status</th>
                  <th>Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((booking) => {
                  const type = bookingTypeOf(booking);
                  const nextStatuses = allowedNextStatuses(booking.status);
                  return (
                    <tr key={booking.id}>
                      <td><strong>{booking.code || booking.confirmationNumber}</strong></td>
                      <td>
                        {booking.guestName}
                        <div className="muted">{booking.guestEmail}</div>
                      </td>
                      <td>
                        {TYPE_LABELS[type] || type}
                        <div className="muted">{serviceName(booking)}</div>
                      </td>
                      <td>{formatDates(booking)}</td>
                      <td>₼{Number(booking.totalPrice || 0).toLocaleString('az-AZ', { maximumFractionDigits: 0 })}</td>
                      <td>{STATUS_LABELS[booking.status] || booking.status}</td>
                      <td className="table-actions">
                        {nextStatuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => changeStatus(booking, status)}
                            disabled={updatingId === booking.id}
                          >
                            {STATUS_LABELS[status]}
                          </button>
                        ))}
                      </td>
                    </tr>
                  );
                })}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan="7">Rezervasiya yoxdur</td>
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
