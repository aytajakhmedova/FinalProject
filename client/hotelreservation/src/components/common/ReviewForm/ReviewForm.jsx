import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RatingStars from '../RatingStars/RatingStars';
import './ReviewForm.css';

const ReviewForm = ({ onSubmit, onCancel }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    pros: '',
    cons: '',
  });
  const [errors, setErrors] = useState({});

  // Check authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      alert('Rəy yazmaq üçün daxil olmalısınız');
      navigate('/login', { state: { from: window.location.pathname } });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRatingChange = (newRating) => {
    setFormData(prev => ({ ...prev, rating: newRating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (formData.rating === 0) {
      newErrors.rating = 'Qiymət tələb olunur';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Başlıq tələb olunur';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'Rəy tələb olunur';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Rəy ən azı 10 simvoldan ibarət olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Critical authentication check - must be first
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      alert('Rəy yazmaq üçün daxil olmalısınız');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (!validate()) return;

    // Get user data
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    // Mock submit
    const newReview = {
      id: Date.now(),
      userName: user?.name || 'İstifadəçi',
      rating: formData.rating,
      title: formData.title,
      comment: formData.comment,
      pros: formData.pros,
      cons: formData.cons,
      date: new Date().toISOString(),
      verified: true,
      helpful: 0,
    };

    onSubmit && onSubmit(newReview);

    // Reset form
    setFormData({
      rating: 0,
      title: '',
      comment: '',
      pros: '',
      cons: '',
    });
  };

  return (
    <div className="review-form-container">
      <h3 className="form-title">Rəyinizi yazın</h3>
      
      <form onSubmit={handleSubmit} className="review-form">
        {/* Rating */}
        <div className="form-group">
          <label className="form-label">
            Qiymət <span className="required">*</span>
          </label>
          <div className="rating-selector">
            <RatingStars 
              rating={formData.rating} 
              size="xlarge"
              interactive={true}
              onRatingChange={handleRatingChange}
            />
            {formData.rating > 0 && (
              <span className="rating-text">
                {formData.rating === 5 && 'Əla'}
                {formData.rating === 4 && 'Çox yaxşı'}
                {formData.rating === 3 && 'Yaxşı'}
                {formData.rating === 2 && 'Orta'}
                {formData.rating === 1 && 'Zəif'}
              </span>
            )}
          </div>
          {errors.rating && <span className="error-message">{errors.rating}</span>}
        </div>

        {/* Title */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Başlıq <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Rəyinizə başlıq verin"
            className={`form-input ${errors.title ? 'error' : ''}`}
            maxLength={100}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        {/* Comment */}
        <div className="form-group">
          <label htmlFor="comment" className="form-label">
            Rəy <span className="required">*</span>
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Qalma təcrübənizi bizə danışın..."
            className={`form-textarea ${errors.comment ? 'error' : ''}`}
            rows={5}
            maxLength={1000}
          />
          <div className="textarea-footer">
            {errors.comment && <span className="error-message">{errors.comment}</span>}
            <span className="char-count">
              {formData.comment.length}/1000
            </span>
          </div>
        </div>

        {/* Pros */}
        <div className="form-group">
          <label htmlFor="pros" className="form-label">
            Müsbət tərəflər
          </label>
          <textarea
            id="pros"
            name="pros"
            value={formData.pros}
            onChange={handleChange}
            placeholder="Nə bəyəndiniz?"
            className="form-textarea"
            rows={3}
            maxLength={500}
          />
          <span className="char-count-small">
            {formData.pros.length}/500
          </span>
        </div>

        {/* Cons */}
        <div className="form-group">
          <label htmlFor="cons" className="form-label">
            Mənfi tərəflər
          </label>
          <textarea
            id="cons"
            name="cons"
            value={formData.cons}
            onChange={handleChange}
            placeholder="Nəyi təkmilləşdirmək olar?"
            className="form-textarea"
            rows={3}
            maxLength={500}
          />
          <span className="char-count-small">
            {formData.cons.length}/500
          </span>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Rəyi göndər
          </button>
          {onCancel && (
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Ləğv et
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
