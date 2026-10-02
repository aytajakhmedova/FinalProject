import { useState, useEffect, useRef } from 'react';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaSearch,
  FaPlane,
  FaHotel,
  FaRoute,
  FaTaxi,
  FaMinus,
  FaPlus,
} from 'react-icons/fa';
import { CITIES } from '../../data/travelData';
import './SearchForm.css';

const todayISO = () => new Date().toISOString().split('T')[0];
const plusDaysISO = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const SearchForm = ({ onSearch, serviceType = 'hotel', onServiceChange }) => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [showGuests, setShowGuests] = useState(false);
  const [showCities, setShowCities] = useState(false);
  const [error, setError] = useState('');
  const wrapRef = useRef(null);

  const tabs = [
    { id: 'hotel', label: 'Otel', icon: <FaHotel /> },
    { id: 'flight', label: 'Uçuş', icon: <FaPlane /> },
    { id: 'tour', label: 'Tur', icon: <FaRoute /> },
    { id: 'taxi', label: 'Taksi', icon: <FaTaxi /> },
  ];

  const filteredCities = CITIES.filter((c) =>
    `${c.name} ${c.country}`.toLowerCase().includes(location.toLowerCase())
  );

  useEffect(() => {
    const close = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowGuests(false);
        setShowCities(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const changeGuest = (key, delta) => {
    setGuests((prev) => {
      const min = key === 'adults' || key === 'rooms' ? 1 : 0;
      const next = Math.max(min, prev[key] + delta);
      return { ...prev, [key]: next };
    });
  };

  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setCheckIn(newCheckIn);
    
    // If checkout exists and is before or equal to new checkin, reset it
    if (checkOut && checkOut <= newCheckIn) {
      setCheckOut('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkOut <= checkIn && serviceType !== 'taxi' && serviceType !== 'flight') {
      setError('Çıxış tarixi girişdən sonra olmalıdır');
      return;
    }
    setError('');
    onSearch?.({
      type: serviceType,
      location: location.trim(),
      checkIn,
      checkOut,
      guests,
    });
  };

  const titles = {
    hotel: 'Otel əlçatanlığını yoxla',
    flight: 'Uçuş axtar',
    tour: 'Tur və təcrübə tap',
    taxi: 'Hava limanı taksisi',
  };

  return (
    <div className="search-form-container" id="search" ref={wrapRef}>
      <div className="search-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`search-tab ${serviceType === tab.id ? 'active' : ''}`}
            onClick={() => onServiceChange?.(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="form-header">
        <h3 className="form-title">{titles[serviceType]}</h3>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <div className="form-field location-field">
          <FaMapMarkerAlt className="field-icon" />
          <div className="field-content">
            <label>{serviceType === 'flight' ? 'Haradan / hara' : 'Məkan'}</label>
            <input
              type="text"
              placeholder="Şəhər və ya ölkə yazın"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setShowCities(true);
              }}
              onFocus={() => setShowCities(true)}
              autoComplete="off"
            />
          </div>
          {showCities && filteredCities.length > 0 && (
            <ul className="suggest-list">
              {filteredCities.slice(0, 6).map((city) => (
                <li
                  key={city.name}
                  onClick={() => {
                    setLocation(city.name);
                    setShowCities(false);
                  }}
                >
                  <FaMapMarkerAlt />
                  <span>
                    {city.name}
                    <small>{city.country}</small>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-divider"></div>

        <div className="form-field date-field">
          <FaCalendarAlt className="field-icon" />
          <div className="field-content">
            <label>{serviceType === 'taxi' ? 'Tarix' : 'Giriş'}</label>
            <input
              type="date"
              value={checkIn}
              min={todayISO()}
              onChange={handleCheckInChange}
              placeholder="Giriş tarixi seçin"
              required
            />
          </div>
        </div>

        {serviceType !== 'taxi' && (
          <>
            <div className="form-divider"></div>
            <div className="form-field date-field">
              <FaCalendarAlt className="field-icon" />
              <div className="field-content">
                <label>{serviceType === 'flight' ? 'Dönüş' : 'Çıxış'}</label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0] : new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  onChange={(e) => setCheckOut(e.target.value)}
                  placeholder="Çıxış tarixi seçin"
                  disabled={!checkIn}
                  required
                />
              </div>
            </div>
          </>
        )}

        <div className="form-divider"></div>

        <div className="form-field guests-field">
          <FaUsers className="field-icon" />
          <div className="field-content">
            <label>Qonaqlar</label>
            <button
              type="button"
              className="guest-trigger"
              onClick={() => setShowGuests((v) => !v)}
            >
              {guests.adults} böyük · {guests.children} uşaq · {guests.rooms} otaq
            </button>
          </div>
          {showGuests && (
            <div className="guest-popover">
              {[
                { key: 'adults', label: 'Böyüklər' },
                { key: 'children', label: 'Uşaqlar' },
                { key: 'rooms', label: 'Otaqlar' },
              ].map((row) => (
                <div className="guest-row" key={row.key}>
                  <span>{row.label}</span>
                  <div className="guest-controls">
                    <button type="button" onClick={() => changeGuest(row.key, -1)}>
                      <FaMinus />
                    </button>
                    <strong>{guests[row.key]}</strong>
                    <button type="button" onClick={() => changeGuest(row.key, 1)}>
                      <FaPlus />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="search-button" type="submit" aria-label="Axtar">
          <FaSearch className="search-icon" />
          <span className="search-btn-text">Axtar</span>
        </button>
      </form>
      {error && <p className="search-error">{error}</p>}
    </div>
  );
};

export default SearchForm;
