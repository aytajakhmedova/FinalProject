import { useState } from 'react';
import { FaGlobeAmericas, FaPlay, FaTimes } from 'react-icons/fa';
import { MdHeadset } from 'react-icons/md';
import SearchForm from '../SearchForm/SearchForm';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { resolveImage } from '../../api/client';
import './Hero.css';

const slowVideo = (event) => {
  event.currentTarget.playbackRate = 0.7;
};

const Hero = ({ onSearch, serviceType, onServiceChange }) => {
  const [storyOpen, setStoryOpen] = useState(false);
  const { t } = useLanguage();
  const { content, loading, error } = useSiteContent();
  const settings = content?.settings;
  const video = resolveImage(settings?.heroVideoUrl);
  const float1 = resolveImage(settings?.heroFloatImage1Url);
  const float2 = resolveImage(settings?.heroFloatImage2Url);

  const goPrimary = () => {
    const target = settings?.heroPrimaryButtonUrl || '#featured';
    if (target.startsWith('#')) {
      document.getElementById(target.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.location.assign(target);
  };

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
            {loading && <p className="hero-kicker">Yüklənir...</p>}
            {error && !settings && <p className="hero-description">{error}</p>}
            {settings && (
              <>
                <p className="hero-kicker">{settings.heroKicker}</p>
                <h1 className="hero-title">
                  {settings.heroTitleBefore} <span className="underline">{settings.heroTitleAccent}</span> {settings.heroTitleAfter}
                </h1>
                <p className="hero-description">{settings.heroDescription}</p>
                <div className="discover-buttons">
                  <button className="discover-btn" onClick={goPrimary}>
                    <FaGlobeAmericas className="btn-icon" />
                    <span className="btn-text">{settings.heroPrimaryButtonText}</span>
                  </button>
                  <button className="discover-btn" onClick={() => setStoryOpen(true)}>
                    <FaPlay className="btn-icon" />
                    <span className="btn-text">{settings.heroSecondaryButtonText}</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="hero-image">
            {settings && (
              <div className="support-badge">
                <MdHeadset className="badge-icon" />
                <div className="badge-content">
                  <div className="badge-time">{settings.heroSupportBadge}</div>
                  <div className="badge-text">{settings.heroSupportLabel}</div>
                </div>
              </div>
            )}

            <div className="image-card">
              {video && (
                <video
                  className="hero-promo"
                  src={video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  onLoadedMetadata={slowVideo}
                  aria-label="AEhotel tanıtım videosu"
                />
              )}
              <div className="floating-images">
                {float1 && (
                  <div className="float-img float-1">
                    <img src={float1} alt="Otaq 1" />
                  </div>
                )}
                {float2 && (
                  <div className="float-img float-2">
                    <img src={float2} alt="Otaq 2" />
                  </div>
                )}
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

      {storyOpen && settings && (
        <div className="story-overlay" onClick={() => setStoryOpen(false)}>
          <div className="story-modal" onClick={(e) => e.stopPropagation()}>
            <button className="story-close" onClick={() => setStoryOpen(false)} aria-label={t('hero.close')}>
              <FaTimes />
            </button>
            <div className="story-film">
              {video && <video src={video} controls autoPlay muted loop playsInline onLoadedMetadata={slowVideo} />}
            </div>
            <h3>{settings.heroStoryTitle}</h3>
            <p>{settings.heroStoryText}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
