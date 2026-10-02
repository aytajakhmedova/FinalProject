import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaHeart, FaPlay, FaRegHeart, FaStar } from 'react-icons/fa';
import { HOTELS, formatPrice } from '../../data/travelData';
import './FeaturedHotels.css';

const FeaturedHotels = ({ currency, favorites, onToggleFavorite, onDiscover, onPlayVideo }) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const featured = HOTELS.slice(0, 5);
  const hotel = featured[activeIndex];

  useEffect(() => {
    const t = setInterval(() => {
      setActiveIndex((prev) => (prev === featured.length - 1 ? 0 : prev + 1));
    }, 6500);
    return () => clearInterval(t);
  }, [featured.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? featured.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === featured.length - 1 ? 0 : prev + 1));
  };

  const mid = Math.floor(featured.length / 2);

  const handleHotelClick = (hotelId) => {
    // Navigate to hotel detail page
    navigate(`/hotels/${hotelId}`);
  };

  const handleDiscoverClick = (e) => {
    e.stopPropagation(); // Prevent card click
    if (onDiscover) {
      onDiscover(hotel);
    } else {
      handleHotelClick(hotel.id);
    }
  };

  return (
    <section className="featured-hotels-section" id="featured">
      <div className="featured-hotels-container">
        <p className="eyebrow center">Seçilmiş kolleksiya</p>
        <h2 className="section-title">Önə çıxan otellər</h2>

        <div className="hotels-slider-wrapper">
          <button className="nav-btn nav-prev" onClick={handlePrev} aria-label="Əvvəlki">
            <FaChevronLeft />
          </button>

          <div className="thumbnails-left">
            {featured.slice(0, mid).map((item, index) => (
              <button
                key={item.id}
                className={`thumbnail ${activeIndex === index ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <img src={item.image} alt={item.title} />
              </button>
            ))}
          </div>

          <div className="main-display">
            <div 
              className="main-image" 
              onClick={() => handleHotelClick(hotel.id)}
              style={{ cursor: 'pointer' }}
            >
              <img key={hotel.id} src={hotel.image} alt={hotel.title} />
              {hotel.video && (
                <button
                  className="featured-play"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    onPlayVideo(hotel);
                  }}
                  aria-label="Video turu izlə"
                >
                  <FaPlay />
                  Video tur
                </button>
              )}
              <div className="info-card" key={`info-${hotel.id}`}>
                <div className="info-top">
                  <span className="year-badge">{hotel.year}</span>
                  <button
                    className={`inline-fav ${favorites.includes(hotel.id) ? 'on' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      onToggleFavorite(hotel.id);
                    }}
                  >
                    {favorites.includes(hotel.id) ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
                <h3 className="hotel-title">{hotel.title}</h3>
                <p className="hotel-description">{hotel.description}</p>
                <div className="info-meta">
                  <span><FaStar /> {hotel.rating}</span>
                  <strong>{formatPrice(hotel.price, currency)} / gecə</strong>
                </div>
                <button 
                  className="discover-btn" 
                  onClick={handleDiscoverClick}
                >
                  KƏŞF EDİN
                </button>
              </div>
            </div>
          </div>

          <div className="thumbnails-right">
            {featured.slice(mid).map((item, index) => {
              const actualIndex = mid + index;
              return (
                <button
                  key={item.id}
                  className={`thumbnail ${activeIndex === actualIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(actualIndex)}
                  onMouseEnter={() => setActiveIndex(actualIndex)}
                >
                  <img src={item.image} alt={item.title} />
                </button>
              );
            })}
          </div>

          <button className="nav-btn nav-next" onClick={handleNext} aria-label="Növbəti">
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedHotels;
