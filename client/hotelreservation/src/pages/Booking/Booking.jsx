import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaCreditCard, FaHotel, FaInfoCircle, FaLock, FaMapMarkedAlt, FaPlane, FaUser } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { formatDate } from '../../data/roomsData';
import { createBooking, getTripSuggestions } from '../../api/client';
import roomPhoto from '../../assets/images/otaq2.jpg';
import { useLanguage } from '../../context/LanguageContext';
import './Booking.css';

const BUNDLE_RATE = 0.9;

const money = (value) => {
  const amount = Number(value) || 0;
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
};

const bundlePrice = (value, guests = 1) =>
  Math.round(Number(value) * Number(guests) * BUNDLE_RATE * 100) / 100;

const pickTourDate = (tour, checkIn, checkOut) => {
  const dates = tour?.availableDates || [];
  const inStay = dates.find((date) => date >= checkIn && (!checkOut || date < checkOut));
  return inStay || dates[0] || checkIn;
};

const Booking = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [country, setCountry] = useState('AZ');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState({ flights: [], tours: [], message: '' });
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const [selectedTourId, setSelectedTourId] = useState(null);

  const hotel = bookingData?.hotel;
  const room = bookingData?.room;
  const checkIn = bookingData?.checkIn;
  const checkOut = bookingData?.checkOut;
  const guests = bookingData?.guests;
  const priceBreakdown = bookingData?.priceBreakdown;

  useEffect(() => {
    // Load user data if authenticated
    const userData = localStorage.getItem('user') || localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setGuestName(user.name || '');
      setGuestEmail(user.email || '');
      setGuestPhone(user.phone || '');
    }
  }, []);

  useEffect(() => {
    if (!hotel) return undefined;
    let active = true;
    getTripSuggestions({
      city: hotel.city || hotel.location || '',
      checkIn,
      checkOut,
      guests,
    })
      .then((data) => {
        if (!active) return;
        setSuggestions({
          message: data.message || 'Səyahətini tamamla — uçuş və tur seçimlərinə də bax!',
          flights: Array.isArray(data.flights) ? data.flights : [],
          tours: Array.isArray(data.tours) ? data.tours : [],
        });
      })
      .catch(() => {
        if (!active) return;
        setSuggestions({ flights: [], tours: [], message: '' });
      });
    return () => {
      active = false;
    };
  }, [hotel, checkIn, checkOut, guests]);

  if (!hotel || !room) {
    return (
      <div className="booking-page">
        <div className="booking-container">
          <div className="no-booking-data">
            <FaInfoCircle className="no-data-icon" />
            <h2>{t('pay.missingTitle')}</h2>
            <p>{t('pay.missingText')}</p>
            <Link to="/hotels" className="btn-back-hotels">
              Otellərə qayıt
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedFlight = suggestions.flights.find((item) => item.id === selectedFlightId) || null;
  const selectedTour = suggestions.tours.find((item) => item.id === selectedTourId) || null;
  const flightTotal = selectedFlight ? bundlePrice(selectedFlight.price, guests) : 0;
  const tourTotal = selectedTour ? bundlePrice(selectedTour.price, guests) : 0;
  const grandTotal = Number(priceBreakdown?.total) + flightTotal + tourTotal;

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!agreedToTerms) {
      setFormError('Zəhmət olmasa şərtləri qəbul edin');
      return;
    }

    if (paymentMethod === 'card') {
      const digits = cardNumber.replace(/\s/g, '');
      if (digits.length < 16) {
        setFormError('Kart nömrəsi 16 rəqəm olmalıdır');
        return;
      }
      if (!cardName.trim()) {
        setFormError('Kart sahibinin adını yazın');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        setFormError('Bitmə tarixini AA/İİ formatında yazın');
        return;
      }
      if (cvv.length < 3) {
        setFormError('CVV 3 rəqəm olmalıdır');
        return;
      }
    }

    try {
      setSubmitting(true);
      const guest = { guestName, guestEmail, guestPhone, guests, paymentMethod, cardNumber, cardHolder: cardName };
      const booking = await createBooking({
        bookingType: 'hotel',
        hotelId: hotel.id,
        roomId: room.id,
        checkIn,
        checkOut,
        specialRequests,
        ...guest,
      });

      const extras = [];
      const extraErrors = [];
      if (selectedFlight) {
        try {
          extras.push(await createBooking({
            bookingType: 'flight',
            flightId: selectedFlight.id,
            bundleWithHotel: true,
            ...guest,
          }));
        } catch (error) {
          extraErrors.push(error.message || 'Uçuş əlavə olunmadı.');
        }
      }
      if (selectedTour) {
        try {
          extras.push(await createBooking({
            bookingType: 'tour',
            tourId: selectedTour.id,
            travelDate: pickTourDate(selectedTour, checkIn, checkOut),
            bundleWithHotel: true,
            ...guest,
          }));
        } catch (error) {
          extraErrors.push(error.message || 'Tur əlavə olunmadı.');
        }
      }

      navigate('/booking-success', {
        state: {
          booking,
          extras,
          extrasError: extraErrors.join(' '),
        },
      });
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-page pay-page">
      <div className="booking-container">
        <div className="pay-screen">
          <section className="pay-photo" aria-label={room.name}>
            <img src={roomPhoto} alt={room.name} />
            <div className="pay-photo-caption">
              <h2>{room.name}</h2>
              <p className="pay-photo-price">₼ {money(priceBreakdown.total)} / {priceBreakdown.nights} gecə</p>
              <p>Bütün otaq, {guests} qonaq</p>
              <p>{formatDate(checkIn)} — {formatDate(checkOut)}</p>
            </div>
          </section>

          <form className="pay-panel" onSubmit={handleSubmitBooking}>
            <button type="button" className="pay-back" onClick={() => navigate(-1)}>
              <FaArrowLeft /> {t('pay.back')}
            </button>
            <p className="pay-context">{t('pay.context', { room: room.name, nights: priceBreakdown.nights })}</p>

            <label className="pay-field">
              <span>Ad</span>
              <div className="pay-input">
                <FaUser />
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                  placeholder="Adınız"
                />
              </div>
            </label>

            <label className="pay-field">
              <span>Email</span>
              <div className="pay-input">
                <MdEmail />
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  required
                  placeholder="email@example.com"
                />
              </div>
            </label>

            <label className="pay-field">
              <span>Telefon</span>
              <div className="pay-input">
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  required
                  placeholder="+994 XX XXX XX XX"
                />
              </div>
            </label>

            {(suggestions.flights.length > 0 || suggestions.tours.length > 0) && (
              <section className="pay-addons">
                <div className="pay-addons-head">
                  <div>
                    <h3>Səyahətini tamamla</h3>
                    <p>İstəyə bağlıdır. Seçdiyin uçuş və ya tur paketdə 10% endirimli olur.</p>
                  </div>
                  <span className="pay-addon-badge">−10%</span>
                </div>

                {suggestions.flights.length > 0 && (
                  <div className="pay-addon-group">
                    <div className="pay-addon-label">
                      <span>Uçuş seçimləri</span>
                    </div>
                    {suggestions.flights.map((flight) => {
                      const active = selectedFlightId === flight.id;
                      return (
                        <button
                          key={flight.id}
                          type="button"
                          className={`pay-choice pay-addon ${active ? 'active' : ''}`}
                          aria-pressed={active}
                          onClick={() => setSelectedFlightId(active ? null : flight.id)}
                        >
                          <span className="pay-choice-icon"><FaPlane /></span>
                          <span className="pay-choice-body">
                            <strong>{flight.airline} {flight.flightNumber}</strong>
                            <span className="pay-choice-meta">{flight.originCity} → {flight.destinationCity}</span>
                          </span>
                          <span className="pay-choice-price">
                            <span className="pay-choice-amount">₼ {money(bundlePrice(flight.price, guests))}</span>
                            <s>₼ {money(Number(flight.price) * guests)}</s>
                          </span>
                          <span className="pay-tick" aria-hidden="true">{active && <FaCheck />}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {suggestions.tours.length > 0 && (
                  <div className="pay-addon-group">
                    <div className="pay-addon-label">
                      <span>Tur seçimləri</span>
                    </div>
                    {suggestions.tours.map((tour) => {
                      const active = selectedTourId === tour.id;
                      return (
                        <button
                          key={tour.id}
                          type="button"
                          className={`pay-choice pay-addon ${active ? 'active' : ''}`}
                          aria-pressed={active}
                          onClick={() => setSelectedTourId(active ? null : tour.id)}
                        >
                          <span className="pay-choice-icon"><FaMapMarkedAlt /></span>
                          <span className="pay-choice-body">
                            <strong>{tour.name}</strong>
                            <span className="pay-choice-meta">{String(tour.destination || '').split(',')[0]} · {tour.duration}</span>
                          </span>
                          <span className="pay-choice-price">
                            <span className="pay-choice-amount">₼ {money(bundlePrice(tour.price, guests))}</span>
                            <s>₼ {money(Number(tour.price) * guests)}</s>
                          </span>
                          <span className="pay-tick" aria-hidden="true">{active && <FaCheck />}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            <div className="pay-choices">
              <button
                type="button"
                className={`pay-choice ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <span className="pay-choice-icon"><FaCreditCard /></span>
                <span className="pay-choice-body">
                  <strong>{t('pay.cardNow')}</strong>
                  <span className="pay-choice-amount">₼ {money(grandTotal)}</span>
                  <span className="pay-choice-note">Müştəri rezervasiya zamanı ödəniş edir. Real kart ödənişi üçün ödəniş provayderi lazımdır.</span>
                </span>
              </button>

              {paymentMethod === 'card' && (
                <div className="pay-card-fields">
                  <label className="pay-field">
                    <span>{t('pay.method')}</span>
                    <select className="pay-select" defaultValue="mastercard">
                      <option value="mastercard">Mastercard ilə</option>
                      <option value="visa">Visa ilə</option>
                    </select>
                  </label>

                  <label className="pay-field">
                    <span>Kart nömrəsi</span>
                    <div className="pay-input">
                      <input
                        inputMode="numeric"
                        autoComplete="cc-number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="•••• •••• •••• ••••"
                        required
                      />
                      <span className="card-brand" aria-hidden="true" />
                    </div>
                  </label>

                  <label className="pay-field">
                    <span>Kart sahibinin adı</span>
                    <input
                      className="pay-plain"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Ad Soyad"
                      autoComplete="cc-name"
                      required
                    />
                  </label>

                  <div className="pay-row">
                    <label className="pay-field">
                      <span>Bitmə tarixi</span>
                      <input
                        className="pay-plain"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder="AA/İİ"
                        required
                      />
                    </label>
                    <label className="pay-field">
                      <span>CVV</span>
                      <input
                        className="pay-plain"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        placeholder="•••"
                        required
                      />
                    </label>
                  </div>

                  <label className="pay-field">
                    <span>Ölkə</span>
                    <select className="pay-select" value={country} onChange={(e) => setCountry(e.target.value)}>
                      <option value="AZ">Azərbaycan</option>
                      <option value="TR">Türkiyə</option>
                      <option value="GB">Böyük Britaniya</option>
                      <option value="US">ABŞ</option>
                    </select>
                  </label>
                </div>
              )}

              <button
                type="button"
                className={`pay-choice ${paymentMethod === 'hotel' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('hotel')}
              >
                <span className="pay-choice-icon"><FaHotel /></span>
                <span className="pay-choice-body">
                  <strong>{t('pay.atHotel')}</strong>
                  <span className="pay-choice-amount">₼ {money(grandTotal)}</span>
                  <span className="pay-choice-note">Müştəri otağı indi rezervasiya edir, pulu isə otelə çatanda ödəyir.</span>
                </span>
              </button>
            </div>

            <label className="pay-field">
              <span>Xüsusi istək (opsional)</span>
              <input
                className="pay-plain"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Yüksək mərtəbə, gec check-in"
              />
            </label>

            <label className="pay-terms">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <span>{t('pay.terms')}</span>
            </label>

            <div className="pay-totals">
              <div>
                <span>Otel</span>
                <strong>₼ {money(priceBreakdown.total)}</strong>
              </div>
              {selectedFlight && (
                <div>
                  <span>Uçuş (paket −10%)</span>
                  <strong>₼ {money(flightTotal)}</strong>
                </div>
              )}
              {selectedTour && (
                <div>
                  <span>Tur (paket −10%)</span>
                  <strong>₼ {money(tourTotal)}</strong>
                </div>
              )}
              <div className="pay-total">
                <span>Yekun məbləğ</span>
                <strong>₼ {money(grandTotal)}</strong>
              </div>
            </div>

            {formError && <p className="pay-error">{formError}</p>}

            <button type="submit" className="pay-submit" disabled={submitting}>
              {paymentMethod === 'card'
                ? t('pay.pay', { amount: `₼ ${money(grandTotal)}` })
                : t('pay.confirm')}
            </button>
            <p className="pay-secure"><FaLock /> Kart məlumatı saxlanılmır və şifrələnmiş formada yoxlanılır</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
