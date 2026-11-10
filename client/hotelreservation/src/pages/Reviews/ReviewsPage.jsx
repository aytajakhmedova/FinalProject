import { useEffect, useState } from 'react';
import { FaRegStar, FaUsers, FaRegThumbsUp, FaHeadset } from 'react-icons/fa';
import Testimonials from '../../components/Testimonials/Testimonials';
import { getFeaturedReviews, getReviewSummary } from '../../api/client';
import '../contentPages.css';

const stars = (rating) => '★'.repeat(rating) + '☆'.repeat(Math.max(0, 5 - rating));

const ReviewsPage = () => {
  const [summary, setSummary] = useState(null);
  const [moreReviews, setMoreReviews] = useState([]);

  useEffect(() => {
    let active = true;
    getReviewSummary().then((data) => active && setSummary(data)).catch(() => active && setSummary(null));
    // The slider above shows the 6 best reviews; the grid continues with the next ones.
    getFeaturedReviews(12)
      .then((items) => active && setMoreReviews(items.slice(6)))
      .catch(() => active && setMoreReviews([]));
    return () => { active = false; };
  }, []);

  return (
    <>
      <Testimonials />
      <section className="fill-wrap">
        <div className="reviews-stats">
          {summary && summary.count > 0 && (
            <>
              <article><FaRegStar /><div><strong>{summary.averageRating.toFixed(1)}</strong><span>orta qiymət</span></div></article>
              <article><FaUsers /><div><strong>{summary.count}</strong><span>qonaq rəyi</span></div></article>
              <article><FaRegThumbsUp /><div><strong>{summary.positivePercent}%</strong><span>müsbət rəy</span></div></article>
            </>
          )}
          <article><FaHeadset /><div><strong>7/24</strong><span>dəstəyə yazmaq</span></div></article>
        </div>
        {moreReviews.length > 0 && (
          <>
            <p className="fill-kicker">Daha çox rəy</p>
            <h2 className="fill-title">Qonaqlar nəyi xatırlayır</h2>
            <div className="review-grid">
              {moreReviews.map((item) => (
                <article className="review-card" key={item.id}>
                  <p className="stars">{stars(item.rating)}</p>
                  <h3>{item.guestName}</h3>
                  <p>{item.hotelName}</p>
                  <p className="review-text">{item.comment}</p>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default ReviewsPage;
