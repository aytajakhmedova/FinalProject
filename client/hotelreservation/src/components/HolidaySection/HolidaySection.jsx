import React from 'react';
import { FaUtensils, FaBolt, FaShieldAlt, FaClock, FaStar } from 'react-icons/fa';
import holidayImage from '../../assets/images/Holiday Destination.jpg';
import './HolidaySection.css';

const HolidaySection = () => {
  const features = [
    {
      icon: <FaUtensils />,
      title: 'Quality Food',
      description: 'Departure defective arranging rapturous did. Conduct denied adding worthy little.',
      color: '#4ade80'
    },
    {
      icon: <FaBolt />,
      title: 'Quick Services',
      description: 'Supposing so be resolving breakfast am or perfectly.',
      color: '#f43f5e'
    },
    {
      icon: <FaShieldAlt />,
      title: 'High Security',
      description: 'Arranging rapturous did believe him all had supported.',
      color: '#fb923c'
    },
    {
      icon: <FaClock />,
      title: '24 Hours Alert',
      description: 'Rapturous did believe him all had supported.',
      color: '#3b82f6'
    }
  ];

  return (
    <section className="holiday-section">
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
                <img src="/avatar1.jpg" alt="Client 1" />
                <img src="/avatar2.jpg" alt="Client 2" />
                <img src="/avatar3.jpg" alt="Client 3" />
                <img src="/avatar4.jpg" alt="Client 4" />
              </div>
              <div className="rating-info">
                <div className="rating-label">Client</div>
                <div className="rating-text">Rating</div>
                <div className="rating-stars">4.5 ⭐</div>
              </div>
            </div>
          </div>
        </div>

        <div className="holiday-right">
          <h2 className="holiday-title">The Best Holidays Start Here!</h2>
          <p className="holiday-description">
            Book your hotel with us and don't forget to grab an awesome hotel deal to 
            save massive on your stay.
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
