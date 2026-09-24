import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import img1 from '../../assets/images/img1.jpg';
import img2 from '../../assets/images/img2.jpg';
import img3 from '../../assets/images/img3.jpg';
import img4 from '../../assets/images/img4.jpg';
import img5 from '../../assets/images/img5.png';
import './FeaturedHotels.css';

const FeaturedHotels = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const hotels = [
    {
      id: 1,
      title: 'Çəndu',
      year: '2028-ci ilin açılışı',
      description: 'Çorinthia Chengdu, geniş Gui Xi Şəhər Parkının yanında ucalacaq və qlobal səyahətçilər fərqli Çorinthia ruhu vəsitəsilə şəhərin canlı mədəniyyəti ilə əlaqələndirilcək.',
      image: img1,
      thumbnail: img1
    },
    {
      id: 2,
      title: 'Corinthia Oasis, Malta',
      year: '2028-ci ilin açılışı',
      description: 'Aralıq dənizinin yeni sağlamlıq məkanında yerləşən Corinthia Oasis, hisslərə hərtərəfli etmək və canlandırmaq üçün hazırlanmış ekskluzi təcrübələrlə sağlamlıq və rifaha həsr olunmuş müasirən bir istirahət yeri təklif edəcək.',
      image: img2,
      thumbnail: img2
    },
    {
      id: 3,
      title: 'Maldiv adaları',
      year: '2028-ci ilin açılışı',
      description: 'Manta Şüasının incə əyrilərindən ilhamlanan Korintiyanın Hind okeanındaki debutü, möhtəşəm təbii mühitdə iki fərqli ada təcrübəsi təqdim edən xurma ağacları ilə əhatə olunmuş bir cənnət kimi davam edəcək.',
      image: img3,
      thumbnail: img3
    },
    {
      id: 4,
      title: 'Grand Luxury Resort',
      year: '2028-ci ilin açılışı',
      description: 'Exceptional waterfront property with world-class amenities and breathtaking views. Experience luxury redefined with our exclusive services.',
      image: img4,
      thumbnail: img4
    },
    {
      id: 5,
      title: 'Paradise Beach Hotel',
      year: '2029-cu ilin açılışı',
      description: 'Tropical paradise offering unmatched comfort and stunning ocean views. Perfect destination for relaxation and adventure seekers.',
      image: img5,
      thumbnail: img5
    }
  ];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? hotels.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === hotels.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="featured-hotels-section">
      <div className="featured-hotels-container">
        <h2 className="section-title">Featured Hotels</h2>
        
        <div className="hotels-slider-wrapper">
          <button className="nav-btn nav-prev" onClick={handlePrev}>
            <FaChevronLeft />
          </button>

          <div className="thumbnails-left">
            {hotels.slice(0, Math.floor(hotels.length / 2)).map((hotel, index) => (
              <div
                key={hotel.id}
                className={`thumbnail ${activeIndex === index ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(index)}
                onMouseEnter={() => handleThumbnailClick(index)}
              >
                <img src={hotel.thumbnail} alt={hotel.title} />
              </div>
            ))}
          </div>

          <div className="main-display">
            <div className="main-image">
              <img src={hotels[activeIndex].image} alt={hotels[activeIndex].title} />
              <div className="info-card">
                <span className="year-badge">{hotels[activeIndex].year}</span>
                <h3 className="hotel-title">{hotels[activeIndex].title}</h3>
                <p className="hotel-description">{hotels[activeIndex].description}</p>
                <button className="discover-btn">KƏŞF EDİN</button>
              </div>
            </div>
          </div>

          <div className="thumbnails-right">
            {hotels.slice(Math.floor(hotels.length / 2)).map((hotel, index) => {
              const actualIndex = Math.floor(hotels.length / 2) + index;
              return (
                <div
                  key={hotel.id}
                  className={`thumbnail ${activeIndex === actualIndex ? 'active' : ''}`}
                  onClick={() => handleThumbnailClick(actualIndex)}
                  onMouseEnter={() => handleThumbnailClick(actualIndex)}
                >
                  <img src={hotel.thumbnail} alt={hotel.title} />
                </div>
              );
            })}
          </div>

          <button className="nav-btn nav-next" onClick={handleNext}>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedHotels;
