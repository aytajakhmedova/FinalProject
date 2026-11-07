import Select from '../../components/common/Select/Select';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaStar, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaArrowLeft, 
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt
} from 'react-icons/fa';
import { createBooking, getTour } from '../../api/client';
import { getAuthToken } from '../../api/auth';
import ImageGallery from '../../components/common/ImageGallery/ImageGallery';
import './TourDetail.css';

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [bookingError, setBookingError] = useState('');
  const [booking, setBooking] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Past dates cannot be booked, so they are not offered.
  const todayIso = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const remainingOn = (date) => {
    const found = (tour?.availability || []).find((item) => String(item.date).slice(0, 10) === String(date).slice(0, 10));
    return found ? found.remainingPlaces : null;
  };
  const selectedRemaining = selectedDate ? remainingOn(selectedDate) : null;
  const upcomingAvailability = (tour?.availability || []).filter((item) => String(item.date).slice(0, 10) >= todayIso);
  const maxSelectable = selectedRemaining == null ? (tour?.maxGuests || 1) : Math.min(tour?.maxGuests || 1, selectedRemaining);

  useEffect(() => {
    let active = true;
    getTour(id)
      .then((data) => {
        if (!active) return;
        setTour(data);
        setGuestCount(data.minGuests || 1);
        setLoadError('');
      })
      .catch((error) => {
        if (!active) return;
        setTour(null);
        setLoadError(error.message || 'Tur tapılmadı');
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loadError || !tour) {
    return (
      <div className="tour-not-found">
        <h2>{loadError || 'Yüklənir...'}</h2>
        <Link to="/tours" className="back-link">Turlara qayıt</Link>
      </div>
    );
  }

  const totalPrice = tour.price * guestCount;

  const handleBooking = (event) => {
    event.preventDefault();
    setBookingError('');
    
    if (!getAuthToken()) {
      navigate('/login', { state: { from: `/tours/${id}` } });
      return;
    }
    
    // Get user from auth session (not raw localStorage)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.email) {
      setBookingError('Hesabda email yoxdur. Zəhmət olmasa giriş edin.');
      return;
    }
    
    // Validate tour date selected
    if (!selectedDate) {
      setBookingError('Tur tarixini seçin.');
      return;
    }
    
    // Check if date is in the past
    const tourDate = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (tourDate < today) {
      setBookingError('Keçmiş tarixli tur seçə bilməzsiniz.');
      return;
    }
    
    // Validate guest count within limits
    if (guestCount < tour.minGuests || guestCount > tour.maxGuests) {
      setBookingError(`İştirakçı sayı ${tour.minGuests} ilə ${tour.maxGuests} arasında olmalıdır.`);
      return;
    }
    
    // Places left on the chosen date (every guest's bookings counted)
    if (selectedRemaining != null && guestCount > selectedRemaining) {
      setBookingError(selectedRemaining === 0
        ? 'Bu tarix üçün yer qalmayıb.'
        : `Bu tarix üçün yalnız ${selectedRemaining} yer qalıb.`);
      return;
    }

    // Validate card details - demo payment
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 16) {
      setBookingError('Kart nömrəsi 16 rəqəm olmalıdır.');
      return;
    }
    if (!cardName.trim()) {
      setBookingError('Kart sahibinin adını yazın.');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setBookingError('Bitmə tarixini AA/İİ formatında yazın.');
      return;
    }
    // Demo payment - CVV optional but validate format if provided
    if (cvv && cvv.length > 0 && cvv.length < 3) {
      setBookingError('CVV 3 rəqəm olmalıdır.');
      return;
    }
    
    setBooking(true);
    setBookingError('');
    createBooking({
      bookingType: 'tour',
      tourId: tour.id,
      travelDate: selectedDate,
      guests: guestCount,
      guestName: user.name || user.email || 'Qonaq',
      guestEmail: user.email,
      paymentMethod: 'card',
      cardNumber: digits,
      cardHolder: cardName.trim(),
    })
      .then((created) => {
        // Only navigate to success if backend confirms booking
        navigate('/booking-success', { state: { booking: created } });
      })
      .catch((error) => {
        setBookingError(error.message || 'Rezervasiya alınmadı.');
        // Someone else may have taken the places meanwhile: show the current numbers.
        getTour(id).then(setTour).catch(() => {});
      })
      .finally(() => setBooking(false));
  };

  return (
    <div className="tour-detail-page">
      {/* Back Button */}
      <div className="tour-detail-container">
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> Geri
        </button>
      </div>

      {/* Gallery */}
      <section className="tour-gallery-section">
        <div className="tour-detail-container">
          <ImageGallery images={tour.images} title={tour.name} />
        </div>
      </section>

      <div className="tour-detail-container">
        <div className="tour-detail-content">
          {/* Main Content */}
          <div className="tour-main-content">
            {/* Header */}
            <div className="tour-detail-header">
              <div className="tour-badges">
                <span className="category-badge">{tour.category}</span>
                <span className={`difficulty-badge difficulty-${(tour.difficulty || '').toLowerCase()}`}>
                  {tour.difficulty}
                </span>
              </div>
              <h1 className="tour-title">{tour.name}</h1>
              <div className="tour-meta-row">
                <div className="tour-location">
                  <FaMapMarkerAlt />
                  <span>{tour.destination}</span>
                </div>
                <div className="tour-rating">
                  <FaStar />
                  <span>{tour.rating}</span>
                  <span className="reviews-text">({tour.reviews} rəy)</span>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="tour-quick-info">
              <div className="info-item">
                <FaClock className="info-icon" />
                <div>
                  <span className="info-label">Müddət</span>
                  <span className="info-value">{tour.duration}</span>
                </div>
              </div>
              <div className="info-item">
                <FaUsers className="info-icon" />
                <div>
                  <span className="info-label">Qrup ölçüsü</span>
                  <span className="info-value">
                    {tour.minGuests}-{tour.maxGuests} nəfər
                    {selectedRemaining != null && ` · qalan yer: ${selectedRemaining}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Dates and the places still free on each, counted over every guest's bookings */}
            {upcomingAvailability.length > 0 && (
              <section className="tour-section">
                <h2 className="section-title">Tarixlər və boş yerlər</h2>
                <div className="tour-date-chips">
                  {upcomingAvailability.map((item) => {
                    const [year, month, day] = String(item.date).slice(0, 10).split('-');
                    const full = item.remainingPlaces === 0;
                    return (
                      <button
                        type="button"
                        key={item.date}
                        className={`tour-date-chip ${full ? 'full' : ''} ${selectedDate === item.date ? 'active' : ''}`}
                        disabled={full}
                        onClick={() => {
                          setSelectedDate(item.date);
                          setGuestCount((current) => Math.min(Math.max(current, tour.minGuests), Math.max(item.remainingPlaces, tour.minGuests)));
                        }}
                      >
                        <strong>{`${day}.${month}.${year}`}</strong>
                        <span>{full ? 'Yer qalmayıb' : `${item.remainingPlaces} / ${tour.maxGuests} yer qalıb`}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Description */}
            <section className="tour-section">
              <h2 className="section-title">Tur Haqqında</h2>
              <p className="tour-description">{tour.description}</p>
            </section>

            {/* Highlights */}
            <section className="tour-section">
              <h2 className="section-title">Əsas Xüsusiyyətlər</h2>
              <ul className="tour-highlights-list">
                {tour.highlights.map((highlight, idx) => (
                  <li key={idx} className="highlight-item">
                    <FaCheckCircle className="highlight-icon" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Itinerary */}
            <section className="tour-section">
              <h2 className="section-title">Tur Proqramı</h2>
              <div className="itinerary-list">
                {tour.itinerary.map((day, idx) => (
                  <div key={idx} className="itinerary-day">
                    <div className="day-number">Gün {day.day}</div>
                    <div className="day-content">
                      <h3 className="day-title">{day.title}</h3>
                      <ul className="day-activities">
                        {day.activities.map((activity, actIdx) => (
                          <li key={actIdx}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Included & Excluded */}
            <section className="tour-section">
              <div className="included-excluded-grid">
                <div className="included-box">
                  <h3 className="box-title">
                    <FaCheckCircle className="title-icon success" />
                    Daxildir
                  </h3>
                  <ul className="service-list">
                    {tour.included.map((item, idx) => (
                      <li key={idx}>
                        <FaCheckCircle className="list-icon success" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="excluded-box">
                  <h3 className="box-title">
                    <FaTimesCircle className="title-icon danger" />
                    Daxil deyil
                  </h3>
                  <ul className="service-list">
                    {tour.excluded.map((item, idx) => (
                      <li key={idx}>
                        <FaTimesCircle className="list-icon danger" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Booking Sidebar */}
          <aside className="tour-booking-sidebar">
            <div className="booking-card">
              <div className="booking-price-header">
                <span className="price-label">Başlanğıc qiymət</span>
                <div className="price-amount">₼{tour.price}</div>
                <span className="price-unit">/ nəfər</span>
              </div>

              <form className="booking-form" onSubmit={handleBooking}>
                {/* Date Selection */}
                <div className="form-group">
                  <label className="form-label">
                    <FaCalendarAlt />
                    Tarix seçin
                  </label>
                  <Select
                    value={selectedDate}
                    onChange={(e) => {
                      const date = e.target.value;
                      setSelectedDate(date);
                      const left = date ? remainingOn(date) : null;
                      if (left != null && left > 0) setGuestCount((current) => Math.min(current, left));
                    }}
                    className="form-select"
                    required
                  >
                    <option value="">Tarix seçin</option>
                    {tour.availableDates.filter((date) => String(date).slice(0, 10) >= todayIso).map(date => {
                      const [year, month, day] = String(date).slice(0, 10).split('-');
                      const label = year && month && day ? `${day}.${month}.${year}` : date;
                      const left = remainingOn(date);
                      return (
                        <option key={date} value={date} disabled={left === 0}>
                          {label}{left == null ? '' : left === 0 ? ' — yer qalmayıb' : ` — ${left} yer qalıb`}
                        </option>
                      );
                    })}
                  </Select>
                </div>

                {/* Guest Count */}
                <div className="form-group">
                  <label className="form-label">
                    <FaUsers />
                    İştirakçılar
                  </label>
                  <Select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="form-select"
                  >
                    {Array.from(
                      { length: Math.max(0, maxSelectable - tour.minGuests + 1) },
                      (_, i) => tour.minGuests + i
                    ).map(num => (
                      <option key={num} value={num}>{num} nəfər</option>
                    ))}
                  </Select>
                  {selectedRemaining != null && (
                    <small className="form-hint">
                      {selectedRemaining === 0
                        ? 'Bu tarix üçün yer qalmayıb.'
                        : `Bu tarixdə qalan yer: ${selectedRemaining} / ${tour.maxGuests}`}
                    </small>
                  )}
                </div>

                {/* Price Summary */}
                <div className="price-summary">
                  <div className="summary-row">
                    <span>₼{tour.price} × {guestCount} nəfər</span>
                    <span>₼{totalPrice}</span>
                  </div>
                  <div className="summary-total">
                    <span>Cəmi</span>
                    <span>₼{totalPrice}</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Kart nömrəsi</label>
                  <input
                    className="form-select"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="•••• •••• •••• ••••"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/[^\d ]/g, '').slice(0, 19))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Kart sahibinin adı</label>
                  <input
                    className="form-select"
                    autoComplete="cc-name"
                    placeholder="Ad Soyad"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>
                <div className="tour-card-row">
                  <div className="form-group">
                    <label className="form-label">Bitmə tarixi</label>
                    <input
                      className="form-select"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="AA/İİ"
                      value={expiry}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
                      }}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input
                      className="form-select"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="•••"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      required
                    />
                  </div>
                </div>

                {bookingError && <p className="booking-note is-error">{bookingError}</p>}
                <button type="submit" className="btn-book-tour" disabled={booking}>
                  {booking ? 'Göndərilir...' : 'Rezervasiya et'}
                </button>
              </form>

              <p className="booking-note">
                Rezervasiya təsdiq edildikdən sonra ödəniş haqqında məlumat göndəriləcək
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
