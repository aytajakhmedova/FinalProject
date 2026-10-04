import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FaUsers, FaBed, FaExpand, FaCheck, FaArrowLeft, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { getHotelById, getRoomById } from '../../data/hotelsData';
import { checkRoomAvailability, calculateRoomPrice, calculateNights, formatDate, getMinCheckInDate, getMinCheckOutDate } from '../../data/roomsData';
import ImageGallery from '../../components/common/ImageGallery/ImageGallery';
import './RoomDetail.css';

const RoomDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hotelId = searchParams.get('hotel');
  
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [isAvailable, setIsAvailable] = useState(true);
  const [priceBreakdown, setPriceBreakdown] = useState(null);

  const hotel = getHotelById(hotelId);
  const room = hotel?.rooms.find(r => r.id === parseInt(id));

  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setCheckIn(newCheckIn);
    
    // If checkout exists and is before or equal to new checkin, reset it
    if (checkOut && checkOut <= newCheckIn) {
      setCheckOut('');
    }
  };

  useEffect(() => {
    if (checkIn && checkOut && room) {
      const available = checkRoomAvailability(room.id, checkIn, checkOut);
      setIsAvailable(available);
      
      if (available) {
        const breakdown = calculateRoomPrice(room.pricePerNight, checkIn, checkOut, guests);
        setPriceBreakdown(breakdown);
      } else {
        setPriceBreakdown(null);
      }
    }
  }, [checkIn, checkOut, guests, room]);

  if (!hotel || !room) {
    return (
      <div className="hotel-not-found">
        <h2>Otaq tapılmadı</h2>
        <Link to="/hotels" className="back-link">Otellərə qayıt</Link>
      </div>
    );
  }

  const nights = calculateNights(checkIn, checkOut);

  const handleReserveNow = () => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
      // Save booking data for after login
      const bookingData = {
        hotelId: hotel.id,
        roomId: room.id,
        checkIn,
        checkOut,
        guests,
        priceBreakdown
      };
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      navigate('/login', { state: { from: `/rooms/${room.id}?hotel=${hotel.id}` } });
    } else {
      // Navigate to booking page with data
      navigate('/booking', {
        state: {
          hotel,
          room,
          checkIn,
          checkOut,
          guests,
          priceBreakdown
        }
      });
    }
  };

  return (
    <div className="room-detail-page">
      <div className="room-detail-container">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> Geri
        </button>

        {/* Room Gallery */}
        <div className="room-gallery-section">
          <ImageGallery images={room.images} title={room.name} />
        </div>

        {/* Room Content */}
        <div className="room-detail-content">
          {/* Main Content */}
          <div className="room-main-content">
            {/* Header */}
            <div className="room-detail-header">
              <h1 className="room-title">{room.name}</h1>
              <p className="room-subtitle">{hotel.title}</p>
            </div>

            {/* Info Cards */}
            <div className="room-info-cards">
              <div className="room-info-card">
                <div className="room-info-icon">
                  <FaUsers />
                </div>
                <div className="room-info-text">
                  <span className="room-info-label">Tutum</span>
                  <span className="room-info-value">{room.capacity} nəfər</span>
                </div>
              </div>

              <div className="room-info-card">
                <div className="room-info-icon">
                  <FaBed />
                </div>
                <div className="room-info-text">
                  <span className="room-info-label">Yataq</span>
                  <span className="room-info-value">{room.bedType}</span>
                </div>
              </div>

              <div className="room-info-card">
                <div className="room-info-icon">
                  <FaExpand />
                </div>
                <div className="room-info-text">
                  <span className="room-info-label">Sahə</span>
                  <span className="room-info-value">{room.size}</span>
                </div>
              </div>
            </div>

            {/* Availability Search */}
            <section className="room-section">
              <h2 className="room-section-title">
                <FaCalendarAlt /> Mövcudluq Yoxla
              </h2>
              
              <div className="availability-search-box">
                <div className="search-input-group">
                  <label>Giriş tarixi</label>
                  <input 
                    type="date" 
                    value={checkIn}
                    min={getMinCheckInDate()}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="date-input"
                  />
                </div>

                <div className="search-input-group">
                  <label>Çıxış tarixi</label>
                  <input 
                    type="date" 
                    value={checkOut}
                    min={getMinCheckOutDate(checkIn)}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="date-input"
                    disabled={!checkIn}
                  />
                </div>

                <div className="search-input-group">
                  <label>Qonaq sayı</label>
                  <select 
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="guests-select"
                  >
                    {[...Array(room.capacity)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} nəfər
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {checkIn && checkOut && (
                <div className={`availability-result ${isAvailable ? 'available' : 'unavailable'}`}>
                  {isAvailable ? (
                    <>
                      <div className="availability-icon">✓</div>
                      <div className="availability-text">
                        <strong>Mövcuddur!</strong>
                        <p>{formatDate(checkIn)} - {formatDate(checkOut)} ({nights} gecə)</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="availability-icon">✕</div>
                      <div className="availability-text">
                        <strong>Mövcud deyil</strong>
                        <p>Bu tarixlər üçün otaq rezerv olunub. Zəhmət olmasa başqa tarix seçin.</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {priceBreakdown && priceBreakdown.nights > 0 && (
                <div className="price-breakdown-card">
                  <h3 className="breakdown-title">Qiymət Hesablanması</h3>
                  
                  <div className="breakdown-row">
                    <span>₼{room.pricePerNight} × {priceBreakdown.nights} gecə</span>
                    <span>₼{priceBreakdown.basePrice}</span>
                  </div>

                  {priceBreakdown.extraGuestFee > 0 && (
                    <div className="breakdown-row">
                      <span>Əlavə qonaq haqqı</span>
                      <span>₼{priceBreakdown.extraGuestFee}</span>
                    </div>
                  )}

                  <div className="breakdown-row">
                    <span>Ara cəm</span>
                    <span>₼{priceBreakdown.subtotal}</span>
                  </div>

                  <div className="breakdown-row">
                    <span>Vergi (18%)</span>
                    <span>₼{priceBreakdown.tax}</span>
                  </div>

                  <div className="breakdown-divider"></div>

                  <div className="breakdown-row breakdown-total">
                    <span>Yekun məbləğ</span>
                    <span>₼{priceBreakdown.total}</span>
                  </div>

                  <div className="breakdown-info">
                    <FaInfoCircle />
                    <span>2 nəfərdən çox qonaq üçün hər nəfər üçün gecəlik ₼50 əlavə ödəniş tətbiq olunur.</span>
                  </div>
                </div>
              )}
            </section>

            {/* Description */}
            <section className="room-section">
              <h2 className="room-section-title">Otaq Haqqında</h2>
              <p className="room-description-text">{room.description}</p>
            </section>

            {/* Amenities */}
            <section className="room-section">
              <h2 className="room-section-title">Otaq İmkanları</h2>
              <div className="room-amenities-grid">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="room-amenity-item">
                    <FaCheck className="room-amenity-icon" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Booking Sidebar */}
          <aside className="room-booking-sidebar" id="book">
            <div className="room-booking-card">
              {room.available ? (
                <div className="availability-notice">
                  ✓ Mövcuddur
                </div>
              ) : (
                <div className="availability-notice unavailable-notice">
                  ✕ Mövcud deyil
                </div>
              )}

              {priceBreakdown && priceBreakdown.nights > 0 ? (
                <>
                  <div className="booking-summary-box">
                    <h3>Rezervasiya Xülasəsi</h3>
                    
                    <div className="booking-detail-row">
                      <span>Giriş</span>
                      <strong>{formatDate(checkIn)}</strong>
                    </div>

                    <div className="booking-detail-row">
                      <span>Çıxış</span>
                      <strong>{formatDate(checkOut)}</strong>
                    </div>

                    <div className="booking-detail-row">
                      <span>Qonaqlar</span>
                      <strong>{guests} nəfər</strong>
                    </div>

                    <div className="booking-detail-row">
                      <span>Gecələr</span>
                      <strong>{priceBreakdown.nights} gecə</strong>
                    </div>

                    <div className="booking-divider"></div>

                    <div className="booking-detail-row booking-price-row">
                      <span>Yekun məbləğ</span>
                      <strong className="booking-total-price">₼{priceBreakdown.total}</strong>
                    </div>
                  </div>

                  <button 
                    onClick={handleReserveNow}
                    disabled={!isAvailable || !checkIn || !checkOut}
                    className="btn-reserve-now"
                  >
                    <FaCheck /> Rezervasiya et
                  </button>

                  <p className="booking-guarantee-text">
                    ✓ Pulsuz ləğvetmə • ✓ Ani təsdiq
                  </p>
                </>
              ) : (
                <div className="booking-instruction">
                  <FaCalendarAlt className="instruction-icon" />
                  <p>Rezervasiya etmək üçün yuxarıdan tarix və qonaq sayı seçin</p>
                </div>
              )}
            </div>

            {/* Link to Hotel */}
            <div className="hotel-link-card">
              <div className="hotel-link-title">Bu otaq yerləşir:</div>
              <div className="hotel-link-name">{hotel.title}</div>
              <Link to={`/hotels/${hotel.id}`} className="btn-view-hotel">
                Oteli göstər
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
