import { useState } from 'react';
import { FaGlobeAmericas, FaPlay, FaTimes } from 'react-icons/fa';
import { MdHeadset } from 'react-icons/md';
import SearchForm from '../SearchForm/SearchForm';
import otelImage from '../../assets/images/otelimages.jpg';
import otaq1 from '../../assets/images/otelotaq1.jpg';
import otaq2 from '../../assets/images/otaq2.jpg';
import './Hero.css';

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
            <p className="hero-kicker">Otel & Travel · OtelBurada</p>
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
              <img src={otelImage} alt="Otel" />
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

        <SearchForm
          onSearch={onSearch}
          serviceType={serviceType}
          onServiceChange={onServiceChange}
        />
      </div>

      {storyOpen && (
        <div className="story-overlay" onClick={() => setStoryOpen(false)}>
          <div className="story-modal" onClick={(e) => e.stopPropagation()}>
            <button className="story-close" onClick={() => setStoryOpen(false)} aria-label="Bağla">
              <FaTimes />
            </button>
            <div className="story-film">
              <img src={otelImage} alt="" />
              <img src={otaq1} alt="" />
              <img src={otaq2} alt="" />
            </div>
            <h3>OtelBurada hekayəsi</h3>
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
