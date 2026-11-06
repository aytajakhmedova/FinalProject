import Combobox from '../../common/Select/Combobox';
import Select from '../../common/Select/Select';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import heroImage from '../../../assets/images/hotelimg1.jfif';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    rooms: 1
  });


  const popularLocations = [
    { id: 1, name: 'Bakı', country: 'Azərbaycan' },
    { id: 2, name: 'Quba', country: 'Azərbaycan' },
    { id: 3, name: 'Şəki', country: 'Azərbaycan' },
    { id: 4, name: 'Qəbələ', country: 'Azərbaycan' },
    { id: 5, name: 'Gəncə', country: 'Azərbaycan' },
    { id: 6, name: 'Lənkəran', country: 'Azərbaycan' },
    { id: 7, name: 'İstanbul', country: 'Türkiyə' },
    { id: 8, name: 'Dubai', country: 'BƏƏ' }
  ];

  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setFormData(prev => {
      const updatedData = { ...prev, checkIn: newCheckIn };
      
      // If checkout exists and is before or equal to new checkin, reset it
      if (prev.checkOut && prev.checkOut <= newCheckIn) {
        updatedData.checkOut = '';
      }
      
      return updatedData;
    });
  };

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
            <span className="hero-highlight">AE Hotel</span> ilə
          </h1>
          <p className="hero-subtitle">
            Azərbaycanda və dünyada ən yaxşı otelləri kəşf edin
          </p>
        </div>

        <form className="hero-booking-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group location-group">
              <label>
                <FaMapMarkerAlt />
                <span>Məkan</span>
              </label>
              <div className="location-input-wrapper">
                <Combobox inputMode label="Məkan" value={formData.location} placeholder="Şəhər və ya ölkə seçin"
                  inputProps={{ required: true }}
                  options={popularLocations.map((item) => ({ value: item.name + ', ' + item.country, label: item.name, description: item.country, searchText: item.name + ' ' + item.country }))}
                  onInputChange={(location) => setFormData({ ...formData, location })}
                  onChange={(location) => setFormData({ ...formData, location })} />
              </div>
            </div>

            <div className="form-group">
              <label>
                <FaCalendarAlt />
                <span>Giriş Tarixi</span>
              </label>
              <input
                type="date"
                value={formData.checkIn}
                onChange={handleCheckInChange}
                min={new Date().toISOString().split('T')[0]}
                placeholder="Giriş tarixi seçin"
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
                min={formData.checkIn ? new Date(new Date(formData.checkIn).getTime() + 86400000).toISOString().split('T')[0] : new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                placeholder="Çıxış tarixi seçin"
                disabled={!formData.checkIn}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaUsers />
                <span>Qonaqlar</span>
              </label>
              <div className="guests-input">
                <Select
                  value={formData.adults}
                  onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) })}
                >
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n} Böyük</option>
                  ))}
                </Select>
                <Select
                  value={formData.children}
                  onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) })}
                >
                  {[0, 1, 2, 3, 4].map(n => (
                    <option key={n} value={n}>{n} Uşaq</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="form-group">
              <label>
                <span>Otaq Sayı</span>
              </label>
              <Select
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: parseInt(e.target.value) })}
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n} Otaq</option>
                ))}
              </Select>
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
