import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import './RatingStars.css';

const RatingStars = ({ rating, showNumber = true, size = '1rem' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="rating-stars" style={{ fontSize: size }}>
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="star-filled" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="star-filled" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="star-empty" />
      ))}
      {showNumber && <span className="rating-number">{rating.toFixed(1)}</span>}
    </div>
  );
};

export default RatingStars;
