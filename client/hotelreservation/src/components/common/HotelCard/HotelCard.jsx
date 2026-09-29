import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaHeart } from 'react-icons/fa';
import RatingStars from '../RatingStars/RatingStars';
import './HotelCard.css';

const HotelCard = ({ hotel, currency = 'AZN' }) => {
  const formatPrice = (price) => {
    const symbols = { AZN: '₼', USD: '$', EUR: '€' };
    return `${symbols[currency] || '₼'}${price}`;
  };

  return (
    <div className="hotel-card">
      <div className="hotel-card-image">
        <img src={hotel.mainImage} alt={hotel.title} />
        <div className="hotel-card-overlay">
          <button className="hotel-favorite-btn">
            <FaHeart />
          </button>
          {hotel.hotelType && (
            <span className="hotel-card-badge">{hotel.hotelType}</span>
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
  );
};

export default HotelCard;
