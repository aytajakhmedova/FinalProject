import { useState } from 'react';
import { FaGlobeAmericas, FaPlay, FaTimes } from 'react-icons/fa';
import { MdHeadset } from 'react-icons/md';
import SearchForm from '../SearchForm/SearchForm';
import otaq1 from '../../assets/images/hotelimg6.jfif';
import otaq2 from '../../assets/images/hotelimg7.jfif';
import './Hero.css';

const PIN_VIDEO = 'https://v1.pinimg.com/videos/iht/720p/e8/4c/0d/e84c0d91c22600f14860d58f849e364d.mp4';
const PIN_POSTER = 'https://i.pinimg.com/videos/thumbnails/originals/e8/4c/0d/e84c0d91c22600f14860d58f849e364d.0000000.jpg';

const Hero = ({ onSearch, serviceType, onServiceChange }) => {
  const [storyOpen, setStoryOpen] = useState(false);

  return (
    <section className="hero-section" id="top">
      <div className="hero-orbs" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
      </div>
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-kicker">Otel & Travel · AE Hotel</p>
            <h1 className="hero-title">
              Yaxınlıqdakı ən yaxşı <span className="underline">otelləri</span> və turlari tapın.
            </h1>
            <p className="hero-description">
              Yalnız yer yox — büdcənizə uyğun lüks təcrübə, uçuş, tur və transferi bir yerdə bron edin.
            </p>

            <div className="discover-buttons">
              <button className="discover-btn" onClick={() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })}>
                <FaGlobeAmericas className="btn-icon" />
                <span className="btn-text">İndi kəşf et</span>
              </button>
              <button className="discover-btn" onClick={() => setStoryOpen(true)}>
                <FaPlay className="btn-icon" />
                <span className="btn-text">Hekayəmizi izlə</span>
              </button>
            </div>
          </div>

          <div className="hero-image">
            <div className="support-badge">
              <MdHeadset className="badge-icon" />
              <div className="badge-content">
                <div className="badge-time">7/24</div>
                <div className="badge-text">Müştəri dəstəyi</div>
              </div>
            </div>

            <div className="image-card">
              <video
                className="hero-promo"
                src={PIN_VIDEO}
                poster={PIN_POSTER}
                autoPlay
                muted
                loop
                playsInline
                aria-label="AEhotel tanıtım videosu"
              />
              <div className="floating-images">
                <div className="float-img float-1">
                  <img src={otaq1} alt="Otaq 1" />
                </div>
                <div className="float-img float-2">
                  <img src={otaq2} alt="Otaq 2" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-search">
          <SearchForm
            onSearch={onSearch}
            serviceType={serviceType}
            onServiceChange={onServiceChange}
          />
        </div>
      </div>

      {storyOpen && (
        <div className="story-overlay" onClick={() => setStoryOpen(false)}>
          <div className="story-modal" onClick={(e) => e.stopPropagation()}>
            <button className="story-close" onClick={() => setStoryOpen(false)} aria-label="Bağla">
              <FaTimes />
            </button>
            <div className="story-film">
              <video src={PIN_VIDEO} poster={PIN_POSTER} controls autoPlay muted loop playsInline />
            </div>
            <h3>AE Hotel hekayəsi</h3>
            <p>
              2018-dən bəri minlərlə səyahətçini lüks otellərlə, şəhər turları və wellness təcrübələri ilə
              birləşdiririk. Hər rezervasiya — şəxsi konsultasiya kimidir.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
