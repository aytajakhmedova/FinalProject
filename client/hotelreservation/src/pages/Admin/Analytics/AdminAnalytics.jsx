import { useEffect, useMemo, useState } from 'react';
import { getBookings, getHotels } from '../../../api/client';
import { STATUS_LABELS } from '../../../utils/bookingsStore';
import { hasRole } from '../../../api/auth';
import '../Hotels/AdminHotels.css';
import './AdminAnalytics.css';

const money = (value) =>
  `₼${(Number(value) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const MONTHS = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn', 'İyl', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'];
const monthLabel = (key) => {
  const [year, month] = key.split('-');
  return `${MONTHS[Number(month) - 1] || month} ${year}`;
};

const DAY = 24 * 60 * 60 * 1000;
const asDate = (value) => (value ? new Date(`${String(value).slice(0, 10)}T00:00:00`) : null);

const sumBy = (items, keyOf) => {
  const totals = new Map();
  items.forEach((item) => {
    const key = keyOf(item);
    if (!key) return;
    totals.set(key, (totals.get(key) || 0) + (Number(item.totalPrice) || 0));
  });
  return [...totals.entries()].sort((a, b) => b[1] - a[1]);
};

const BarList = ({ rows, format = money, empty = 'Məlumat yoxdur' }) => {
  const max = Math.max(1, ...rows.map(([, value]) => value));
  if (rows.length === 0) return <p className="an-empty">{empty}</p>;
  return (
    <ul className="an-bars">
      {rows.map(([label, value]) => (
        <li key={label}>
          <span className="an-bar-label">{label}</span>
          <span className="an-bar-track">
            <span className="an-bar-fill" style={{ width: `${Math.max(3, (value / max) * 100)}%` }} />
          </span>
          <strong className="an-bar-value">{format(value)}</strong>
        </li>
      ))}
    </ul>
  );
};

const AdminAnalytics = () => {
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scoped = hasRole('HotelManager') && !hasRole('SuperAdmin', 'Admin');

  useEffect(() => {
    let active = true;
    Promise.all([getBookings(), getHotels()])
      .then(([bookingItems, hotelItems]) => {
        if (!active) return;
        setBookings(bookingItems);
        setHotels(hotelItems);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Statistika yüklənmədi.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const earning = bookings.filter((item) => item.status !== 'cancelled');
    const revenue = earning.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0);
    const cancelled = bookings.filter((item) => item.status === 'cancelled');

    const byMonth = sumBy(earning, (item) => String(item.checkIn || item.createdAt || '').slice(0, 7))
      .filter(([key]) => /^\d{4}-\d{2}$/.test(key))
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12)
      .map(([key, value]) => [monthLabel(key), value]);

    const hotelBookings = earning.filter((item) => item.bookingType === 'hotel' || item.hotelId);
    const byRoom = sumBy(hotelBookings, (item) => item.roomType || item.itemName).slice(0, 8);
    const byHotel = sumBy(hotelBookings, (item) => item.hotelName).slice(0, 8);
    const byType = sumBy(earning, (item) => ({ hotel: 'Otel', flight: 'Uçuş', tour: 'Tur' }[item.bookingType] || item.bookingType));

    const statusCounts = Object.keys(STATUS_LABELS).map((key) => [
      STATUS_LABELS[key],
      bookings.filter((item) => item.status === key).length,
    ]);

    // occupancy of the next 30 days: booked room nights / available room nights
    const rooms = hotels.reduce((sum, hotel) => sum + (hotel.rooms?.length || 0), 0);
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start.getTime() + 30 * DAY);
    let bookedNights = 0;
    hotelBookings.forEach((item) => {
      const from = asDate(item.checkIn);
      const to = asDate(item.checkOut);
      if (!from || !to) return;
      const overlapStart = Math.max(from.getTime(), start.getTime());
      const overlapEnd = Math.min(to.getTime(), end.getTime());
      if (overlapEnd > overlapStart) bookedNights += (overlapEnd - overlapStart) / DAY;
    });
    const occupancy = rooms > 0 ? Math.min(100, (bookedNights / (rooms * 30)) * 100) : 0;

    return {
      revenue,
      count: earning.length,
      average: earning.length ? revenue / earning.length : 0,
      cancelledCount: cancelled.length,
      cancelledValue: cancelled.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0),
      byMonth,
      byRoom,
      byHotel,
      byType,
      statusCounts,
      occupancy,
      rooms,
    };
  }, [bookings, hotels]);

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Statistika</h1>
        <p className="page-subtitle">
          {scoped && hotels[0] ? `${hotels[0].title} üzrə gəlir və doluluq` : 'Gəlir, rezervasiya və doluluq hesabatı'}
        </p>
      </div>

      {loading && <p className="page-subtitle">Yüklənir...</p>}
      {error && (
        <div className="coming-soon-card">
          <h2>Məlumat yüklənmədi</h2>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="an-kpis">
            <div className="an-kpi">
              <span>Ümumi gəlir</span>
              <strong>{money(stats.revenue)}</strong>
              <small>Ləğv edilmiş rezervasiyalar çıxılmaqla</small>
            </div>
            <div className="an-kpi">
              <span>Rezervasiya sayı</span>
              <strong>{stats.count}</strong>
              <small>Orta məbləğ {money(stats.average)}</small>
            </div>
            <div className="an-kpi">
              <span>Doluluq (növbəti 30 gün)</span>
              <strong>{stats.occupancy.toFixed(1)}%</strong>
              <small>{stats.rooms} otaq üzrə</small>
            </div>
            <div className="an-kpi">
              <span>Ləğv edilənlər</span>
              <strong>{stats.cancelledCount}</strong>
              <small>İtirilən məbləğ {money(stats.cancelledValue)}</small>
            </div>
          </div>

          <div className="an-grid">
            <section className="an-panel">
              <h2>Aylar üzrə gəlir</h2>
              <p>Giriş tarixinə görə</p>
              <BarList rows={stats.byMonth} />
            </section>

            <section className="an-panel">
              <h2>Otaqlar üzrə gəlir</h2>
              <p>Ən çox qazandıran otaq tipləri</p>
              <BarList rows={stats.byRoom} />
            </section>

            {!scoped && (
              <section className="an-panel">
                <h2>Otellər üzrə gəlir</h2>
                <p>Ən çox qazandıran otellər</p>
                <BarList rows={stats.byHotel} />
              </section>
            )}

            {!scoped && (
              <section className="an-panel">
                <h2>Xidmət növü üzrə gəlir</h2>
                <p>Otel, uçuş və tur</p>
                <BarList rows={stats.byType} />
              </section>
            )}

            <section className="an-panel">
              <h2>Rezervasiya statusları</h2>
              <p>Hazırkı vəziyyət</p>
              <BarList rows={stats.statusCounts} format={(value) => String(value)} />
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;
