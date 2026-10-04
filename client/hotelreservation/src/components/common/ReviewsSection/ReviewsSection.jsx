import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaEdit } from 'react-icons/fa';
import RatingStars from '../RatingStars/RatingStars';
import ReviewCard from '../ReviewCard/ReviewCard';
import ReviewForm from '../ReviewForm/ReviewForm';
import './ReviewsSection.css';

const ReviewsSection = ({ reviews = [], averageRating = 0, totalReviews = 0 }) => {
  const navigate = useNavigate();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewsList, setReviewsList] = useState(reviews);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Calculate rating breakdown
  const getRatingBreakdown = () => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsList.forEach(review => {
      const rating = Math.floor(review.rating);
      breakdown[rating] = (breakdown[rating] || 0) + 1;
    });
    return breakdown;
  };

  const ratingBreakdown = getRatingBreakdown();
  const total = reviewsList.length || totalReviews;

  const getPercentage = (count) => {
    return total > 0 ? (count / total) * 100 : 0;
  };

  const handleSubmitReview = (newReview) => {
    // Double-check authentication before processing
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      alert('Rəy yazmaq üçün daxil olmalısınız');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    setReviewsList(prev => [newReview, ...prev]);
    setShowReviewForm(false);
    // Show success message (you can add toast notification here)
    alert('Rəyiniz uğurla əlavə edildi! Təşəkkür edirik.');
  };

  const handleWriteReviewClick = () => {
    // Always check authentication from localStorage directly
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      if (window.confirm('Rəy yazmaq üçün daxil olmalısınız. Login səhifəsinə keçmək istəyirsiniz?')) {
        navigate('/login', { state: { from: window.location.pathname } });
      }
      return;
    }
    setShowReviewForm(!showReviewForm);
  };

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h2 className="section-title">Rəylər</h2>
      </div>

      {/* Rating Overview */}
      <div className="rating-overview">
        <div className="rating-summary">
          <div className="rating-score">
            <span className="score-value">{averageRating.toFixed(1)}</span>
            <RatingStars rating={averageRating} size="large" showValue={false} />
            <span className="total-reviews">{total} rəy</span>
          </div>
        </div>

        <div className="rating-breakdown">
          {[5, 4, 3, 2, 1].map(star => (
            <div key={star} className="breakdown-row">
              <div className="star-label">
                <span>{star}</span>
                <FaStar className="star-icon" />
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${getPercentage(ratingBreakdown[star])}%` }}
                />
              </div>
              <span className="star-count">{ratingBreakdown[star]}</span>
            </div>
          ))}
        </div>

        <button 
          className="btn-write-review"
          onClick={handleWriteReviewClick}
        >
          <FaEdit />
          {isAuthenticated 
            ? (showReviewForm ? 'Rəyi bağla' : 'Rəy yaz')
            : '🔒 Rəy yaz (Giriş tələb olunur)'
          }
        </button>
      </div>

      {/* Review Form - Only show if authenticated */}
      {showReviewForm && isAuthenticated && (
        <ReviewForm 
          onSubmit={handleSubmitReview}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {reviewsList.length > 0 ? (
          reviewsList.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <div className="no-reviews">
            <FaStar className="no-reviews-icon" />
            <h3>Hələ rəy yoxdur</h3>
            <p>İlk rəyi siz yazın!</p>
            <button 
              className="btn-first-review"
              onClick={handleWriteReviewClick}
            >
              İlk rəyi yaz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
