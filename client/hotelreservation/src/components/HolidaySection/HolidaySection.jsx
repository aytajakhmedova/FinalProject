import React from 'react';
import { FaUtensils, FaBolt, FaShieldAlt, FaClock, FaStar } from 'react-icons/fa';
import holidayImage from '../../assets/images/hotelimg2.jfif';
import { useLanguage } from '../../context/LanguageContext';
import './HolidaySection.css';

const HolidaySection = () => {
  const { t } = useLanguage();
  const features = [
    {
      icon: <FaUtensils />,
      title: t('holiday.food'),
      description: t('holiday.foodDesc'),
      color: '#4ade80'
    },
    {
      icon: <FaBolt />,
      title: t('holiday.fast'),
      description: t('holiday.fastDesc'),
      color: '#f43f5e'
    },
    {
      icon: <FaShieldAlt />,
      title: t('holiday.pay'),
      description: t('holiday.payDesc'),
      color: '#fb923c'
    },
    {
      icon: <FaClock />,
      title: t('holiday.support'),
      description: t('holiday.supportDesc'),
      color: '#3b82f6'
    }
  ];

  return (
    <section className="holiday-section" id="about">
      <div className="holiday-container">
        <div className="holiday-left">
          <div className="holiday-image-wrapper">
            <div className="star-decoration">
              <FaStar />
            </div>
            <div className="holiday-image">
              <img src={holidayImage} alt="Holiday Destination" />
            </div>
            <div className="rating-badge">
              <div className="rating-avatars">
                {['A', 'L', 'N', 'S'].map((letter) => (
                  <span key={letter} className="avatar-chip">{letter}</span>
                ))}
              </div>
              <div className="rating-info">
                <div className="rating-label">{t('holiday.guests')}</div>
                <div className="rating-text">{t('holiday.rating')}</div>
                <div className="rating-stars">4.8 ⭐</div>
              </div>
            </div>
          </div>
        </div>

        <div className="holiday-right">
          <h2 className="holiday-title">{t('holiday.title')}</h2>
          <p className="holiday-description">
            {t('holiday.desc')}
          </p>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div 
                  className="feature-icon" 
                  style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
                >
                  {feature.icon}
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HolidaySection;
