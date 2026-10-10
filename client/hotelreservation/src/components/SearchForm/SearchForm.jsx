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
import { useLanguage } from '../../context/LanguageContext';
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
  const { t } = useLanguage();

  const tabs = [
    { id: 'hotel', label: t('search.hotel'), icon: <FaHotel /> },
    { id: 'flight', label: t('search.flight'), icon: <FaPlane /> },
    { id: 'tour', label: t('search.tour'), icon: <FaRoute /> },
    { id: 'taxi', label: t('search.taxi'), icon: <FaTaxi /> },
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
    if (serviceType === 'hotel' && (!checkIn || !checkOut)) {
      setError(t('search.needDates'));
      return;
    }
    if (checkIn && checkOut && checkOut <= checkIn && serviceType !== 'taxi' && serviceType !== 'flight') {
      setError(t('search.dateOrder'));
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
    hotel: t('search.hotelTitle'),
    flight: t('search.flightTitle'),
    tour: t('search.tourTitle'),
    taxi: t('search.taxiTitle'),
  };

  return (
    <div className="search-form-container" id="search" ref={wrapRef}>
      <div className="search-form-top">
        <h3 className="form-title">{titles[serviceType]}</h3>
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
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <div className="form-field location-field">
          <FaMapMarkerAlt className="field-icon" />
          <div className="field-content">
            <label>{serviceType === 'flight' ? t('search.fromTo') : t('search.place')}</label>
            <input
              type="text"
              placeholder={t('search.cityPh')}
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
            <label>{serviceType === 'taxi' ? t('search.date') : t('search.checkIn')}</label>
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
                <label>{serviceType === 'flight' ? t('search.return') : t('search.checkOut')}</label>
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
            <label>{t('search.guests')}</label>
            <button
              type="button"
              className="guest-trigger"
              onClick={() => setShowGuests((v) => !v)}
            >
              {t('search.guestLine', { adults: guests.adults, children: guests.children, rooms: guests.rooms })}
            </button>
          </div>
          {showGuests && (
            <div className="guest-popover">
              {[
                { key: 'adults', label: t('search.adults') },
                { key: 'children', label: t('search.children') },
                { key: 'rooms', label: t('search.rooms') },
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

        <button className="search-button" type="submit" aria-label={t('search.search')}>
          <FaSearch className="search-icon" />
          <span className="search-btn-text">{t('search.search')}</span>
        </button>
      </form>
      {error && <p className="search-error">{error}</p>}
    </div>
  );
};

export default SearchForm;
