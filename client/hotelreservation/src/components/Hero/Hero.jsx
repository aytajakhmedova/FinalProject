import { useState } from 'react';
import { FaGlobeAmericas, FaPlay, FaTimes } from 'react-icons/fa';
import { MdHeadset } from 'react-icons/md';
import SearchForm from '../SearchForm/SearchForm';
import otaq1 from '../../assets/images/hotelimg6.jfif';
import otaq2 from '../../assets/images/hotelimg7.jfif';
import promoVideo from '../../assets/videos/aehotel-promo.mp4';
import { useLanguage } from '../../context/LanguageContext';
import './Hero.css';

const slowVideo = (event) => {
  event.currentTarget.playbackRate = 0.7;
};

const Hero = ({ onSearch, serviceType, onServiceChange }) => {
  const [storyOpen, setStoryOpen] = useState(false);
  const { t } = useLanguage();

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
            <p className="hero-kicker">{t('hero.kicker')}</p>
            <h1 className="hero-title">
              {t('hero.titleBefore')} <span className="underline">{t('hero.titleAccent')}</span> {t('hero.titleAfter')}
            </h1>
            <p className="hero-description">
              {t('hero.desc')}
            </p>

            <div className="discover-buttons">
              <button className="discover-btn" onClick={() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })}>
                <FaGlobeAmericas className="btn-icon" />
                <span className="btn-text">{t('hero.discover')}</span>
              </button>
              <button className="discover-btn" onClick={() => setStoryOpen(true)}>
                <FaPlay className="btn-icon" />
                <span className="btn-text">{t('hero.story')}</span>
              </button>
            </div>
          </div>

          <div className="hero-image">
            <div className="support-badge">
              <MdHeadset className="badge-icon" />
              <div className="badge-content">
                <div className="badge-time">7/24</div>
                <div className="badge-text">{t('hero.support')}</div>
              </div>
            </div>

            <div className="image-card">
              <video
                className="hero-promo"
                src={promoVideo}
                autoPlay
                muted
                loop
                playsInline
                onLoadedMetadata={slowVideo}
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
            <button className="story-close" onClick={() => setStoryOpen(false)} aria-label={t('hero.close')}>
              <FaTimes />
            </button>
            <div className="story-film">
              <video src={promoVideo} controls autoPlay muted loop playsInline onLoadedMetadata={slowVideo} />
            </div>
            <h3>{t('hero.storyTitle')}</h3>
            <p>{t('hero.storyText')}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
