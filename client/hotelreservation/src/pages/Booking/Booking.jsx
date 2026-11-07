import Combobox from '../../components/common/Select/Combobox';
import Select from '../../components/common/Select/Select';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaCompass, FaCreditCard, FaGlobeEurope, FaHotel, FaInfoCircle, FaLock, FaPlane, FaRulerCombined, FaShieldAlt, FaUserFriends } from 'react-icons/fa';
import { formatDate } from '../../data/roomsData';
import CabinPicker from '../../components/common/CabinPicker/CabinPicker';
import { applyCouponCode, createBooking, getActiveDiscounts, getTours, getTripCountries, getTripSuggestionsByCountry } from '../../api/client';
import roomPhoto from '../../assets/images/otaq2.jpg';
import { useLanguage } from '../../context/LanguageContext';
import './Booking.css';

const money = (value) => {
  const amount = Number(value) || 0;
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
};

const fmt = (value) => `₼${(Number(value) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const uniqueBy = (items, keyFn) => {
  const seen = new Set();
  return (Array.isArray(items) ? items : []).filter((item) => {
    const key = keyFn(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const AIRLINE_COLORS = ['#c0392b', '#2563a8', '#d68910', '#1e8449', '#7d3c98', '#117a8b'];
const airlineColor = (name) => {
  const sum = Array.from(String(name || '')).reduce((total, char) => total + char.charCodeAt(0), 0);
  return AIRLINE_COLORS[sum % AIRLINE_COLORS.length];
};
const airlineInitials = (name) => String(name || '?')
  .split(/s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((word) => word[0].toUpperCase())
  .join('');

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

const DEPOSIT_PERCENTS = [20, 30, 40];

const roundMoney = (value) => Math.round((Number(value) || 0) * 100) / 100;

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
  const [depositPercent, setDepositPercent] = useState(20);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [country, setCountry] = useState('AZ');
  const [cardBrand, setCardBrand] = useState('mastercard');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState({ flights: [], tours: [] });
  const [countries, setCountries] = useState([]);
  const [travelCountry, setTravelCountry] = useState('');
  const [offersLoading, setOffersLoading] = useState(false);
  const [offersError, setOffersError] = useState('');
  const [discounts, setDiscounts] = useState([]);
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  // The travel class picked on each suggested flight (flight id -> class)
  const [flightCabin, setFlightCabin] = useState({});
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponBusy, setCouponBusy] = useState(false);
  const [couponError, setCouponError] = useState('');

  const hotel = bookingData?.hotel;
  const room = bookingData?.room;
  const selectedRooms = bookingData?.selectedRooms || (room ? [room] : []);
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
    getTripCountries()
      .then((items) => {
        if (!active) return;
        const list = Array.isArray(items) ? items : [];
        setCountries(list);
        const own = list.find((item) => item.name.toLowerCase() === String(hotel.country || '').toLowerCase());
        if (own) {
          setOffersLoading(true);
          setTravelCountry(own.name);
        }
      })
      .catch(() => {
        if (active) setCountries([]);
      });
    return () => {
      active = false;
    };
  }, [hotel]);

  useEffect(() => {
    if (!travelCountry) return undefined;
    let active = true;
    getTripSuggestionsByCountry({ country: travelCountry, guests })
      .then((result) => {
        if (!active) return;
        setSuggestions((prev) => ({ ...prev, flights: uniqueBy(result.flights, (item) => item.id) }));
      })
      .catch((error) => {
        if (!active) return;
        setSuggestions((prev) => ({ ...prev, flights: [] }));
        setOffersError(error.message || 'Uçuş və tur məlumatları yüklənmədi.');
      })
      .finally(() => {
        if (active) setOffersLoading(false);
      });
    return () => {
      active = false;
    };
  }, [travelCountry, guests]);

  // Tours are tied to the hotel being booked: the guest sees only that hotel's tours and may add one.
  useEffect(() => {
    if (!hotel?.id) return undefined;
    let active = true;
    getTours({ hotelId: hotel.id, guests })
      .then((items) => {
        if (active) setSuggestions((prev) => ({ ...prev, tours: uniqueBy(items, (item) => item.id) }));
      })
      .catch(() => {
        if (active) setSuggestions((prev) => ({ ...prev, tours: [] }));
      });
    return () => {
      active = false;
    };
  }, [hotel?.id, guests]);

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
  // Price and class of a flight as the guest chose it; the server's choice (cheapest) is the default.
  const cabinFor = (flight) => {
    const wanted = flightCabin[flight.id] || flight.cabinClass;
    return (flight.cabins || []).find((item) => item.cabinClass === wanted)
      || { cabinClass: flight.cabinClass, price: Number(flight.price), seatsAvailable: flight.seatsAvailable };
  };
  const selectedTour = suggestions.tours.find((item) => item.id === selectedTourId) || null;
  const combo = comboKey(selectedFlight, selectedTour);
  const activeRule = discounts.find((item) => item.combo === combo && item.isActive) || null;
  const discountPercent = Number(activeRule?.percent) || 0;
  const discountAmount = Number(activeRule?.amount) || 0;
  const hotelList = Number(priceBreakdown?.total) || 0;
  const flightList = selectedFlight ? Number(cabinFor(selectedFlight).price) * Number(guests) : 0;
  const tourList = selectedTour ? Number(selectedTour.price) * Number(guests) : 0;
  const listTotal = hotelList + flightList + tourList;
  const percentOff = discountPercent > 0 ? listTotal - applyPercent(listTotal, discountPercent) : 0;
  const amountOff = discountPercent <= 0 && discountAmount > 0 ? Math.min(discountAmount, listTotal) : 0;
  const comboOff = percentOff || amountOff;
  const afterCombo = roundMoney(listTotal - comboOff);
  const couponPercent = Number(appliedCoupon?.percent) || 0;
  const couponFixed = Number(appliedCoupon?.amount) || 0;
  const couponOff = couponPercent > 0
    ? roundMoney(afterCombo - applyPercent(afterCombo, couponPercent))
    : Math.min(couponFixed, afterCombo);
  const discountValue = roundMoney(comboOff + couponOff);
  const grandTotal = roundMoney(listTotal - discountValue);
  const nights = priceBreakdown?.nights || 1;
  const payNowPercent = paymentMethod === 'hotel' ? depositPercent : 100;
  const depositAmount = roundMoney(grandTotal * payNowPercent / 100);
  const remainingAmount = roundMoney(grandTotal - depositAmount);

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const handleCountryChange = (value) => {
    setTravelCountry(value);
    setOffersLoading(Boolean(value));
    setOffersError('');
    setSuggestions((prev) => ({ flights: [], tours: prev.tours }));
    setSelectedFlightId(null);
  };

  const handleApplyCoupon = async (rawValue) => {
    const code = String(rawValue ?? couponInput).trim();
    if (!code || couponBusy) return null;
    setCouponBusy(true);
    setCouponError('');
    try {
      const rule = await applyCouponCode(code);
      const next = {
        ...rule,
        code: rule.code || rule.Code || code.toUpperCase(),
        percent: Number(rule.percent ?? rule.Percent) || 0,
        amount: Number(rule.amount ?? rule.Amount) || 0,
      };
      setAppliedCoupon(next);
      setCouponInput(next.code);
      return next;
    } catch (error) {
      setAppliedCoupon(null);
      setCouponError(error.message || 'Kupon kodu keçərsizdir.');
      return null;
    } finally {
      setCouponBusy(false);
    }
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setFormError('');

    // Check dates validity
    if (!checkIn || !checkOut) {
      setFormError('Giriş və çıxış tarixləri tələb olunur');
      return;
    }
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) {
      setFormError('Çıxış tarixi giriş tarixindən sonra olmalıdır');
      return;
    }

    if (!agreedToTerms) {
      setFormError('Zəhmət olmasa şərtləri qəbul edin');
      return;
    }

    // Validate payment method
    const normalizedPaymentMethod = paymentMethod === 'hotel' ? 'hotel' : paymentMethod === 'cash' ? 'cash' : 'card';
    
    if (normalizedPaymentMethod === 'hotel' && !DEPOSIT_PERCENTS.includes(depositPercent)) {
      setFormError('Oteldə ödəniş üçün 20%, 30% və ya 40% avans seçin');
      return;
    }

    // Only validate card details if payment method requires card
    if (normalizedPaymentMethod === 'card' || normalizedPaymentMethod === 'hotel') {
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
      // Demo payment - CVV not strictly required but keep format check
      if (cvv && cvv.length > 0 && cvv.length < 3) {
        setFormError('CVV 3 rəqəm olmalıdır');
        return;
      }
    }

    let couponForBooking = appliedCoupon;
    const typedCoupon = couponInput.trim();
    if (typedCoupon && typedCoupon.toUpperCase() !== String(appliedCoupon?.code || '').toUpperCase()) {
      couponForBooking = await handleApplyCoupon(typedCoupon);
      if (!couponForBooking) return;
    }

    try {
      setSubmitting(true);
      const stay = { roomIds: selectedRooms.map((item) => item.id), rooms: selectedRooms.length,
        adults: bookingData.adults ?? guests, children: bookingData.children ?? 0, checkIn, checkOut, guests };

      const guest = {
        guestName,
        guestEmail,
        guestPhone,
        guests,
        paymentMethod: normalizedPaymentMethod,
        cardNumber: (normalizedPaymentMethod === 'card' || normalizedPaymentMethod === 'hotel') ? cardNumber : undefined,
        cardHolder: (normalizedPaymentMethod === 'card' || normalizedPaymentMethod === 'hotel') ? cardName : undefined,
        depositPercent: normalizedPaymentMethod === 'hotel' ? depositPercent : 100,
      };
      const booking = await createBooking({
        bookingType: 'hotel',
        hotelId: hotel.id,
        expectedStayTotal: priceBreakdown.total,
        ...stay,
        specialRequests,
        bundleCombo: combo || undefined,
        couponCode: couponForBooking?.code || undefined,
        ...guest,
      });

      const extras = [];
      const extraErrors = [];
      if (selectedFlight) {
        try {
          extras.push(await createBooking({
            bookingType: 'flight',
            flightId: selectedFlight.id,
            cabinClass: cabinFor(selectedFlight).cabinClass,
            travelCountry,
            bundleCombo: combo,
            couponCode: couponForBooking?.code || undefined,
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
            travelCountry,
            travelDate: pickTourDate(selectedTour, checkIn, checkOut),
            bundleCombo: combo,
            couponCode: couponForBooking?.code || undefined,
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
            <div className="pay-method-row" role="radiogroup" aria-label="Ödəniş üsulu">
              <button
                type="button"
                role="radio"
                aria-checked={paymentMethod === 'card'}
                className={`pay-method-card ${paymentMethod === 'card' ? 'on' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <span className="pm-head">
                  <span className="pm-icon"><FaCreditCard /></span>
                  <span className="pm-radio" aria-hidden="true" />
                </span>
                <strong>{t('pay.cardNow')}</strong>
                <em>{fmt(grandTotal)}</em>
                <small>{t('pay.payNowHint')}</small>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={paymentMethod === 'hotel'}
                className={`pay-method-card ${paymentMethod === 'hotel' ? 'on' : ''}`}
                onClick={() => setPaymentMethod('hotel')}
              >
                <span className="pm-head">
                  <span className="pm-icon"><FaHotel /></span>
                  <span className="pm-radio" aria-hidden="true" />
                </span>
                <strong>{t('pay.atHotel')}</strong>
                <small>{t('pay.payAtHotelHint')}</small>
              </button>
            </div>

            {paymentMethod === 'hotel' && (
              <div className="pay-deposit">
                <p className="pay-hotel-note">{t('pay.depositHint')}</p>
                <div className="pay-deposit-options" role="group" aria-label={t('pay.depositTitle')}>
                  {DEPOSIT_PERCENTS.map((percent) => (
                    <button
                      key={percent}
                      type="button"
                      className={`pay-deposit-btn ${depositPercent === percent ? 'on' : ''}`}
                      onClick={() => setDepositPercent(percent)}
                    >
                      <strong>{percent}%</strong>
                      <span>{fmt(roundMoney(grandTotal * percent / 100))}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(paymentMethod === 'card' || paymentMethod === 'hotel') && (
              <div className="pay-card-grid">
                <label className="glass-field">
                  <span>{t('pay.method')}</span>
                  <Select value={cardBrand} onChange={(e) => setCardBrand(e.target.value)}>
                    <option value="mastercard">Mastercard</option>
                    <option value="visa">Visa</option>
                  </Select>
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
                  <Select value={country} onChange={(e) => setCountry(e.target.value)}>
                    <option value="AZ">Azərbaycan</option>
                    <option value="TR">Türkiyə</option>
                    <option value="GB">Böyük Britaniya</option>
                    <option value="US">ABŞ</option>
                  </Select>
                </label>
              </div>
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
              <span>Daha çox seçim, daha yaxşı təcrübə!</span>
            </div>

            <div className="enrich-country">
              <div className="enrich-country-row">
                <span className="country-label">
                  <FaGlobeEurope /> Səyahət ölkəsi:
                </span>
                <div className="country-select">
                  <Combobox label="Səyahət ölkəsi" searchable value={travelCountry}
                    options={countries.map((country) => ({ value: country.name, label: country.name }))}
                    onChange={handleCountryChange} placeholder="Ölkə seçin" searchLabel="Ölkə axtar…" />
                </div>
              </div>
              <p className="enrich-hint">
                <FaInfoCircle /> Ölkə dəyişdirildikdə uçuş və tur seçimləri yenilənəcək. Bu seçimlər könüllüdür.
              </p>
            </div>

            {!travelCountry && (
              <div className="enrich-placeholder">
                <FaGlobeEurope />
                <strong>Səyahət ölkəsini seçin</strong>
                <p>Seçdiyiniz ölkəyə uyğun uçuş biletləri və tur paketləri burada görünəcək. Bu seçimlər könüllüdür.</p>
              </div>
            )}
            {offersError && <p className="pay-error">{offersError}</p>}
            {(travelCountry || suggestions.tours.length > 0) && (
            <div className="enrich-grid">
              {travelCountry && (
              <section className="enrich-panel" aria-label="Uçuş bileti">
                <header className="enrich-panel-head">
                  <span className="enrich-panel-icon"><FaPlane /></span>
                  <div>
                    <h3>Uçuş bileti</h3>
                    <p>{travelCountry} istiqamətli uçuşlar</p>
                  </div>
                </header>

                <div className="enrich-list">
                  {offersLoading && <p className="enrich-empty">Yüklənir...</p>}
                  {!offersLoading && suggestions.flights.length === 0 && (
                    <p className="enrich-empty">Bu ölkə üçün uyğun uçuş tapılmadı.</p>
                  )}
                  {!offersLoading && suggestions.flights.map((flight) => {
                    const active = selectedFlightId === flight.id;
                    return (
                      <article key={flight.id} className={`offer-card flight-card ${active ? 'active' : ''}`}>
                        <div className="flight-top">
                          <span className="airline-logo" style={{ background: airlineColor(flight.airline) }}>
                            {airlineInitials(flight.airline)}
                          </span>
                          <div className="flight-name">
                            <strong>{flight.airline}</strong>
                            <em>{flight.flightNumber}</em>
                          </div>
                          <span className={`pick-dot ${active ? 'on' : ''}`} aria-hidden="true">
                            {active && <FaCheck />}
                          </span>
                        </div>

                        <div className="flight-route">
                          <div className="route-point">
                            <b>{flight.originCode}</b>
                            <span>{flight.originCity}</span>
                          </div>
                          <span className="route-line" aria-hidden="true"><FaPlane /></span>
                          <div className="route-point end">
                            <b>{flight.destinationCode}</b>
                            <span>{flight.destinationCity}</span>
                          </div>
                        </div>

                        <div className="flight-times">
                          <b>{flight.departTime}</b>
                          <span>{flight.duration}</span>
                          <b>{flight.arriveTime}</b>
                          <em>{formatDate(String(flight.departureAt).slice(0, 10))}</em>
                        </div>

                        <CabinPicker
                          cabins={flight.cabins}
                          value={cabinFor(flight).cabinClass}
                          party={Number(guests) || 1}
                          onChange={(next) => setFlightCabin((prev) => ({ ...prev, [flight.id]: next }))}
                        />

                        <div className="offer-foot">
                          <div className="offer-price">
                            <strong>{fmt(Number(cabinFor(flight).price) * Number(guests))}</strong>
                            <small>{guests} nəfər</small>
                          </div>
                          <button
                            type="button"
                            className="offer-pick"
                            aria-pressed={active}
                            onClick={() => setSelectedFlightId(active ? null : flight.id)}
                          >
                            {active ? 'Seçildi' : 'Bilet seç'}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
              )}

              {suggestions.tours.length > 0 && (
              <section className="enrich-panel" aria-label="Turlar">
                <header className="enrich-panel-head">
                  <span className="enrich-panel-icon"><FaCompass /></span>
                  <div>
                    <h3>Turlar</h3>
                    <p>{hotel.title || hotel.name} üçün turlar</p>
                  </div>
                </header>

                <div className="enrich-list">
                  {offersLoading && <p className="enrich-empty">Yüklənir...</p>}
                  {suggestions.tours.map((tour) => {
                    const active = selectedTourId === tour.id;
                    return (
                      <article key={tour.id} className={`offer-card tour-card ${active ? 'active' : ''}`}>
                        <div className="tour-media">
                          <img src={tour.image} alt={tour.name} loading="lazy" decoding="async" />
                          <span className={`pick-dot ${active ? 'on' : ''}`} aria-hidden="true">
                            {active && <FaCheck />}
                          </span>
                        </div>
                        <div className="tour-body">
                          <strong className="tour-name">{tour.name}</strong>
                          <span className="tour-duration">{tour.duration}</span>
                          <p className="tour-desc">{tour.description}</p>
                        </div>
                        <div className="offer-foot">
                          <div className="offer-price">
                            <strong>{fmt(Number(tour.price) * Number(guests))}</strong>
                            <small>{guests} nəfər</small>
                          </div>
                          <button
                            type="button"
                            className="offer-pick"
                            aria-pressed={active}
                            onClick={() => setSelectedTourId(active ? null : tour.id)}
                          >
                            {active ? 'Seçildi' : 'Turu seç'}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
              )}
            </div>
            )}
          </div>
        </section>

        <aside className="pay-checkout">
          <h2>{t('pay.checkout')}</h2>
          <div className="co-photo">
            <img src={coverImage} alt={room.name} />
          </div>
          <h3>{selectedRooms.map((item) => item.name).join(', ')}</h3>
          <p className="co-meta">
            <span><FaUserFriends /> {guests} qonaq</span>
            {selectedRooms.length === 1 && room.size && <span><FaRulerCombined /> {room.size}</span>}
            <span><FaHotel /> {hotel.title || hotel.name}</span>
          </p>

          <div className="co-stay">
            <div>
              <span>Giriş tarixi</span>
              <strong>{formatDate(checkIn)}</strong>
              <em>Çət · {hotel.checkIn || '14:00'}</em>
            </div>
            <div className="co-nights">
              <b>{nights}</b>
              <span>gecə</span>
            </div>
            <div>
              <span>Çıxış tarixi</span>
              <strong>{formatDate(checkOut)}</strong>
              <em>Çıx · {hotel.checkOut || '12:00'}</em>
            </div>
          </div>

          <h4>{t('pay.priceDetails')}</h4>
          <div className="pay-coupon">
            <label htmlFor="pay-coupon">{t('pay.coupon')}</label>
            <div className="pay-coupon-row">
              <input
                id="pay-coupon"
                value={couponInput}
                onChange={(event) => {
                  setCouponInput(event.target.value.toUpperCase());
                  setCouponError('');
                  if (appliedCoupon) setAppliedCoupon(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleApplyCoupon();
                  }
                }}
                onBlur={() => {
                  if (couponInput.trim() && couponInput.trim().toUpperCase() !== String(appliedCoupon?.code || '').toUpperCase()) {
                    handleApplyCoupon();
                  }
                }}
                placeholder={t('pay.couponPlaceholder')}
                maxLength={40}
                autoComplete="off"
              />
              <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => handleApplyCoupon()} disabled={couponBusy || !couponInput.trim()}>
                {couponBusy ? '...' : t('pay.applyCoupon')}
              </button>
            </div>
            {couponError && <p className="pay-error">{couponError}</p>}
            {appliedCoupon && !couponError && (
              <p className="pay-coupon-ok">{t('pay.couponApplied')}</p>
            )}
          </div>
          <div className="co-totals">
            <div>
              <span>Otel ({nights} gecə)</span>
              <strong>{fmt(hotelList)}</strong>
            </div>
            {selectedFlight && (
              <div>
                <span>Uçuş bileti</span>
                <strong>{fmt(flightList)}</strong>
              </div>
            )}
            {selectedTour && (
              <div>
                <span>Tur paketi</span>
                <strong>{fmt(tourList)}</strong>
              </div>
            )}
            {comboOff > 0 && (
              <div className="co-minus">
                <span>{discountPercent > 0 ? `Endirim (−${money(discountPercent)}%)` : t('pay.discount')}</span>
                <strong>−{fmt(comboOff)}</strong>
              </div>
            )}
            {couponOff > 0 && (
              <div className="co-minus">
                <span>{t('pay.couponOff', { code: appliedCoupon?.code || couponInput })}</span>
                <strong>−{fmt(couponOff)}</strong>
              </div>
            )}
            <div className="co-grand">
              <span>Yekun məbləğ</span>
              <strong>{fmt(grandTotal)}</strong>
            </div>
            {paymentMethod === 'hotel' && (
              <>
                <div>
                  <span>{t('pay.depositNow', { percent: depositPercent })}</span>
                  <strong>{fmt(depositAmount)}</strong>
                </div>
                <div>
                  <span>{t('pay.remainHotel')}</span>
                  <strong>{fmt(remainingAmount)}</strong>
                </div>
              </>
            )}
          </div>

          {formError && <p className="pay-error">{formError}</p>}

          <button type="submit" className="pay-submit" disabled={submitting}>
            <FaLock />
            <span>
              {paymentMethod === 'hotel'
                ? t('pay.payDeposit', { amount: fmt(depositAmount) })
                : t('pay.pay', { amount: fmt(grandTotal) })}
            </span>
          </button>
          <p className="pay-secure"><FaShieldAlt /> {t('pay.secure')}</p>
        </aside>
      </form>
    </div>
  );
};

export default Booking;
