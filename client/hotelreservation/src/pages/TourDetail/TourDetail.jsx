import React, { useState } from 'react';
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
import { getTourById } from '../../data/toursData';
import './TourDetail.css';

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const tour = getTourById(id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [guestCount, setGuestCount] = useState(2);

  if (!tour) {
    return (
      <div className="tour-not-found">
        <h2>Tur tapılmadı</h2>
        <Link to="/tours" className="back-link">Turlara qayıt</Link>
      </div>
    );
  }

  const totalPrice = tour.price * guestCount;

  const handleBooking = () => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
      // Redirect to login
      navigate('/login', { state: { from: `/tours/${id}` } });
    } else {
      // TODO: Navigate to booking page
      alert('Rezervasiya funksiyası backend hazır olduqda əlavə ediləcək');
    }
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
          <div className="tour-gallery">
            <div className="main-tour-image">
              <img src={tour.images[selectedImage]} alt={tour.name} />
            </div>
            <div className="tour-thumbnails">
              {tour.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`tour-thumbnail ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img} alt={`${tour.name} ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>
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
                <span className={`difficulty-badge difficulty-${tour.difficulty.toLowerCase()}`}>
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
                  <span className="info-value">{tour.minGuests}-{tour.maxGuests} nəfər</span>
                </div>
              </div>
            </div>

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

              <form className="booking-form" onSubmit={(e) => { e.preventDefault(); handleBooking(); }}>
                {/* Date Selection */}
                <div className="form-group">
                  <label className="form-label">
                    <FaCalendarAlt />
                    Tarix seçin
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="">Tarix seçin</option>
                    {tour.availableDates.map(date => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('az-AZ', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Guest Count */}
                <div className="form-group">
                  <label className="form-label">
                    <FaUsers />
                    İştirakçılar
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="form-select"
                  >
                    {Array.from(
                      { length: tour.maxGuests - tour.minGuests + 1 },
                      (_, i) => tour.minGuests + i
                    ).map(num => (
                      <option key={num} value={num}>{num} nəfər</option>
                    ))}
                  </select>
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

                <button type="submit" className="btn-book-tour">
                  Rezervasiya et
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
