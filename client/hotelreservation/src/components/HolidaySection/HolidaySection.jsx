import React from 'react';
import { FaUtensils, FaBolt, FaShieldAlt, FaClock, FaStar } from 'react-icons/fa';
import holidayImage from '../../assets/images/hotelimg2.jfif';
import './HolidaySection.css';

const HolidaySection = () => {
  const features = [
    {
      icon: <FaUtensils />,
      title: 'Keyfiyyətli yemək',
      description: 'Yerli və beynəlxalq mətbəx — chef menyusu və halal seçimlər.',
      color: '#4ade80'
    },
    {
      icon: <FaBolt />,
      title: 'Sürətli xidmət',
      description: 'Dəqiqəlik check-in, ani təsdiq və 24 saat otaq xidməti.',
      color: '#f43f5e'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Təhlükəsiz ödəniş',
      description: 'SSL bron, geri qaytarılan tariflər və sığorta paketləri.',
      color: '#fb923c'
    },
    {
      icon: <FaClock />,
      title: '7/24 dəstək',
      description: 'Səyahət boyu Azərbaycan dilində canlı dəstək.',
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
                <div className="rating-label">Qonaqlar</div>
                <div className="rating-text">Reytinq</div>
                <div className="rating-stars">4.8 ⭐</div>
              </div>
            </div>
          </div>
        </div>

        <div className="holiday-right">
          <h2 className="holiday-title">Ən yaxşı tətil buradan başlayır</h2>
          <p className="holiday-description">
            Oteli bron edin, eyni anda uçuş, tur və transfer əlavə edin — kampaniya kodları ilə
            qalmanızı daha sərfəli edin.
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
