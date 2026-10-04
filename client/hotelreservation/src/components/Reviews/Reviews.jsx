import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaThumbsUp, FaUserCircle } from 'react-icons/fa';
import './Reviews.css';

const Reviews = ({ hotelId, hotelName }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      userName: 'Aysel Məmmədova',
      userAvatar: null,
      rating: 5,
      date: '15 Yanvar 2026',
      comment: 'Çox gözəl otel! Xidmət əla idi, otaqlar təmiz və rahat. Mütləq təkrar gələcəyik.',
      helpful: 12,
      verified: true
    },
    {
      id: 2,
      userName: 'Rəşad Əliyev',
      userAvatar: null,
      rating: 4,
      date: '10 Yanvar 2026',
      comment: 'Ümumiyyətlə razı qaldıq. Yeməklər dadlı idi, ancaq Wi-Fi bir az zəif idi.',
      helpful: 8,
      verified: true
    },
    {
      id: 3,
      userName: 'Leyla Həsənova',
      userAvatar: null,
      rating: 5,
      date: '5 Yanvar 2026',
      comment: 'Fantastik təcrübə! Personal çox mehriban və köməkçi idi. Mənzərə heyrətamiz idi.',
      helpful: 15,
      verified: true
    }
  ]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    
    if (authStatus === 'true' && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0 
      ? ((reviews.filter(r => r.rating === star).length / reviews.length) * 100).toFixed(0)
      : 0
  }));

  const handleSubmitReview = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Critical: check authentication first
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      alert('Rəy yazmaq üçün daxil olmalısınız');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    if (!newReview.comment.trim()) {
      alert('Rəy yazmalısınız');
      return;
    }
    
    const review = {
      id: reviews.length + 1,
      userName: user?.name || 'İstifadəçi',
      userAvatar: null,
      rating: newReview.rating,
      date: new Date().toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' }),
      comment: newReview.comment,
      helpful: 0,
      verified: true
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
    setShowReviewForm(false);
    alert('Rəyiniz uğurla əlavə edildi!');
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

  const handleHelpful = (reviewId) => {
    setReviews(reviews.map(r => 
      r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
    ));
  };

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h2 className="reviews-title">Rəylər və Qiymətləndirmələr</h2>
        <button 
          className="btn-write-review"
          onClick={handleWriteReviewClick}
        >
          {isAuthenticated ? 'Rəy Yaz' : '🔒 Rəy Yaz (Giriş tələb olunur)'}
        </button>
      </div>

      {/* Rating Overview */}
      <div className="rating-overview">
        <div className="rating-summary">
          <div className="average-rating">
            <span className="rating-number">{averageRating}</span>
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  className={i < Math.round(averageRating) ? 'star-filled' : 'star-empty'}
                />
              ))}
            </div>
            <p className="rating-count">{reviews.length} rəy</p>
          </div>
        </div>

        <div className="rating-breakdown">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="rating-bar-row">
              <span className="rating-label">{star} ulduz</span>
              <div className="rating-bar">
                <div 
                  className="rating-bar-fill" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="rating-percentage">{percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form - Only show if authenticated */}
      {showReviewForm && isAuthenticated && (
        <form className="review-form" onSubmit={handleSubmitReview}>
          <h3>Rəy Yazın</h3>
          
          <div className="form-group">
            <label>Qiymətləndirmə</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map(star => (
                <FaStar
                  key={star}
                  className={star <= newReview.rating ? 'star-filled' : 'star-empty'}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Rəyiniz</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Təcrübənizi bizə danışın..."
              rows={5}
              required
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit-review">
              Göndər
            </button>
            <button 
              type="button" 
              className="btn-cancel-review"
              onClick={() => setShowReviewForm(false)}
            >
              Ləğv et
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.userAvatar ? (
                      <img src={review.userAvatar} alt={review.userName} />
                    ) : (
                      <FaUserCircle />
                    )}
                  </div>
                  <div className="reviewer-details">
                    <div className="reviewer-name-row">
                      <span className="reviewer-name">{review.userName}</span>
                      {review.verified && (
                        <span className="verified-badge">✓ Təsdiqlənib</span>
                      )}
                    </div>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < review.rating ? 'star-filled' : 'star-empty'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="review-date">{review.date}</span>
              </div>

              <p className="review-comment">{review.comment}</p>

              <div className="review-footer">
                <button 
                  className="btn-helpful"
                  onClick={() => handleHelpful(review.id)}
                >
                  <FaThumbsUp />
                  Faydalı ({review.helpful})
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-reviews">
            <p>Hələ rəy yazılmayıb. İlk rəyi siz yazın!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
