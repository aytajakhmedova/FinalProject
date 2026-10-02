import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaHotel, FaBed, FaCalendarAlt, FaUsers, FaCheck, FaCreditCard, FaInfoCircle } from 'react-icons/fa';
import { formatDate } from '../../data/roomsData';
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

  useEffect(() => {
    // Load user data if authenticated
    const userData = localStorage.getItem('userData');
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

  const handleSubmitBooking = (e) => {
    e.preventDefault();

    if (!agreedToTerms) {
      alert('Zəhmət olmasa şərtləri qəbul edin');
      return;
    }

    // Create booking object
    const booking = {
      id: Date.now(),
      guestName,
      guestEmail,
      guestPhone,
      hotel: {
        id: hotel.id,
        name: hotel.title,
        location: hotel.location
      },
      room: {
        id: room.id,
        name: room.name,
        pricePerNight: room.pricePerNight
      },
      checkIn,
      checkOut,
      guests,
      nights: priceBreakdown.nights,
      priceBreakdown,
      specialRequests,
      status: 'confirmed', // Status lifecycle: confirmed → checked-in → checked-out → cancelled
      statusHistory: [
        {
          status: 'confirmed',
          timestamp: new Date().toISOString(),
          note: 'Rezervasiya yaradıldı'
        }
      ],
      bookingDate: new Date().toISOString(),
    };

    // Save to localStorage (mock)
    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('userBookings', JSON.stringify(existingBookings));

    // Navigate to success page
    navigate('/booking-success', { state: { booking } });
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        {/* Header */}
        <div className="booking-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <FaArrowLeft /> Geri
          </button>
          <h1 className="booking-page-title">Rezervasiya</h1>
        </div>

        <div className="booking-content">
          {/* Booking Form */}
          <div className="booking-form-section">
            <form onSubmit={handleSubmitBooking} className="booking-form-main">
              {/* Guest Information */}
              <div className="booking-form-card">
                <h2 className="form-section-title">Qonaq Məlumatları</h2>
                
                <div className="form-group">
                  <label htmlFor="guestName">Ad Soyad *</label>
                  <input
                    type="text"
                    id="guestName"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    className="form-input"
                    placeholder="Adınız və soyadınız"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="guestEmail">Email *</label>
                  <input
                    type="email"
                    id="guestEmail"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                    className="form-input"
                    placeholder="email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="guestPhone">Telefon *</label>
                  <input
                    type="tel"
                    id="guestPhone"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    required
                    className="form-input"
                    placeholder="+994 XX XXX XX XX"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="specialRequests">Xüsusi istəklər (opsional)</label>
                  <textarea
                    id="specialRequests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="form-textarea"
                    rows="4"
                    placeholder="Məsələn: Yüksək mərtəbə, gec check-in və s."
                  />
                </div>
              </div>

              {/* Payment Information */}
              <div className="booking-form-card">
                <h2 className="form-section-title">
                  <FaCreditCard /> Ödəniş Məlumatları
                </h2>
                
                <div className="payment-info-notice">
                  <FaInfoCircle />
                  <div>
                    <strong>Demo rejim</strong>
                    <p>Bu demo versiyadadır. Real ödəniş tələb olunmur.</p>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="booking-form-card">
                <div className="terms-checkbox-group">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    required
                  />
                  <label htmlFor="terms">
                    Rezervasiya şərtlərini və qaydalarını oxudum və qəbul edirəm *
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-submit-booking">
                <FaCheck /> Rezervasiyanı tamamla
              </button>
            </form>
          </div>

          {/* Booking Summary Sidebar */}
          <aside className="booking-summary-sidebar">
            {/* Hotel & Room Info */}
            <div className="summary-card">
              <h3 className="summary-card-title">Rezervasiya Xülasəsi</h3>
              
              <div className="summary-hotel-info">
                <img src={room.images[0]} alt={room.name} className="summary-room-image" />
                
                <div className="summary-hotel-details">
                  <div className="summary-detail-item">
                    <FaHotel className="summary-icon" />
                    <div>
                      <span className="summary-label">Otel</span>
                      <strong>{hotel.title}</strong>
                    </div>
                  </div>

                  <div className="summary-detail-item">
                    <FaBed className="summary-icon" />
                    <div>
                      <span className="summary-label">Otaq</span>
                      <strong>{room.name}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="summary-divider"></div>

              {/* Booking Details */}
              <div className="summary-booking-details">
                <div className="summary-row">
                  <div className="summary-row-label">
                    <FaCalendarAlt />
                    <span>Giriş</span>
                  </div>
                  <strong>{formatDate(checkIn)}</strong>
                </div>

                <div className="summary-row">
                  <div className="summary-row-label">
                    <FaCalendarAlt />
                    <span>Çıxış</span>
                  </div>
                  <strong>{formatDate(checkOut)}</strong>
                </div>

                <div className="summary-row">
                  <div className="summary-row-label">
                    <FaUsers />
                    <span>Qonaqlar</span>
                  </div>
                  <strong>{guests} nəfər</strong>
                </div>

                <div className="summary-row">
                  <span>Gecələr</span>
                  <strong>{priceBreakdown.nights} gecə</strong>
                </div>
              </div>

              <div className="summary-divider"></div>

              {/* Price Breakdown */}
              <div className="summary-price-details">
                <div className="summary-price-row">
                  <span>₼{room.pricePerNight} × {priceBreakdown.nights} gecə</span>
                  <span>₼{priceBreakdown.basePrice}</span>
                </div>

                {priceBreakdown.extraGuestFee > 0 && (
                  <div className="summary-price-row">
                    <span>Əlavə qonaq haqqı</span>
                    <span>₼{priceBreakdown.extraGuestFee}</span>
                  </div>
                )}

                <div className="summary-price-row">
                  <span>Ara cəm</span>
                  <span>₼{priceBreakdown.subtotal}</span>
                </div>

                <div className="summary-price-row">
                  <span>Vergi (18%)</span>
                  <span>₼{priceBreakdown.tax}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-price-row summary-total-row">
                  <span>Yekun məbləğ</span>
                  <strong>₼{priceBreakdown.total}</strong>
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="summary-card policy-card">
              <h4>Ləğvetmə Qaydaları</h4>
              <ul className="policy-list">
                <li><FaCheck /> Pulsuz ləğvetmə: 24 saat əvvələdək</li>
                <li><FaCheck /> Ani təsdiq</li>
                <li><FaCheck /> Ödəniş otelə gəldikdə</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Booking;
