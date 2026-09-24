import React, { useState, useEffect } from 'react';
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Testimonials.css';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Travel Blogger',
      image: '/avatar1.jpg',
      rating: 5,
      text: 'Incredible experience! The hotel was luxurious, the staff was amazing, and the location was perfect. I will definitely be booking again!'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Business Executive',
      image: '/avatar2.jpg',
      rating: 5,
      text: 'Professional service and top-notch amenities. The booking process was seamless, and the hotel exceeded all my expectations.'
    },
    {
      id: 3,
      name: 'Emma Williams',
      role: 'Vacation Enthusiast',
      image: '/avatar3.jpg',
      rating: 4,
      text: 'Beautiful properties and excellent customer service. Made our family vacation truly memorable. Highly recommend!'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <h2 className="testimonials-title">What Our Guests Say</h2>
        
        <div className="testimonials-slider">
          <button className="testimonial-nav nav-left" onClick={handlePrev}>
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
                  <img src={testimonial.image} alt={testimonial.name} className="author-image" />
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-role">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="testimonial-nav nav-right" onClick={handleNext}>
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
