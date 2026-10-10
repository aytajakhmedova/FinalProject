import React, { useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaWifi, FaParking, FaSwimmingPool, FaDumbbell, FaUtensils, FaCocktail, FaCheck, FaArrowLeft, FaBed } from 'react-icons/fa';
import RatingStars from '../../components/common/RatingStars/RatingStars';
import RoomCard from '../../components/common/RoomCard/RoomCard';
import ImageGallery from '../../components/common/ImageGallery/ImageGallery';
import ReviewsSection from '../../components/common/ReviewsSection/ReviewsSection';
import { getHotelById } from '../../data/hotelsData';
import { checkRoomAvailability } from '../../data/roomsData';
import './HotelDetail.css';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hotel = getHotelById(id);
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = parseInt(searchParams.get('guests') || '0', 10);
  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';

  const handleScrollToRooms = () => {
    const roomsSection = document.getElementById('rooms');
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!hotel) {
    return (
      <div className="hotel-not-found">
        <h2>Otel tapılmadı</h2>
        <Link to="/hotels" className="back-link">Otellərə qayıt</Link>
      </div>
    );
  }

  const amenityIcons = {
    'Wi-Fi': <FaWifi />,
    'Parking': <FaParking />,
    'Hovuz': <FaSwimmingPool />,
    'Fitness': <FaDumbbell />,
    'Restoran': <FaUtensils />,
    'Bar': <FaCocktail />,
    'Spa': <FaStar />
  };

  return (
    <div className="hotel-detail-page">
      {/* Back Button */}
      <div className="hotel-detail-container">
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> Geri
        </button>
      </div>

      {/* Image Gallery */}
      <section className="hotel-gallery-section">
        <div className="hotel-detail-container">
          <ImageGallery images={hotel.images} title={hotel.title} />
        </div>
      </section>

      <div className="hotel-detail-container">
        <div className="hotel-detail-content">
          {/* Main Content */}
          <div className="hotel-main-info">
            {/* Hotel Header */}
            <div className="hotel-header">
              <div>
                <div className="hotel-stars-row">
                  {[...Array(hotel.stars)].map((_, i) => (
                    <FaStar key={i} className="star-gold" />
                  ))}
                </div>
                <h1 className="hotel-title">{hotel.title}</h1>
                <div className="hotel-location">
                  <FaMapMarkerAlt />
                  <span>{hotel.location}, {hotel.city}, {hotel.country}</span>
                </div>
              </div>
              <div className="hotel-rating-box">
                <RatingStars rating={hotel.rating} size="1.2rem" />
                <p className="review-count">{hotel.reviews} rəy</p>
              </div>
            </div>

            {/* Description */}
            <section className="hotel-section">
              <h2 className="section-title">Otel Haqqında</h2>
              <p className="hotel-description">{hotel.description}</p>
            </section>

            {/* Amenities */}
            <section className="hotel-section">
              <h2 className="section-title">İmkanlar və Xidmətlər</h2>
              <div className="amenities-grid">
                {hotel.amenities.map((amenity, idx) => (
                  <div key={idx} className="amenity-item">
                    <div className="amenity-icon">
                      {amenityIcons[amenity] || <FaCheck />}
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Hotel Info */}
            <section className="hotel-section">
              <h2 className="section-title">Otel Məlumatları</h2>
              <div className="hotel-info-grid">
                <div className="info-item">
                  <span className="info-label">Giriş saatı:</span>
                  <span className="info-value">{hotel.checkIn}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Çıxış saatı:</span>
                  <span className="info-value">{hotel.checkOut}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Ünvan:</span>
                  <span className="info-value">{hotel.address}</span>
                </div>
              </div>
            </section>

            {/* Available Rooms */}
            <section className="hotel-section" id="rooms">
              <h2 className="section-title">Mövcud Otaqlar</h2>
              <p className="section-subtitle">
                {checkIn && checkOut
                  ? `${checkIn} — ${checkOut} tarixləri üçün boş otaqlar`
                  : 'Rezervasiya etmək üçün otaq seçin'}
              </p>
              <div className="rooms-grid">
                {hotel.rooms
                  .filter((room) => {
                    if (room.available === false) return false;
                    if (guests && room.capacity < guests) return false;
                    if (checkIn && checkOut && !checkRoomAvailability(room.id, checkIn, checkOut)) return false;
                    return true;
                  })
                  .map(room => (
                  <RoomCard key={room.id} room={room} hotelId={hotel.id} queryString={queryString} />
                ))}
              </div>
              {hotel.rooms.filter((room) => {
                if (room.available === false) return false;
                if (guests && room.capacity < guests) return false;
                if (checkIn && checkOut && !checkRoomAvailability(room.id, checkIn, checkOut)) return false;
                return true;
              }).length === 0 && (
                <p className="section-subtitle">Bu tarix və qonaq sayı üçün boş otaq yoxdur.</p>
              )}
            </section>

            {/* Reviews */}
            <section className="hotel-section" id="reviews">
              <ReviewsSection hotelId={hotel.id} />
            </section>
          </div>

          {/* Sticky Info Card - NOT Booking */}
          <aside className="hotel-sidebar">
            <div className="hotel-info-sidebar-card">
              <div className="sidebar-price-section">
                <span className="sidebar-price-label">Otaq qiymətləri başlanğıc</span>
                <div className="sidebar-price-amount">₼{hotel.pricePerNight}</div>
                <span className="sidebar-price-unit">gecəlik</span>
              </div>

              <div className="sidebar-rating-box">
                <div className="sidebar-rating-score">
                  <FaStar className="star-icon" />
                  <span>{hotel.rating}</span>
                </div>
                <span className="sidebar-rating-text">{hotel.reviews} rəy</span>
              </div>

              <div className="sidebar-divider"></div>

              <div className="sidebar-action-section">
                <p className="sidebar-info-text">
                  Rezervasiya etmək üçün otaq seçin
                </p>
                <button onClick={handleScrollToRooms} className="btn-select-room">
                  <FaBed /> Otaq Seç
                </button>
              </div>

              <div className="sidebar-amenities-preview">
                <h4>Əsas imkanlar</h4>
                <ul>
                  {hotel.amenities.slice(0, 5).map((amenity, idx) => (
                    <li key={idx}>
                      <FaCheck /> {amenity}
                    </li>
                  ))}
                  {hotel.amenities.length > 5 && (
                    <li className="more-amenities">+{hotel.amenities.length - 5} daha çox</li>
                  )}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
