import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaHeart, FaPlay, FaRegHeart, FaStar } from 'react-icons/fa';
import { formatPrice } from '../../data/travelData';
import { getHotels } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';
import './FeaturedHotels.css';

const FeaturedHotels = ({ currency, favorites, onToggleFavorite, onDiscover, onPlayVideo }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [featured, setFeatured] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const hotel = featured[activeIndex];

  useEffect(() => {
    let active = true;
    getHotels()
      .then((items) => {
        if (!active) return;
        setFeatured(items.filter((item) => item.imageFile).slice(0, 5));
        setLoadError('');
      })
      .catch((error) => {
        if (!active) return;
        setFeatured([]);
        setLoadError(error.message || t('hotels.loadError'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (featured.length < 2) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === featured.length - 1 ? 0 : prev + 1));
    }, 6500);
    return () => clearInterval(timer);
  }, [featured.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? featured.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === featured.length - 1 ? 0 : prev + 1));
  };

  const mid = Math.floor(featured.length / 2);

  const handleHotelClick = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
  };

  const handleDiscoverClick = (e) => {
    e.stopPropagation();
    if (onDiscover) {
      onDiscover(hotel);
    } else {
      handleHotelClick(hotel.id);
    }
  };

  if (loading) {
    return (
      <section className="featured-hotels-section" id="featured">
        <div className="featured-hotels-container">
          <p className="eyebrow center">{t('feat.eyebrow')}</p>
          <h2 className="section-title">{t('common.loading')}</h2>
        </div>
      </section>
    );
  }

  if (loadError || featured.length === 0) {
    return (
      <section className="featured-hotels-section" id="featured">
        <div className="featured-hotels-container">
          <p className="eyebrow center">{t('feat.eyebrow')}</p>
          <h2 className="section-title">{loadError || t('hotels.empty')}</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-hotels-section" id="featured">
      <div className="featured-hotels-container">
        <p className="eyebrow center">{t('feat.eyebrow')}</p>
        <h2 className="section-title">{t('feat.title')}</h2>

        <div className="hotels-slider-wrapper">
          <button className="nav-btn nav-prev" onClick={handlePrev} aria-label={t('feat.prev')}>
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
                <img src={item.mainImage} alt={item.title} />
              </button>
            ))}
          </div>

          <div className="main-display">
            <div
              className="main-image"
              onClick={() => handleHotelClick(hotel.id)}
              style={{ cursor: 'pointer' }}
            >
              <img key={hotel.id} src={hotel.mainImage} alt={hotel.title} />
              {hotel.video && (
                <button
                  className="featured-play"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayVideo(hotel);
                  }}
                  aria-label={t('feat.video')}
                >
                  <FaPlay />
                  {t('feat.video')}
                </button>
              )}
              <div className="info-card" key={`info-${hotel.id}`}>
                <div className="info-top">
                  <span className="year-badge">{hotel.hotelType}</span>
                  <button
                    className={`inline-fav ${favorites.includes(hotel.id) ? 'on' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
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
                  <strong>{formatPrice(hotel.pricePerNight, currency)} {t('feat.perNight')}</strong>
                </div>
                <button
                  className="discover-btn"
                  onClick={handleDiscoverClick}
                >
                  {t('feat.discover')}
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
                  <img src={item.mainImage} alt={item.title} />
                </button>
              );
            })}
          </div>

          <button className="nav-btn nav-next" onClick={handleNext} aria-label={t('feat.next')}>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedHotels;
