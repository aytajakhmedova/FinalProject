import React from 'react';
import { FaUtensils, FaBolt, FaShieldAlt, FaClock, FaStar, FaHeadset, FaPlay } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { resolveImage } from '../../api/client';
import './HolidaySection.css';

const ICONS = {
  utensils: FaUtensils,
  bolt: FaBolt,
  shield: FaShieldAlt,
  clock: FaClock,
};

const FEATURE_COPY = {
  utensils: { title: 'holiday.food', desc: 'holiday.foodDesc' },
  bolt: { title: 'holiday.fast', desc: 'holiday.fastDesc' },
  shield: { title: 'holiday.pay', desc: 'holiday.payDesc' },
  clock: { title: 'holiday.support', desc: 'holiday.supportDesc' },
};

const DEFAULT_FEATURES = [
  { id: 'food', iconKey: 'utensils', color: '#D2691E' },
  { id: 'fast', iconKey: 'bolt', color: '#CD853F' },
  { id: 'pay', iconKey: 'shield', color: '#8B5A3C' },
  { id: 'support', iconKey: 'clock', color: '#A0522D' },
];

const HolidaySection = ({ aboutPage = false, reviewCount = 0, onPlayVideo }) => {
  const { t } = useLanguage();
  const { content, loading, error } = useSiteContent();
  const settings = content?.settings;
  const image = resolveImage(settings?.advantagesImageUrl);
  const features = content?.advantages?.length ? content.advantages : DEFAULT_FEATURES;

  if (error && !settings) {
    return (
      <section className="holiday-section" id="about">
        <div className="holiday-container">
          <p className="holiday-description">{error}</p>
        </div>
      </section>
    );
  }

  if (loading && !settings) {
    return (
      <section className="holiday-section" id="about">
        <div className="holiday-container">
          <p className="holiday-description">{t('common.loading')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="holiday-section" id="about">
      <div className="holiday-container">
        <div className="holiday-left">
          <div className="holiday-image-wrapper">
            <div className="star-decoration">
              <FaStar />
            </div>
            <div className="holiday-image">
              {image && <img src={image} alt={t('holiday.title')} />}
            </div>
            <div className="rating-badge">
              <div className="rating-avatars">
                {['A', 'L', 'N', 'S'].map((letter) => (
                  <span key={letter} className="avatar-chip">{letter}</span>
                ))}
              </div>
              <div className="rating-info">
                <div className="rating-label">{aboutPage ? 'Qonaq rəyləri' : t('holiday.guests')}</div>
                <div className="rating-text">{aboutPage && reviewCount > 0 ? `${reviewCount.toLocaleString('az-AZ')} rəy` : t('holiday.rating')}</div>
                <div className="rating-stars">{settings?.advantagesRating || '4.9'} ⭐</div>
              </div>
            </div>
            {aboutPage && onPlayVideo && <button type="button" className="about-play-video" onClick={onPlayVideo} aria-label="AE Hotel videosunu izlə"><FaPlay aria-hidden="true" /></button>}
          </div>
        </div>

        <div className="holiday-right">
          {aboutPage && <p className="about-eyebrow">AE Hotel</p>}
          <h2 className="holiday-title">{aboutPage ? <>Ən yaxşı tətil<br />buradan <em>başlayır</em></> : t('holiday.title')}</h2>
          <p className="holiday-description">{t('holiday.desc')}</p>

          <div className="features-grid">
            {features.map((feature) => {
              const Icon = aboutPage && feature.iconKey === 'clock' ? FaHeadset : ICONS[feature.iconKey] || FaStar;
              const copy = FEATURE_COPY[feature.iconKey];
              return (
                <div key={feature.id} className="feature-card" data-feature={feature.iconKey}>
                  <div
                    className="feature-icon"
                    style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
                  >
                    <Icon />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">{copy ? t(copy.title) : feature.title}</h3>
                    <p className="feature-description">{copy ? t(copy.desc) : feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HolidaySection;
