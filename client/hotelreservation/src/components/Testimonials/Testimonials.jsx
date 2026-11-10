import { useState, useEffect } from 'react';
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getFeaturedReviews, getHotels } from '../../api/client';
import './Testimonials.css';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const [testimonials, setTestimonials] = useState([]);

  // Guest reviews come from the server: the best approved ones across all hotels.
  useEffect(() => {
    let active = true;
    // the photo of the hotel the guest stayed in goes beside the review
    Promise.all([getFeaturedReviews(6), getHotels().catch(() => [])])
      .then(([items, hotels]) => {
        if (!active) return;
        const images = new Map(hotels.map((hotel) => [hotel.id, hotel.image]));
        setTestimonials(items.map((review) => ({
          image: images.get(review.hotelId) || '',
          id: review.id,
          name: review.guestName,
          role: review.hotelName,
          letter: (review.guestName || '?').trim().charAt(0).toUpperCase(),
          rating: review.rating,
          text: review.comment,
        })));
      })
      .catch(() => active && setTestimonials([]));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (testimonials.length < 2) return undefined;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <section className="testimonials-section" id="reviews">
      <div className="testimonials-container">
        <p className="testimonials-pill">Rəylər</p>
        <h2 className="testimonials-title">Qonaqlarımız <em>nə deyir?</em></h2>
        <p className="testimonials-sub">AE Hotel-də qalan qonaqlarımızın real təəssüratları ilə tanış olun.</p>

        <div className="testimonials-slider">
          <button className="testimonial-nav nav-left" onClick={() => setActiveIndex((p) => (p === 0 ? testimonials.length - 1 : p - 1))}>
            <FaChevronLeft />
          </button>

          <div className="testimonial-wrapper">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`testimonial-card ${index === activeIndex ? 'active' : ''}`}
              >
                {testimonial.image && (
                  <div className="testimonial-photo">
                    <img src={testimonial.image} alt={testimonial.role} loading="lazy" />
                  </div>
                )}
                <div className="testimonial-body">
                <FaQuoteLeft className="quote-icon" />
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="star" />
                  ))}
                </div>
                <p className="testimonial-text">“{testimonial.text}”</p>
                <div className="testimonial-author">
                  <div className="author-image letter">{testimonial.letter}</div>
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-role">{testimonial.role}</p>
                  </div>
                </div>
                </div>
              </div>
            ))}
          </div>

          <button className="testimonial-nav nav-right" onClick={() => setActiveIndex((p) => (p + 1) % testimonials.length)}>
            <FaChevronRight />
          </button>
        </div>

        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
