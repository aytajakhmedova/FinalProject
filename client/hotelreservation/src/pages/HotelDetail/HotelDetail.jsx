import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaWifi, FaParking, FaSwimmingPool, FaDumbbell, FaUtensils, FaCocktail, FaCheck, FaArrowLeft } from 'react-icons/fa';
import RatingStars from '../../components/common/RatingStars/RatingStars';
import RoomCard from '../../components/common/RoomCard/RoomCard';
import BookingCard from '../../components/common/BookingCard/BookingCard';
import ImageGallery from '../../components/common/ImageGallery/ImageGallery';
import ReviewsSection from '../../components/common/ReviewsSection/ReviewsSection';
import { getHotelById } from '../../data/hotelsData';
import { getHotelReviews, getAverageRating, getTotalReviews } from '../../data/reviewsData';
import './HotelDetail.css';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hotel = getHotelById(id);
  const [selectedImage, setSelectedImage] = useState(0);

  // Get reviews data
  const reviews = getHotelReviews(id);
  const averageRating = getAverageRating(id);
  const totalReviews = getTotalReviews(id);

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
          <div className="gallery-grid">
            <div className="main-gallery-image">
              <img src={hotel.images[selectedImage]} alt={hotel.title} />
            </div>
            <div className="gallery-thumbnails">
              {hotel.images.slice(0, 4).map((img, idx) => (
                <div 
                  key={idx} 
                  className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img} alt={`${hotel.title} ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>
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
            <section className="hotel-section" id="rezervasiya">
              <h2 className="section-title">Mövcud Otaqlar</h2>
              <div className="rooms-grid">
                {hotel.rooms.map(room => (
                  <RoomCard key={room.id} room={room} hotelId={hotel.id} />
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section className="hotel-section">
              <ReviewsSection 
                reviews={reviews}
                averageRating={averageRating || hotel.rating}
                totalReviews={totalReviews || hotel.reviews}
              />
            </section>
          </div>

          {/* Sticky Booking Card */}
          <aside className="hotel-sidebar">
            <BookingCard hotel={hotel} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
