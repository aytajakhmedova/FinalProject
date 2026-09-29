import React from 'react';
import { FaStar, FaUser } from 'react-icons/fa';
import './Reviews.css';

const Reviews = ({ hotelId, rating, reviewCount }) => {
  // Mock review data
  const reviews = [
    {
      id: 1,
      name: 'Aynur Məmmədova',
      rating: 5,
      date: '2024-01-15',
      comment: 'Əla otel! Xidmət çox yaxşı idi, otaqlar təmiz və rahat. Mütləq tövsiyə edirəm.'
    },
    {
      id: 2,
      name: 'Elvin Quliyev',
      rating: 4.5,
      date: '2024-01-10',
      comment: 'Yerləşmə əla, personal mehriban. Səhər yeməyi çox dadlı idi. Təkrar gəlməyi düşünürük.'
    },
    {
      id: 3,
      name: 'Leyla Həsənova',
      rating: 5,
      date: '2024-01-05',
      comment: 'Bal ayımızı burada keçirdik. Hər şey mükəmməl idi! Romantik və rahat atmosfer.'
    }
  ];

  return (
    <div className="reviews-section">
      <h2 className="section-title">Qonaq Rəyləri</h2>
      
      <div className="reviews-summary">
        <div className="reviews-score">
          <div className="score-number">{rating}</div>
          <div className="score-stars">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.floor(rating) ? 'star-filled' : 'star-empty'} />
            ))}
          </div>
          <div className="score-count">{reviewCount} rəy</div>
        </div>
      </div>

      <div className="reviews-list">
        {reviews.map(review => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <div className="reviewer-info">
                <div className="reviewer-avatar">
                  <FaUser />
                </div>
                <div>
                  <div className="reviewer-name">{review.name}</div>
                  <div className="review-date">{review.date}</div>
                </div>
              </div>
              <div className="review-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < review.rating ? 'star-filled' : 'star-empty'} />
                ))}
              </div>
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
