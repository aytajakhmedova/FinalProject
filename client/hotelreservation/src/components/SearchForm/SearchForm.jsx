import Combobox from '../common/Select/Combobox';
import { useState, useEffect, useRef } from 'react';
import {
  FaCalendarAlt,
  FaUsers,
  FaSearch,
  FaPlane,
  FaHotel,
  FaRoute,
  FaMinus,
  FaPlus,
} from 'react-icons/fa';
import { getSiteCities, getSiteCountries, listTours } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';
import './SearchForm.css';

const LocationPin = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" />
  </svg>
);

const todayISO = () => new Date().toISOString().split('T')[0];
const plusDaysISO = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const SearchForm = ({ onSearch, serviceType = 'hotel', onServiceChange }) => {
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [showGuests, setShowGuests] = useState(false);
  const [error, setError] = useState('');
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [tours, setTours] = useState([]);
  const wrapRef = useRef(null);
  const { t } = useLanguage();

  const tabs = [
    { id: 'hotel', label: t('search.hotel'), icon: <FaHotel /> },
    { id: 'flight', label: t('search.flight'), icon: <FaPlane /> },
    { id: 'tour', label: t('search.tour'), icon: <FaRoute /> },
  ];

  useEffect(() => {
    getSiteCountries().then(setCountries).catch(() => setCountries([]));
    getSiteCities()
      .then(setCities)
      .catch(() => setCities([]));
    listTours().then(setTours).catch(() => setTours([]));
  }, []);

  // A tour only runs on fixed dates: offer just the upcoming ones of the tours matching the place.
  const tourDates = [...new Set(
    tours
      .filter((tour) => !location.trim()
        || `${tour.destination} ${tour.name}`.toLowerCase().includes(location.trim().toLowerCase()))
      .flatMap((tour) => (Array.isArray(tour.availableDates) ? tour.availableDates : []))
      .filter((date) => date >= todayISO()),
  )].sort();

  useEffect(() => {
    const close = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowGuests(false);
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
    if (checkIn && checkOut && checkOut <= checkIn && serviceType !== 'flight') {
      setError(t('search.dateOrder'));
      return;
    }
    setError('');
    onSearch?.({
      type: serviceType,
      location: location.trim(),
      destination: serviceType === 'flight' ? destination.trim() : undefined,
      country: serviceType === 'hotel' && countries.includes(location.trim()) ? location.trim() : undefined,
      checkIn: serviceType === 'tour' && !tourDates.includes(checkIn) ? '' : checkIn,
      checkOut,
      guests,
    });
  };

  const titles = {
    hotel: t('search.hotelTitle'),
    flight: t('search.flightTitle'),
    tour: t('search.tourTitle'),
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

      <form className={`search-form${serviceType === 'flight' ? ' flight-mode' : ''}${serviceType === 'tour' ? ' tour-mode' : ''}`} onSubmit={handleSubmit}>
        <div className="form-field location-field">
          <span className="field-icon" aria-hidden="true">
            <LocationPin />
          </span>
          <div className="field-content">
            <label>{serviceType === 'flight' ? t('search.from') : t('search.place')}</label>
            <Combobox inputMode label={serviceType === 'flight' ? t('search.from') : t('search.place')}
              placeholder={t('search.cityPh')} value={location}
              options={[
                ...cities.map((city) => ({ value: city.name, label: city.name, description: city.country, searchText: city.name + ' ' + city.country })),
                ...(serviceType === 'hotel' ? countries.filter((name) => !cities.some((city) => city.name === name)).map((name) => ({ value: name, label: name })) : []),
              ]}
              onInputChange={setLocation} onChange={setLocation} />
          </div>
        </div>

        {serviceType === 'flight' && (
          <div className="form-field location-field">
            <span className="field-icon" aria-hidden="true">
              <LocationPin />
            </span>
            <div className="field-content">
              <label>{t('search.to')}</label>
              <Combobox inputMode label={t('search.to')}
                placeholder={t('search.cityPh')} value={destination}
                options={cities.map((city) => ({ value: city.name, label: city.name, description: city.country, searchText: city.name + ' ' + city.country }))}
                onInputChange={setDestination} onChange={setDestination} />
            </div>
          </div>
        )}

        <div className="form-divider"></div>

        <div className="form-field date-field">
          <span className="field-icon" aria-hidden="true">
            <FaCalendarAlt />
          </span>
          <div className="field-content">
            <label>{serviceType === 'flight' ? t('search.departure') : t('search.checkIn')}</label>
            {serviceType === 'tour' ? (
              <select value={tourDates.includes(checkIn) ? checkIn : ''} onChange={(e) => setCheckIn(e.target.value)}>
                <option value="">{tourDates.length ? t('search.anyTourDate') : t('search.noTourDate')}</option>
                {tourDates.map((date) => <option key={date} value={date}>{date}</option>)}
              </select>
            ) : (
              <input
                type="date"
                value={checkIn}
                min={todayISO()}
                onChange={handleCheckInChange}
                placeholder={t('search.checkIn')}
                required
              />
            )}
          </div>
        </div>

        {serviceType !== 'tour' && <div className="form-divider"></div>}
        {serviceType !== 'tour' && <div className="form-field date-field">
          <span className="field-icon" aria-hidden="true">
            <FaCalendarAlt />
          </span>
          <div className="field-content">
            <label>{serviceType === 'flight' ? t('search.return') : t('search.checkOut')}</label>
            <input
              type="date"
              value={checkOut}
              min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0] : new Date(Date.now() + 86400000).toISOString().split('T')[0]}
              onChange={(e) => setCheckOut(e.target.value)}
              placeholder={t('search.checkOut')}
              disabled={!checkIn}
              required
            />
          </div>
        </div>}

        <div className="form-divider"></div>

        <div className="form-field guests-field">
          <span className="field-icon" aria-hidden="true">
            <FaUsers />
          </span>
          <div className="field-content">
            <label>{t('search.guests')}</label>
            <button
              type="button"
              className="guest-trigger"
              onClick={() => setShowGuests((v) => !v)}
            >
              {t(serviceType === 'hotel' ? 'search.guestLine' : 'search.guestLineNoRooms',
                { adults: guests.adults, children: guests.children, rooms: guests.rooms })}
            </button>
          </div>
          {showGuests && (
            <div className="guest-popover">
              {[
                { key: 'adults', label: t('search.adults') },
                { key: 'children', label: t('search.children') },
                ...(serviceType === 'hotel' ? [{ key: 'rooms', label: t('search.rooms') }] : []),
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
          <FaSearch className="search-btn-icon" />
          <span className="search-btn-text">{t('search.search')}</span>
        </button>
      </form>
      {error && <p className="search-error">{error}</p>}
    </div>
  );
};

export default SearchForm;
