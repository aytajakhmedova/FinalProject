import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaSearch } from 'react-icons/fa';
import heroImage from '../../../assets/images/otelimages.jpg';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    rooms: 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/otaqlar', { state: formData });
  };

  return (
    <section className="hero">
      <div className="hero-background">
        <img src={heroImage} alt="Luxury Hotel" />
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Lüks və Rahatlıq <br />
            <span className="hero-highlight">OtelBurada</span> ilə
          </h1>
          <p className="hero-subtitle">
            Azərbaycanda və dünyada ən yaxşı otelləri kəşf edin
          </p>
        </div>

        <form className="hero-booking-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>
                <FaCalendarAlt />
                <span>Giriş Tarixi</span>
              </label>
              <input
                type="date"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaCalendarAlt />
                <span>Çıxış Tarixi</span>
              </label>
              <input
                type="date"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaUsers />
                <span>Qonaqlar</span>
              </label>
              <div className="guests-input">
                <select
                  value={formData.adults}
                  onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) })}
                >
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n} Böyük</option>
                  ))}
                </select>
                <select
                  value={formData.children}
                  onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) })}
                >
                  {[0, 1, 2, 3, 4].map(n => (
                    <option key={n} value={n}>{n} Uşaq</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>
                <span>Otaq Sayı</span>
              </label>
              <select
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: parseInt(e.target.value) })}
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n} Otaq</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-search">
              <FaSearch />
              <span>Axtar</span>
            </button>
          </div>
        </form>
      </div>

      <div className="hero-scroll-indicator">
        <div className="scroll-arrow"></div>
      </div>
    </section>
  );
};

export default Hero;
