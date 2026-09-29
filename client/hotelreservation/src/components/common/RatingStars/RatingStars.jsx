import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import './RatingStars.css';

const RatingStars = ({ 
  rating = 0, 
  maxRating = 5, 
  size = 'medium',
  showValue = false,
  interactive = false,
  onRatingChange = null 
}) => {
  const getStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span 
          key={`full-${i}`} 
          className={`star full ${interactive ? 'interactive' : ''}`}
          onClick={() => interactive && onRatingChange && onRatingChange(i + 1)}
        >
          <FaStar />
        </span>
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <span 
          key="half" 
          className={`star half ${interactive ? 'interactive' : ''}`}
          onClick={() => interactive && onRatingChange && onRatingChange(fullStars + 1)}
        >
          <FaStarHalfAlt />
        </span>
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span 
          key={`empty-${i}`} 
          className={`star empty ${interactive ? 'interactive' : ''}`}
          onClick={() => interactive && onRatingChange && onRatingChange(fullStars + (hasHalfStar ? 1 : 0) + i + 1)}
        >
          <FaRegStar />
        </span>
      );
    }

    return stars;
  };

  return (
    <div className={`rating-stars ${size} ${interactive ? 'interactive-mode' : ''}`}>
      <div className="stars-container">
        {getStars()}
      </div>
      {showValue && (
        <span className="rating-value">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
