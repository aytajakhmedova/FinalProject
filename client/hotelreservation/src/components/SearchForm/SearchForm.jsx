import React, { useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaSearch } from 'react-icons/fa';
import './SearchForm.css';

const SearchForm = () => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('19 Sep');
  const [checkOut, setCheckOut] = useState('28 Sep');
  const [guests, setGuests] = useState({ adults: 2, rooms: 1 });

  return (
    <div className="search-form-container">
      <div className="form-header">
        <h3 className="form-title">Müsaitlik Durumunu Kontrol Et</h3>
      </div>
      
      <div className="search-form">
        <div className="form-field location-field">
          <FaMapMarkerAlt className="field-icon" />
          <div className="field-content">
            <label>Konum</label>
            <input 
              type="text" 
              placeholder="Konum seçin"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="form-divider"></div>

        <div className="form-field date-field">
          <FaCalendarAlt className="field-icon" />
          <div className="field-content">
            <label>Giriş - Çıkış</label>
            <input 
              type="text" 
              value={`${checkIn} to ${checkOut}`}
              readOnly
            />
          </div>
        </div>

        <div className="form-divider"></div>

        <div className="form-field guests-field">
          <FaUsers className="field-icon" />
          <div className="field-content">
            <label>Konuklar ve oteller</label>
            <input 
              type="text" 
              value={`${guests.adults} Guests ${guests.rooms} Room`}
              readOnly
            />
          </div>
        </div>

        <button className="search-button">
          <FaSearch className="search-icon" />
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
