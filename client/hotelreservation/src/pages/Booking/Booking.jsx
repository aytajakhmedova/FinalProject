import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaInfoCircle, FaLock, FaPlane, FaShieldAlt } from 'react-icons/fa';
import { formatDate } from '../../data/roomsData';
import { uniqueTourImage } from '../../data/localMedia';
import { createBooking, getActiveDiscounts, getFlights, getTours, quoteRoom } from '../../api/client';
import roomPhoto from '../../assets/images/otaq2.jpg';
import planePhoto from '../../assets/images/ucakk.jpg';
import { useLanguage } from '../../context/LanguageContext';
import './Booking.css';

const money = (value) => {
  const amount = Number(value) || 0;
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
};

const uniqueBy = (items, keyFn) => {
  const seen = new Set();
  return (Array.isArray(items) ? items : []).filter((item) => {
    const key = keyFn(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const comboKey = (flight, tour) => {
  if (flight && tour) return 'hotel_flight_tour';
  if (flight) return 'hotel_flight';
  if (tour) return 'hotel_tour';
  return '';
};

const applyPercent = (value, percent) =>
  Math.round(Number(value) * (1 - Number(percent) / 100) * 100) / 100;

const pickTourDate = (tour, checkIn, checkOut) => {
  const dates = tour?.availableDates || [];
  const inStay = dates.find((date) => date >= checkIn && (!checkOut || date < checkOut));
  return inStay || dates[0] || checkIn;
};

const maskedCard = (value) => {
  const digits = String(value || '').replace(/\D/g, '').padEnd(16, '•');
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

const Booking = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;
  const toursTrackRef = useRef(null);

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
  const [cardBrand, setCardBrand] = useState('mastercard');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState({ flights: [], tours: [], message: '' });
  const [discounts, setDiscounts] = useState([]);
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const [selectedTourId, setSelectedTourId] = useState(null);

  const hotel = bookingData?.hotel;
  const room = bookingData?.room;
  const checkIn = bookingData?.checkIn;
  const checkOut = bookingData?.checkOut;
  const guests = bookingData?.guests;
  const priceBreakdown = bookingData?.priceBreakdown;
  const coverImage = room?.images?.[0] || room?.image || hotel?.mainImage || hotel?.image || roomPhoto;

  useEffect(() => {
    const userData = localStorage.getItem('user') || localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setGuestName(user.name || '');
      setGuestEmail(user.email || '');
      setGuestPhone(user.phone || '');
      setCardName(user.name || '');
    }
  }, []);

  useEffect(() => {
    if (!hotel) return undefined;
    let active = true;
    Promise.all([
      getFlights().catch(() => []),
      getTours().catch(() => []),
    ])
      .then(([flightItems, tourItems]) => {
        if (!active) return;
        setSuggestions({
          message: 'Səyahətini tamamla — bütün uçuş və tur seçimlərinə bax.',
          flights: uniqueBy(flightItems, (item) => item.id),
          tours: uniqueBy(tourItems, (item) => item.id),
        });
      })
      .catch(() => {
        if (!active) return;
        setSuggestions({ flights: [], tours: [], message: '' });
      });
    return () => {
      active = false;
    };
  }, [hotel]);

  useEffect(() => {
    let active = true;
    getActiveDiscounts()
      .then((items) => {
        if (active) setDiscounts(Array.isArray(items) ? items : []);
      })
      .catch(() => {
        if (active) setDiscounts([]);
      });
    return () => {
      active = false;
    };
  }, []);

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
  const combo = comboKey(selectedFlight, selectedTour);
  const activeRule = discounts.find((item) => item.combo === combo && item.isActive) || null;
  const discountPercent = Number(activeRule?.percent) || 0;
  const discountAmount = Number(activeRule?.amount) || 0;
  const hotelList = Number(priceBreakdown?.total) || 0;
  const flightList = selectedFlight ? Number(selectedFlight.price) * Number(guests) : 0;
  const tourList = selectedTour ? Number(selectedTour.price) * Number(guests) : 0;
  const listTotal = hotelList + flightList + tourList;
  const percentOff = discountPercent > 0 ? listTotal - applyPercent(listTotal, discountPercent) : 0;
  const amountOff = discountPercent <= 0 && discountAmount > 0 ? Math.min(discountAmount, listTotal) : 0;
  const discountValue = percentOff || amountOff;
  const grandTotal = Math.round((listTotal - discountValue) * 100) / 100;
  const nights = priceBreakdown?.nights || 1;

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
      const quote = await quoteRoom(room.id, { checkIn, checkOut, guests });
      if (!quote?.available) {
        setFormError(quote?.message || 'Otaq seçilmiş tarixlərdə boş deyil. Zəhmət olmasa tarixləri dəyişin.');
        return;
      }

      const guest = { guestName, guestEmail, guestPhone, guests, paymentMethod, cardNumber, cardHolder: cardName };
      const booking = await createBooking({
        bookingType: 'hotel',
        hotelId: hotel.id,
        roomId: room.id,
        checkIn,
        checkOut,
        specialRequests,
        bundleCombo: combo || undefined,
        ...guest,
      });

      const extras = [];
      const extraErrors = [];
      if (selectedFlight) {
        try {
          extras.push(await createBooking({
            bookingType: 'flight',
            flightId: selectedFlight.id,
            bundleCombo: combo,
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
            bundleCombo: combo,
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

  const addonLines = [
    selectedFlight && {
      key: 'flight',
      label: `${selectedFlight.flightNumber || selectedFlight.airline}`,
      amount: flightList,
      onClear: () => setSelectedFlightId(null),
    },
    selectedTour && {
      key: 'tour',
      label: selectedTour.name,
      amount: tourList,
      onClear: () => setSelectedTourId(null),
    },
  ].filter(Boolean);

  return (
    <div className="booking-page pay-page">
      <div className="pay-bg" style={{ backgroundImage: `url(${coverImage})` }} />
      <div className="pay-veil" />

      <form className="pay-shell" onSubmit={handleSubmitBooking}>
        <section className="pay-stage">
          <div className="pay-info">
            <button type="button" className="pay-back" onClick={() => navigate(-1)}>
              <FaArrowLeft /> {t('pay.back')}
            </button>
            <h1>{t('pay.info')}</h1>
            <p className="pay-kicker">{t('pay.experience')}</p>

            <label className="glass-field">
              <span>{t('pay.name')}</span>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                placeholder="Adınız"
              />
            </label>
            <label className="glass-field">
              <span>{t('pay.email')}</span>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                required
                placeholder="email@example.com"
              />
            </label>
            <label className="glass-field">
              <span>{t('pay.phone')}</span>
              <input
                type="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                required
                placeholder="+994 XX XXX XX XX"
              />
            </label>

            <h2>{t('pay.cardInfo')}</h2>
            <div className="pay-method-row">
              <button
                type="button"
                className={`pay-method-card ${paymentMethod === 'card' ? 'on' : ''}`}
                onClick={() => setPaymentMethod(paymentMethod === 'card' ? 'hotel' : 'card')}
              >
                <span className="pm-icon"><FaCreditCard /></span>
                <span className="pm-copy">
                  <strong>{t('pay.cardNow')}</strong>
                  <em>₼ {money(grandTotal)}</em>
                  <small>{t('pay.payAtHotelHint')}</small>
                </span>
                <span className={`pay-switch ${paymentMethod === 'card' ? 'on' : ''}`} aria-hidden="true">
                  <i />
                </span>
              </button>

              <div className="glass-card-visual" aria-hidden="true">
                <div className="gcv-top">
                  <span>Credit Card</span>
                  <span className="gcv-wave" />
                </div>
                <span className="gcv-chip" />
                <p className="gcv-num">{maskedCard(cardNumber)}</p>
                <div className="gcv-bottom">
                  <span>{(cardName || 'CARD HOLDER').toUpperCase()}</span>
                  <span>{expiry || 'MM/YY'}</span>
                </div>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="pay-card-grid">
                <label className="glass-field">
                  <span>{t('pay.method')}</span>
                  <select value={cardBrand} onChange={(e) => setCardBrand(e.target.value)}>
                    <option value="mastercard">Mastercard</option>
                    <option value="visa">Visa</option>
                  </select>
                </label>
                <label className="glass-field">
                  <span>{t('pay.cardNumber')}</span>
                  <input
                    inputMode="numeric"
                    autoComplete="cc-number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="•••• •••• •••• ••••"
                    required
                  />
                </label>
                <label className="glass-field">
                  <span>{t('pay.cardHolder')}</span>
                  <input
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Ad Soyad"
                    autoComplete="cc-name"
                    required
                  />
                </label>
                <div className="pay-split">
                  <label className="glass-field">
                    <span>{t('pay.expiry')}</span>
                    <input
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="AA/İİ"
                      required
                    />
                  </label>
                  <label className="glass-field">
                    <span>{t('pay.cvv')}</span>
                    <input
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      placeholder="•••"
                      required
                    />
                  </label>
                </div>
                <label className="glass-field">
                  <span>{t('pay.country')}</span>
                  <select value={country} onChange={(e) => setCountry(e.target.value)}>
                    <option value="AZ">Azərbaycan</option>
                    <option value="TR">Türkiyə</option>
                    <option value="GB">Böyük Britaniya</option>
                    <option value="US">ABŞ</option>
                  </select>
                </label>
              </div>
            )}

            {paymentMethod === 'hotel' && (
              <p className="pay-hotel-note">{t('pay.atHotel')}</p>
            )}

            <label className="glass-field">
              <span>{t('pay.special')}</span>
              <input
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
          </div>

          <div className="pay-enrich">
            <div className="pay-enrich-head">
              <h2>{t('pay.enrich')}</h2>
              <span>{t('pay.completeTrip')}</span>
            </div>

            {(suggestions.flights.length > 0 || suggestions.tours.length > 0) && (
              <>
                <div className="offer-track">
                  {suggestions.flights.map((flight) => {
                    const active = selectedFlightId === flight.id;
                    const list = Number(flight.price) * Number(guests);
                    const priced = active && discountPercent > 0 ? applyPercent(list, discountPercent) : list;
                    return (
                      <button
                        key={flight.id}
                        type="button"
                        className={`offer-card flight ${active ? 'active' : ''}`}
                        aria-pressed={active}
                        onClick={() => setSelectedFlightId(active ? null : flight.id)}
                        style={{ backgroundImage: `url(${planePhoto})` }}
                      >
                        <span className="offer-shade" />
                        <FaPlane className="offer-plane" />
                        <span className="offer-copy">
                          <strong>{flight.airline}</strong>
                          <em>{flight.flightNumber}</em>
                          <b>₼ {money(priced)}</b>
                        </span>
                      </button>
                    );
                  })}
                  {suggestions.tours.map((tour) => {
                    const active = selectedTourId === tour.id;
                    const list = Number(tour.price) * Number(guests);
                    const priced = active && discountPercent > 0 ? applyPercent(list, discountPercent) : list;
                    const image = tour.image || uniqueTourImage(tour.id);
                    return (
                      <button
                        key={tour.id}
                        type="button"
                        className={`offer-card tour ${active ? 'active' : ''}`}
                        aria-pressed={active}
                        onClick={() => setSelectedTourId(active ? null : tour.id)}
                        style={{ backgroundImage: `url(${image})` }}
                      >
                        <span className="offer-shade" />
                        <span className="offer-copy">
                          <strong>{tour.name}</strong>
                          <b>₼ {money(priced)}</b>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="offer-more-row">
                  <button
                    type="button"
                    className="offer-more"
                    onClick={() => {
                      const track = document.querySelector('.offer-track');
                      if (track) track.scrollBy({ left: 280, behavior: 'smooth' });
                    }}
                  >
                    {t('pay.selectTours')}
                  </button>
                </div>
                <span ref={toursTrackRef} className="tours-anchor" />

                <ul className="offer-checks">
                  {addonLines.length === 0 && (
                    <li className="empty">{t('pay.completeTrip')}</li>
                  )}
                  {addonLines.map((line) => (
                    <li key={line.key}>
                      <label>
                        <input type="checkbox" checked readOnly onClick={line.onClear} />
                        <span>{line.label}</span>
                      </label>
                      <em>+{money(line.amount)}₼</em>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>

        <aside className="pay-checkout">
          <h2>{t('pay.checkout')}</h2>
          <div className="co-photo">
            <img src={coverImage} alt={room.name} />
          </div>
          <h3>{room.name}</h3>
          <p className="co-line">
            {t('pay.nightsLine', { nights, room: room.name, price: money(hotelList) })}
          </p>
          <p className="co-dates">{formatDate(checkIn)} — {formatDate(checkOut)}</p>

          <h4>{t('pay.priceDetails')}</h4>
          <ul className="co-checks">
            {addonLines.map((line) => (
              <li key={line.key}>
                <label>
                  <input type="checkbox" checked readOnly onClick={line.onClear} />
                  <span>{line.label}</span>
                </label>
                <em>+{money(line.amount)}₼</em>
              </li>
            ))}
          </ul>

          <div className="co-totals">
            {(selectedFlight || selectedTour) && (
              <div>
                <span>{t('pay.completeTrip')}</span>
                <strong>₼ {money(flightList + tourList)}</strong>
              </div>
            )}
            <div>
              <span>{t('pay.hotel')}</span>
              <strong>₼ {money(hotelList)}</strong>
            </div>
            {discountValue > 0 && (
              <div>
                <span>{discountPercent > 0 ? `−${money(discountPercent)}%` : t('pay.discount')}</span>
                <strong>−₼ {money(discountValue)}</strong>
              </div>
            )}
            <div className="co-grand">
              <span>{t('pay.total')}</span>
              <strong>₼ {money(grandTotal)}</strong>
            </div>
          </div>

          {formError && <p className="pay-error">{formError}</p>}

          <button type="submit" className="pay-submit" disabled={submitting}>
            <span>
              {paymentMethod === 'card'
                ? t('pay.pay', { amount: `${money(grandTotal)} ₼` })
                : t('pay.confirm')}
            </span>
            <FaShieldAlt />
          </button>
          <p className="pay-secure"><FaLock /> {t('pay.secure')}</p>
        </aside>
      </form>
    </div>
  );
};

export default Booking;
