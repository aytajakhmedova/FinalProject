import React from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import RatingStars from '../RatingStars/RatingStars';
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Bu gün';
    if (diffDays === 1) return 'Dünən';
    if (diffDays < 7) return `${diffDays} gün əvvəl`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} həftə əvvəl`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay əvvəl`;
    return `${Math.floor(diffDays / 365)} il əvvəl`;
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">
            {review.userAvatar ? (
              <img src={review.userAvatar} alt={review.userName} />
            ) : (
              <span className="avatar-initials">
                {getInitials(review.userName)}
              </span>
            )}
          </div>
          <div className="reviewer-details">
            <h4 className="reviewer-name">{review.userName}</h4>
            <div className="review-meta">
              <span className="review-date">{formatDate(review.date)}</span>
              {review.verified && (
                <span className="verified-badge">Təsdiqlənmiş qonaq</span>
              )}
            </div>
          </div>
        </div>
        <div className="review-rating-section">
          <RatingStars rating={review.rating} size="medium" />
        </div>
      </div>

      {review.title && (
        <h3 className="review-title">{review.title}</h3>
      )}

      <p className="review-text">{review.comment}</p>

      {(review.stayDate || review.roomType) && (
        <div className="review-stay-info">
          {review.roomType ? `${review.roomType}` : ''}
          {review.roomType && review.stayDate ? ' · ' : ''}
          {review.stayDate ? `Qalma: ${new Date(review.stayDate).toLocaleDateString('az-AZ', {
            year: 'numeric',
            month: 'long'
          })}` : ''}
        </div>
      )}

      {(review.pros || review.cons) && (
        <div className="review-pros-cons">
          {review.pros && (
            <div className="pros-section">
              <div className="section-icon positive">
                <FaThumbsUp />
              </div>
              <div className="section-content">
                <span className="section-label">Müsbət tərəflər</span>
                <p>{review.pros}</p>
              </div>
            </div>
          )}
          {review.cons && (
            <div className="cons-section">
              <div className="section-icon negative">
                <FaThumbsDown />
              </div>
              <div className="section-content">
                <span className="section-label">Mənfi tərəflər</span>
                <p>{review.cons}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {review.roomType && (
        <div className="review-room-type">
          Otaq növü: <span>{review.roomType}</span>
        </div>
      )}

      {review.helpful > 0 && (
        <div className="review-helpful">
          <button className="helpful-btn">
            <FaThumbsUp />
            Faydalı ({review.helpful})
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
