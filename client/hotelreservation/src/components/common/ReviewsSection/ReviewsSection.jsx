import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaEdit } from 'react-icons/fa';
import RatingStars from '../RatingStars/RatingStars';
import ReviewCard from '../ReviewCard/ReviewCard';
import ReviewForm from '../ReviewForm/ReviewForm';
import { addStayReview, getReviewsForHotel } from '../../../utils/reviewsStore';
import { createReview, getHotelReviews, getMyBookings } from '../../../api/client';
import { getAuthToken } from '../../../api/auth';
import './ReviewsSection.css';

const normalizeReview = (item) => ({
  ...item,
  userName: item.userName || item.guestName || 'Qonaq',
  date: item.date || item.createdAt,
  verified: item.verified !== false,
});

const ReviewsSection = ({ hotelId }) => {
  const navigate = useNavigate();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewsList, setReviewsList] = useState(() => getReviewsForHotel(hotelId));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stays, setStays] = useState([]);

  const refresh = async () => {
    const loggedIn = Boolean(getAuthToken());
    setIsAuthenticated(loggedIn);
    let apiReviews = [];
    try {
      apiReviews = await getHotelReviews(hotelId);
    } catch {
      apiReviews = [];
    }
    const local = getReviewsForHotel(hotelId);
    const merged = [...(Array.isArray(apiReviews) ? apiReviews : []).map(normalizeReview), ...local.map(normalizeReview)]
      .filter((item, index, list) => list.findIndex((row) => String(row.id) === String(item.id) && String(row.bookingId || '') === String(item.bookingId || '')) === index);
    setReviewsList(merged);
    if (!loggedIn) {
      setStays([]);
      return;
    }
    try {
      const mine = await getMyBookings();
      const reviewed = new Set(merged.map((item) => String(item.bookingId || '')).filter(Boolean));
      setStays((Array.isArray(mine) ? mine : []).filter((booking) =>
        String(booking.hotelId) === String(hotelId) &&
        booking.status === 'checked-out' &&
        !reviewed.has(String(booking.id))
      ));
    } catch {
      setStays([]);
    }
  };

  useEffect(() => {
    refresh();
  }, [hotelId]);

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
  const total = reviewsList.length;
  const averageRating = total
    ? reviewsList.reduce((sum, review) => sum + Number(review.rating || 0), 0) / total
    : 0;
  const canReview = stays.length > 0;

  const getPercentage = (count) => {
    return total > 0 ? (count / total) * 100 : 0;
  };

  const handleSubmitReview = async (newReview) => {
    if (!getAuthToken()) {
      alert('Rəy yazmaq üçün daxil olmalısınız');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    try {
      await createReview({
        hotelId,
        bookingId: newReview.bookingId,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
      });
    } catch (error) {
      try {
        addStayReview({ ...newReview, hotelId });
      } catch (localError) {
        alert(error.message || localError.message);
        return;
      }
    }
    setShowReviewForm(false);
    refresh();
    alert('Rəyiniz yadda saxlandı. Təşəkkür edirik.');
  };

  const handleWriteReviewClick = () => {
    if (!getAuthToken()) {
      if (window.confirm('Rəy yazmaq üçün daxil olmalısınız. Login səhifəsinə keçmək istəyirsiniz?')) {
        navigate('/login', { state: { from: window.location.pathname } });
      }
      return;
    }
    if (!stays.length) {
      alert('Rəy yalnız sizin çıxış edilmiş qalmanız üçün yazıla bilər. Hər qalma üçün bir rəy ola bilər.');
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
            <span className="score-value">{averageRating ? averageRating.toFixed(1) : '0.0'}</span>
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
          {!isAuthenticated
            ? 'Rəy yaz (Giriş tələb olunur)'
            : !canReview
              ? 'Rəy yalnız tamamlanmış qalma üçün'
              : (showReviewForm ? 'Rəyi bağla' : 'Rəy yaz')
          }
        </button>
      </div>

      {/* Review Form - Only show if authenticated */}
      {showReviewForm && isAuthenticated && canReview && (
        <ReviewForm 
          stays={stays}
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
