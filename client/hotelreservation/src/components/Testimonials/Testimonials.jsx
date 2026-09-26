import { useState, useEffect } from 'react';
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Testimonials.css';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Leyla Məmmədova',
      role: 'Səyahət blogeri',
      letter: 'L',
      rating: 5,
      text: 'Qəbələ dağ oteli və spa paketi gözləntilərimi aşdı. Bron prosesi 2 dəqiqə çəkdi.',
    },
    {
      id: 2,
      name: 'Rəşad Əliyev',
      role: 'Biznes səyahətçisi',
      letter: 'R',
      rating: 5,
      text: 'Bakı mərkəzindəki suit, gecə uçuşu və taksi hamısı bir rezervasiyada. Peşəkar xidmət.',
    },
    {
      id: 3,
      name: 'Nigar Həsənova',
      role: 'Ailəvi tətil',
      letter: 'N',
      rating: 4,
      text: 'Antalya all-inclusive və uşaq klubu sayəsində ailə tətilimiz problemsiz keçdi.',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="testimonials-section" id="reviews">
      <div className="testimonials-container">
        <p className="eyebrow center">Rəylər</p>
        <h2 className="testimonials-title">Qonaqlarımız nə deyir</h2>

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
                <FaQuoteLeft className="quote-icon" />
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="star" />
                  ))}
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
                <div className="testimonial-author">
                  <div className="author-image letter">{testimonial.letter}</div>
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-role">{testimonial.role}</p>
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
