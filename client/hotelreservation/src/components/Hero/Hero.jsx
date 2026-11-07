import { useState } from 'react';
import { FaGlobeAmericas, FaPlay, FaTimes } from 'react-icons/fa';
import SearchForm from '../SearchForm/SearchForm';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { resolveImage } from '../../api/client';
import heroBackground from '../../assets/images/hero-luxury-resort.png';
import './Hero.css';

const slowVideo = (event) => {
  event.currentTarget.playbackRate = 0.7;
};

const Hero = ({ onSearch, serviceType, onServiceChange }) => {
  const [storyOpen, setStoryOpen] = useState(false);
  const { lang, t } = useLanguage();
  const { content, error } = useSiteContent();
  const settings = content?.settings;
  const video = resolveImage(settings?.heroVideoUrl);

  const goPrimary = () => {
    const target = settings?.heroPrimaryButtonUrl || '#featured';
    if (target.startsWith('#')) {
      document.getElementById(target.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.location.assign(target);
  };

  return (
    <section className="hero-section cinematic-hero" id="top" aria-labelledby="cinematic-hero-title">
      <div className="cinematic-hero-scenery" aria-hidden="true">
        <div className="cinematic-hero-background" style={{ backgroundImage: `url("${heroBackground}")` }} />
      </div>
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            {error && !settings && <p className="hero-description">{error}</p>}
            <p className="hero-kicker">{t('hero.kicker')}</p>
            <h1 className="hero-title" id="cinematic-hero-title">
              {lang === 'az' ? 'Yaxınlığınızdakı ən yaxşı' : t('hero.titleBefore')}{' '}
              <span className="hero-title-accent">{t('hero.titleAccent')}</span>{' '}
              {t('hero.titleAfter')}
            </h1>
            <p className="hero-description">{t('hero.desc')}</p>
            <div className="discover-buttons">
              <button type="button" className="discover-btn" onClick={goPrimary}>
                <FaGlobeAmericas className="btn-icon" aria-hidden="true" />
                <span className="btn-text">{t('hero.discover')}</span>
              </button>
              <button type="button" className="discover-btn" onClick={() => setStoryOpen(true)}>
                <FaPlay className="btn-icon" aria-hidden="true" />
                <span className="btn-text">{t('hero.story')}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="hero-search">
          <SearchForm onSearch={onSearch} serviceType={serviceType} onServiceChange={onServiceChange} />
        </div>
      </div>

      {storyOpen && (
        <div className="story-overlay" onClick={() => setStoryOpen(false)}>
          <div className="story-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="story-close" onClick={() => setStoryOpen(false)} aria-label={t('hero.close')}>
              <FaTimes />
            </button>
            <div className="story-film">
              {video && <video src={video} controls autoPlay muted loop playsInline onLoadedMetadata={slowVideo} />}
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

