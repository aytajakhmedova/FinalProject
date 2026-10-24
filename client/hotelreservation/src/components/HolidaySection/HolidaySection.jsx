import React from 'react';
import { FaUtensils, FaBolt, FaShieldAlt, FaClock, FaStar } from 'react-icons/fa';
import { useSiteContent } from '../../context/SiteContentContext';
import { resolveImage } from '../../api/client';
import './HolidaySection.css';

const ICONS = {
  utensils: FaUtensils,
  bolt: FaBolt,
  shield: FaShieldAlt,
  clock: FaClock,
};

const HolidaySection = () => {
  const { content, loading, error } = useSiteContent();
  const settings = content?.settings;
  const image = resolveImage(settings?.advantagesImageUrl);
  const features = content?.advantages || [];

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
          <p className="holiday-description">Yüklənir...</p>
        </div>
      </section>
    );
  }

  if (!settings) return null;

  return (
    <section className="holiday-section" id="about">
      <div className="holiday-container">
        <div className="holiday-left">
          <div className="holiday-image-wrapper">
            <div className="star-decoration">
              <FaStar />
            </div>
            <div className="holiday-image">
              {image && <img src={image} alt={settings.advantagesTitle} />}
            </div>
            <div className="rating-badge">
              <div className="rating-avatars">
                {['A', 'L', 'N', 'S'].map((letter) => (
                  <span key={letter} className="avatar-chip">{letter}</span>
                ))}
              </div>
              <div className="rating-info">
                <div className="rating-label">Qonaqlar</div>
                <div className="rating-text">Reytinq</div>
                <div className="rating-stars">{settings.advantagesRating} ⭐</div>
              </div>
            </div>
          </div>
        </div>

        <div className="holiday-right">
          <h2 className="holiday-title">{settings.advantagesTitle}</h2>
          <p className="holiday-description">{settings.advantagesDescription}</p>

          <div className="features-grid">
            {features.map((feature) => {
              const Icon = ICONS[feature.iconKey] || FaStar;
              return (
                <div key={feature.id} className="feature-card">
                  <div
                    className="feature-icon"
                    style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
                  >
                    <Icon />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
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
