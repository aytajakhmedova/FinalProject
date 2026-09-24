import React from 'react';
import { FaGlobeAmericas, FaPlay } from 'react-icons/fa';
import { MdHeadset } from 'react-icons/md';
import SearchForm from '../SearchForm/SearchForm';
import otelImage from '../../assets/images/otelimages.jpg';
import otaq1 from '../../assets/images/otelotaq1.jpg';
import otaq2 from '../../assets/images/otaq2.jpg';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Yakındaki en iyi <span className="underline">otelleri bulun</span>.
            </h1>
            <p className="hero-description">
              Size sadece bir konslamla seçeneği değil bütçenize uygun tüks bir deneyim sunuyoruz.
            </p>
            
            <div className="discover-buttons">
              <button className="discover-btn">
                <FaGlobeAmericas className="btn-icon" />
                <span className="btn-text">Şimdi Keşfedin</span>
              </button>
              <button className="discover-btn">
                <FaPlay className="btn-icon" />
                <span className="btn-text">Hikayemizi İzleyin</span>
              </button>
            </div>
          </div>

          <div className="hero-image">
            <div className="support-badge">
              <MdHeadset className="badge-icon" />
              <div className="badge-content">
                <div className="badge-time">7/24</div>
                <div className="badge-text">Müşteri Desteğimiz</div>
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

        <SearchForm />
      </div>
    </section>
  );
};

export default Hero;
