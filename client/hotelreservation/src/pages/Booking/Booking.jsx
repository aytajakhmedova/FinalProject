import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaHotel, FaInfoCircle, FaLock, FaUser } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { formatDate } from '../../data/roomsData';
import { addBooking, generateConfirmationNumber, normalizeBooking } from '../../utils/bookingsStore';
import roomPhoto from '../../assets/images/otaq2.jpg';
import './Booking.css';

const Booking = () => {
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

  // If no booking data, redirect
  if (!bookingData || !bookingData.hotel || !bookingData.room) {
    return (
      <div className="booking-page">
        <div className="booking-container">
          <div className="no-booking-data">
            <FaInfoCircle className="no-data-icon" />
            <h2>Rezervasiya məlumatı tapılmadı</h2>
            <p>Rezervasiya etmək üçün əvvəlcə otaq seçin.</p>
            <Link to="/hotels" className="btn-back-hotels">
              Otellərə qayıt
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { hotel, room, checkIn, checkOut, guests, priceBreakdown } = bookingData;

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const handleSubmitBooking = (e) => {
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

    const confirmationNumber = generateConfirmationNumber();
    const booking = normalizeBooking({
      id: confirmationNumber,
      confirmationNumber,
      guestName,
      guestEmail,
      guestPhone,
      hotelId: hotel.id,
      hotelName: hotel.title,
      hotelImage: hotel.mainImage || hotel.images?.[0],
      location: `${hotel.city || ''}${hotel.country ? `, ${hotel.country}` : ''}`,
      hotel: {
        id: hotel.id,
        name: hotel.title,
        title: hotel.title,
        location: hotel.location
      },
      room: {
        id: room.id,
        name: room.name,
        pricePerNight: room.pricePerNight
      },
      roomId: room.id,
      roomType: room.name,
      pricePerNight: room.pricePerNight,
      checkIn,
      checkOut,
      guests,
      nights: priceBreakdown.nights,
      totalPrice: priceBreakdown.total,
      priceBreakdown,
      specialRequests,
      paymentMethod,
      status: 'confirmed',
      statusHistory: [
        {
          status: 'confirmed',
          timestamp: new Date().toISOString(),
          note: 'Rezervasiya yaradıldı'
        }
      ],
      bookingDate: new Date().toISOString(),
    });

    addBooking(booking);
    navigate('/booking-success', { state: { booking } });
  };

  const money = (value) => {
    const amount = Number(value) || 0;
    return Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
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
              <FaArrowLeft /> Ödəniş məlumatları
            </button>
            <p className="pay-context">Rezervasiya: {room.name} · {priceBreakdown.nights} gecə</p>

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

            <div className="pay-choices">
              <button
                type="button"
                className={`pay-choice ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <span className="pay-choice-icon"><FaCreditCard /></span>
                <span className="pay-choice-body">
                  <strong>1. Kartla indi ödə</strong>
                  <span className="pay-choice-amount">₼ {money(priceBreakdown.total)}</span>
                  <span className="pay-choice-note">Müştəri rezervasiya zamanı ödəniş edir. Real kart ödənişi üçün ödəniş provayderi lazımdır.</span>
                </span>
              </button>

              {paymentMethod === 'card' && (
                <div className="pay-card-fields">
                  <label className="pay-field">
                    <span>Ödəniş üsulu</span>
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
                  <strong>2. Oteldə ödə</strong>
                  <span className="pay-choice-amount">₼ {money(priceBreakdown.total)}</span>
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
              <span>Rezervasiya şərtlərini qəbul edirəm</span>
            </label>

            <div className="pay-totals">
              <div>
                <span>Ara cəm</span>
                <strong>₼ {money(priceBreakdown.subtotal)}</strong>
              </div>
              <div>
                <span>ƏDV (18%)</span>
                <strong>₼ {money(priceBreakdown.tax)}</strong>
              </div>
              <div className="pay-total">
                <span>Yekun məbləğ</span>
                <strong>₼ {money(priceBreakdown.total)}</strong>
              </div>
            </div>

            {formError && <p className="pay-error">{formError}</p>}

            <button type="submit" className="pay-submit">
              {paymentMethod === 'card'
                ? `₼ ${money(priceBreakdown.total)} ödə`
                : 'Rezervasiyanı təsdiqlə'}
            </button>
            <p className="pay-secure"><FaLock /> Kart məlumatı saxlanılmır və şifrələnmiş formada yoxlanılır</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
