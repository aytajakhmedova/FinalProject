import React, { useState, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './PromoSlider.css';

const PromoSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  const promos = [
    {
      id: 1,
      title: 'Up to 60% OFF',
      subtitle: 'On Hotel Bookings Online',
      tag: 'BOOK NOW',
      bgColor: 'linear-gradient(135deg, #a8d5ff 0%, #e3f2fd 100%)',
    },
    {
      id: 2,
      title: 'Book & Enjoy',
      subtitle: '20% Off on the best available room rate',
      tag: '20% OFF',
      bgColor: 'linear-gradient(135deg, #b3e5fc 0%, #81d4fa 100%)',
    },
    {
      id: 3,
      title: 'Hot Summer Nights',
      subtitle: 'Up to 3 nights free',
      tag: 'SUMMER BOOKING',
      bgColor: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
    },
    {
      id: 4,
      title: 'Daily 50 Lucky Winners get a Free Stay',
      subtitle: 'Valid till 15 Nov',
      tag: 'DAILY JACKPORT',
      bgColor: 'linear-gradient(135deg, #e3f5ff 0%, #b3e5fc 100%)',
    }
  ];

  // Avtomatik scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % promos.length;
        const container = sliderRef.current;
        if (container) {
          container.scrollLeft = nextIndex * 350;
        }
        return nextIndex;
      });
    }, 3000); // Hər 3 saniyədə bir

    return () => clearInterval(interval);
  }, [promos.length]);

  const scroll = (direction) => {
    const container = sliderRef.current;
    const scrollAmount = 350;
    
    if (direction === 'left') {
      const newIndex = Math.max(0, currentIndex - 1);
      container.scrollLeft = newIndex * scrollAmount;
      setCurrentIndex(newIndex);
    } else {
      const newIndex = Math.min(promos.length - 1, currentIndex + 1);
      container.scrollLeft = newIndex * scrollAmount;
      setCurrentIndex(newIndex);
    }
  };

  return (
    <section className="promo-slider-section">
      <div className="promo-slider-container">
        <button 
          className="slider-btn slider-btn-left" 
          onClick={() => scroll('left')}
          disabled={currentIndex === 0}
        >
          <FaChevronLeft />
        </button>

        <div className="promo-slider" ref={sliderRef}>
          {promos.map((promo) => (
            <div 
              key={promo.id} 
              className="promo-card"
              style={{ background: promo.bgColor }}
            >
              <div className="promo-content">
                <span className="promo-tag">{promo.tag}</span>
                <h3 className="promo-title">{promo.title}</h3>
                <p className="promo-subtitle">{promo.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="slider-btn slider-btn-right" 
          onClick={() => scroll('right')}
          disabled={currentIndex === promos.length - 1}
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default PromoSlider;
