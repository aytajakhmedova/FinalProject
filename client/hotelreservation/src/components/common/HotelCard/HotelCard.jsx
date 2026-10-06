import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaHeart } from 'react-icons/fa';
import RatingStars from '../RatingStars/RatingStars';
import './HotelCard.css';

const HotelCard = ({ hotel, currency = 'AZN' }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Yalnız ilk 3 şəkili göstər
  const displayImages = hotel.images ? hotel.images.slice(0, 3) : [hotel.mainImage];

  const formatPrice = (price) => {
    const symbols = { AZN: '₼', USD: '$', EUR: '€' };
    return `${symbols[currency] || '₼'}${price}`;
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <div className="hotel-card">
        <div 
          className="hotel-card-image" 
          onClick={handleImageClick}
          style={{ cursor: 'pointer' }}
        >
          <img src={hotel.mainImage} alt={hotel.title} />
          <div className="hotel-card-overlay">
            <button className="hotel-favorite-btn" onClick={(e) => e.stopPropagation()}>
              <FaHeart />
            </button>
            {hotel.hotelType && (
              <span className="hotel-card-badge">{hotel.hotelType}</span>
            )}
            {displayImages.length > 1 && (
              <div className="hotel-image-count">
                📷 {displayImages.length} şəkil
              </div>
            )}
          </div>
        </div>

        <div className="hotel-card-content">
          <div className="hotel-card-header">
            <h3 className="hotel-card-title">{hotel.title}</h3>
            <div className="hotel-card-stars">
              {[...Array(hotel.stars)].map((_, i) => (
                <FaStar key={i} className="star-icon" />
              ))}
            </div>
          </div>

          <div className="hotel-card-location">
            <FaMapMarkerAlt />
            <span>{hotel.city}, {hotel.country}</span>
          </div>

          <div className="hotel-card-rating">
            <RatingStars rating={hotel.rating} size="0.9rem" />
            <span className="review-count">({hotel.reviews} rəy)</span>
          </div>

          <div className="hotel-card-amenities">
            {hotel.amenities.slice(0, 4).map((amenity, idx) => (
              <span key={idx} className="amenity-tag">{amenity}</span>
            ))}
          </div>

          <div className="hotel-card-footer">
            <div className="hotel-card-price">
              <span className="price-label">Gecəlik</span>
              <span className="price-amount">{formatPrice(hotel.pricePerNight)}</span>
            </div>
            <div className="hotel-card-actions">
              <Link to={`/hotels/${hotel.id}`} className="btn-detail">
                Ətraflı bax
              </Link>
              <Link to={`/hotels/${hotel.id}#rezervasiya`} className="btn-book">
                Rezervasiya et
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showModal && (
        <div 
          className="hotel-gallery-modal" 
          onClick={() => setShowModal(false)}
        >
          <div className="hotel-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="hotel-modal-close" 
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            
            <div className="hotel-modal-main-image">
              <img src={displayImages[selectedImage]} alt={hotel.title} />
            </div>

            <div className="hotel-modal-thumbnails">
              {displayImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`hotel-modal-thumb ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img} alt={`${hotel.title} ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HotelCard;
