import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBell,
  FaCalendarAlt,
  FaCheck,
  FaEnvelope,
  FaPhone,
  FaSearch,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa';
import { emailBookingReceipt, getBookings, getHotels, updateBookingStatus } from '../../api/client';
import { getAuthUser } from '../../api/auth';
import { NEXT_STATUSES, STATUS_LABELS } from '../../utils/bookingsStore';
import './ReceptionDesk.css';

const TYPE_LABELS = { hotel: 'Otel', flight: 'Uçuş', tour: 'Tur' };

const todayISO = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const dateOnly = (value) => String(value || '').slice(0, 10);

const MONTHS_AZ = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avq', 'sen', 'okt', 'noy', 'dek'];

const formatDay = (value) => {
  const iso = dateOnly(value);
  if (!iso) return '—';
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return iso;
  return `${day} ${MONTHS_AZ[month - 1]} ${year}`;
};

const money = (value) => {
  const amount = Number(value) || 0;
  return amount.toLocaleString('az-AZ', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

const bookingTypeOf = (booking) => (booking.bookingType || 'hotel').toLowerCase();

const roomLine = (booking) => {
  const hotel = booking.hotelName || booking.itemName || '';
  const room = booking.roomName || booking.roomType || '';
  return [hotel, room].filter(Boolean).join(' · ') || TYPE_LABELS[bookingTypeOf(booking)] || 'Rezervasiya';
};

const allowedNext = (status) => NEXT_STATUSES[status] || [];

const FILTERS = [
  { id: 'all', label: 'Hamısı' },
  { id: 'arrive', label: 'Bu gün giriş' },
  { id: 'depart', label: 'Bu gün çıxış' },
  { id: 'stay', label: 'Oteldə' },
  { id: 'wait', label: 'Gözləyən' },
];

const matchesBoard = (booking, board, today) => {
  const status = booking.status;
  if (status === 'cancelled') return board === 'all';
  const inDate = dateOnly(booking.checkIn);
  const outDate = dateOnly(booking.checkOut);
  if (board === 'arrive') return inDate === today && status === 'confirmed';
  if (board === 'depart') return outDate === today && (status === 'checked-in' || status === 'confirmed');
  if (board === 'stay') return status === 'checked-in';
  if (board === 'wait') return status === 'confirmed';
  return true;
};

const sortDesk = (items, today) =>
  [...items].sort((a, b) => {
    const rank = (booking) => {
      const inDate = dateOnly(booking.checkIn);
      const outDate = dateOnly(booking.checkOut);
      if (booking.status === 'confirmed' && inDate === today) return 0;
      if (booking.status === 'checked-in' && outDate === today) return 1;
      if (booking.status === 'checked-in') return 2;
      if (booking.status === 'confirmed') return 3;
      if (booking.status === 'checked-out') return 4;
      return 5;
    };
    const diff = rank(a) - rank(b);
    if (diff !== 0) return diff;
    return dateOnly(a.checkIn).localeCompare(dateOnly(b.checkIn));
  });

const ReceptionDesk = () => {
  const user = getAuthUser();
  const today = todayISO();
  const [bookings, setBookings] = useState([]);
  const [hotelName, setHotelName] = useState('');
  const [query, setQuery] = useState('');
  const [board, setBoard] = useState('all');
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = (silent = false) => {
    if (!silent) setLoading(true);
    return getBookings()
      .then((items) => {
        setBookings(Array.isArray(items) ? items : []);
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
    load();
  }, []);

  useEffect(() => {
    const assigned = Number(user?.assignedHotelId) || 0;
    getHotels()
      .then((hotels) => {
        const match = (Array.isArray(hotels) ? hotels : []).find((hotel) => Number(hotel.id) === assigned);
        setHotelName(match?.title || match?.name || '');
      })
      .catch(() => setHotelName(''));
  }, [user?.assignedHotelId]);

  const counts = useMemo(() => ({
    all: bookings.length,
    arrive: bookings.filter((item) => matchesBoard(item, 'arrive', today)).length,
    depart: bookings.filter((item) => matchesBoard(item, 'depart', today)).length,
    stay: bookings.filter((item) => matchesBoard(item, 'stay', today)).length,
    wait: bookings.filter((item) => matchesBoard(item, 'wait', today)).length,
  }), [bookings, today]);

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase();
    const filtered = bookings.filter((booking) => {
      if (!matchesBoard(booking, board, today)) return false;
      if (!text) return true;
      return [
        booking.code,
        booking.confirmationNumber,
        booking.guestName,
        booking.guestEmail,
        booking.guestPhone,
        booking.hotelName,
        booking.roomName,
        booking.roomType,
        booking.specialRequests,
        STATUS_LABELS[booking.status],
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(text);
    });
    return sortDesk(filtered, today);
  }, [bookings, board, query, today]);

  const changeStatus = (booking, status) => {
    if (!allowedNext(booking.status).includes(status) || busyId) return;
    setBusyId(booking.id);
    setNotice('');
    updateBookingStatus(booking.id, status)
      .then(() => {
        setNotice(`${booking.guestName}: ${STATUS_LABELS[status]}`);
        return load(true);
      })
      .catch((error) => setNotice(error.message || 'Status yenilənmədi.'))
      .finally(() => setBusyId(null));
  };

  const sendPdf = (booking) => {
    if (busyId) return;
    setBusyId(booking.id);
    setNotice('');
    emailBookingReceipt(booking.id)
      .then(() => setNotice(`PDF ${booking.guestEmail} ünvanına göndərildi.`))
      .catch((error) => setNotice(error.message || 'PDF göndərilmədi.'))
      .finally(() => setBusyId(null));
  };

  const greet = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Sabahınız xeyir';
    if (hour < 18) return 'Günortanız xeyir';
    return 'Axşamınız xeyir';
  };

  return (
    <div className="desk">
      <header className="desk-hero">
        <div>
          <p className="desk-kicker">Resepsiya masası</p>
          <h1>{`${greet()}, ${user?.name || 'Resepsiya'}`}</h1>
          <p className="desk-meta">
            <FaBell />
            {hotelName || 'Təyin olunmuş otel'}
            <span>·</span>
            {formatDay(today)}
            <span>·</span>
            {bookings.length} rezervasiya
          </p>
        </div>
        <div className="desk-hero-date" aria-hidden="true">
          <strong>{new Date().getDate()}</strong>
          <span>{new Date().toLocaleDateString('az-AZ', { month: 'short' })}</span>
        </div>
      </header>

      <section className="desk-stats" aria-label="Növbə xülasəsi">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`desk-stat ${board === item.id ? 'on' : ''}`}
            onClick={() => setBoard(item.id)}
          >
            <em>{counts[item.id] ?? 0}</em>
            <span>{item.label}</span>
          </button>
        ))}
      </section>

      <label className="desk-search">
        <FaSearch />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Qonaq adı, telefon, email və ya rezervasiya kodu"
        />
      </label>

      {notice && <p className="desk-notice">{notice}</p>}
      {loading && <p className="desk-empty">Rezervasiyalar yüklənir…</p>}
      {loadError && (
        <div className="desk-empty">
          <p>{loadError}</p>
          <button type="button" className="desk-btn primary" onClick={() => load()}>Yenidən yoxla</button>
        </div>
      )}

      {!loading && !loadError && visible.length === 0 && (
        <div className="desk-empty">
          <FaCalendarAlt />
          <h2>{bookings.length === 0 ? 'Hələ rezervasiya yoxdur' : 'Bu filterə uyğun qonaq yoxdur'}</h2>
          <p>
            {bookings.length === 0
              ? 'Bu otelə düşən bütün rezervasiyalar burada görünəcək.'
              : 'Axtarışı və ya növbə filterini dəyişin.'}
          </p>
        </div>
      )}

      <ul className="desk-list">
        {visible.map((booking) => {
          const open = openId === booking.id;
          const next = allowedNext(booking.status);
          const deposit = [20, 30, 40].includes(Number(booking.depositPercent));
          return (
            <li key={booking.id} className={`folio ${open ? 'open' : ''} status-${booking.status}`}>
              <button type="button" className="folio-main" onClick={() => setOpenId(open ? null : booking.id)}>
                <div className="folio-who">
                  <span className="folio-avatar">{(booking.guestName || '?').charAt(0).toUpperCase()}</span>
                  <div>
                    <strong>{booking.guestName || 'Qonaq'}</strong>
                    <em>{booking.code || booking.confirmationNumber}</em>
                  </div>
                </div>
                <div className="folio-stay">
                  <b>{roomLine(booking)}</b>
                  <span>
                    {formatDay(booking.checkIn)} → {formatDay(booking.checkOut)}
                    {booking.nights > 0 ? ` · ${booking.nights} gecə` : ''}
                    {booking.guests ? ` · ${booking.guests} qonaq` : ''}
                  </span>
                </div>
                <div className="folio-pay">
                  <b>₼{money(booking.totalPrice)}</b>
                  <span>
                    {booking.paymentMethod === 'hotel' ? 'Oteldə' : booking.paymentMethod === 'card' ? 'Kart' : booking.paymentMethod || '—'}
                    {deposit ? ` · ${booking.depositPercent}% avans` : ''}
                  </span>
                </div>
                <span className={`folio-status ${booking.status}`}>
                  {STATUS_LABELS[booking.status] || booking.status}
                </span>
              </button>

              {open && (
                <div className="folio-body">
                  <dl>
                    <div><dt>Email</dt><dd><FaEnvelope /> {booking.guestEmail || '—'}</dd></div>
                    <div><dt>Telefon</dt><dd><FaPhone /> {booking.guestPhone || '—'}</dd></div>
                    <div><dt>Qonaq</dt><dd><FaUser /> {booking.guests || 1} nəfər</dd></div>
                    <div><dt>Növ</dt><dd>{TYPE_LABELS[bookingTypeOf(booking)]}</dd></div>
                    <div><dt>Yekun</dt><dd>₼{money(booking.totalPrice)}</dd></div>
                    {deposit && (
                      <>
                        <div><dt>Kartla avans</dt><dd>{booking.depositPercent}% · ₼{money(booking.depositAmount)}</dd></div>
                        <div><dt>Oteldə qalıq</dt><dd>₼{money(booking.remainingAmount)}</dd></div>
                      </>
                    )}
                    <div><dt>Ödəniş</dt><dd>{booking.paymentMethod || '—'} · {booking.paymentStatus || '—'}</dd></div>
                    <div className="wide"><dt>Xüsusi istək</dt><dd>{booking.specialRequests || 'Yoxdur'}</dd></div>
                    <div><dt>Yaradılıb</dt><dd>{booking.createdAt ? new Date(booking.createdAt).toLocaleString('az-AZ') : '—'}</dd></div>
                  </dl>
                  <div className="folio-actions">
                    {next.includes('checked-in') && (
                      <button type="button" className="desk-btn primary" disabled={busyId === booking.id} onClick={() => changeStatus(booking, 'checked-in')}>
                        <FaSignInAlt /> Giriş et
                      </button>
                    )}
                    {next.includes('checked-out') && (
                      <button type="button" className="desk-btn primary" disabled={busyId === booking.id} onClick={() => changeStatus(booking, 'checked-out')}>
                        <FaSignOutAlt /> Çıxış et
                      </button>
                    )}
                    {next.includes('cancelled') && (
                      <button type="button" className="desk-btn ghost" disabled={busyId === booking.id} onClick={() => changeStatus(booking, 'cancelled')}>
                        Ləğv et
                      </button>
                    )}
                    <button type="button" className="desk-btn ghost" disabled={busyId === booking.id} onClick={() => sendPdf(booking)}>
                      <FaEnvelope /> PDF email
                    </button>
                    <Link className="desk-btn ghost" to={`/reservations/${booking.id}`}>
                      <FaCheck /> Tam səhifə
                    </Link>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ReceptionDesk;
