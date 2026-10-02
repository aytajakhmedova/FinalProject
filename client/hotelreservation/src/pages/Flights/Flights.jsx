import React, { useState, useRef, useEffect } from 'react';
import { FaExchangeAlt, FaCalendarAlt, FaPlane } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ucakImage from '../../assets/images/ucakk.jpg';
import './Flights.css';

const Flights = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('one-way');
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departure: '',
    returnDate: '',
    travelers: '1',
    flightClass: 'economy',
  });
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [filteredFromLocations, setFilteredFromLocations] = useState([]);
  const [filteredToLocations, setFilteredToLocations] = useState([]);
  
  const fromRef = useRef(null);
  const toRef = useRef(null);

  const locations = [
    { code: 'GYD', city: 'Bakı', country: 'Azərbaycan', airport: 'Heydər Əliyev Hava Limanı' },
    { code: 'IST', city: 'İstanbul', country: 'Türkiyə', airport: 'İstanbul Hava Limanı' },
    { code: 'DXB', city: 'Dubai', country: 'BƏƏ', airport: 'Dubai Beynəlxalq Hava Limanı' },
    { code: 'LHR', city: 'London', country: 'Böyük Britaniya', airport: 'Heathrow Hava Limanı' },
    { code: 'CDG', city: 'Paris', country: 'Fransa', airport: 'Charles de Gaulle Hava Limanı' },
    { code: 'JFK', city: 'Nyu-York', country: 'ABŞ', airport: 'John F. Kennedy Hava Limanı' },
    { code: 'SVO', city: 'Moskva', country: 'Rusiya', airport: 'Sheremetyevo Hava Limanı' },
    { code: 'AYT', city: 'Antalya', country: 'Türkiyə', airport: 'Antalya Hava Limanı' },
    { code: 'DOH', city: 'Doha', country: 'Qətər', airport: 'Hamad Beynəlxalq Hava Limanı' },
    { code: 'FRA', city: 'Frankfurt', country: 'Almaniya', airport: 'Frankfurt Hava Limanı' },
    { code: 'AMS', city: 'Amsterdam', country: 'Niderland', airport: 'Schiphol Hava Limanı' },
    { code: 'BCN', city: 'Barselona', country: 'İspaniya', airport: 'Barcelona-El Prat Hava Limanı' },
    { code: 'FCO', city: 'Roma', country: 'İtaliya', airport: 'Fiumicino Hava Limanı' },
    { code: 'VIE', city: 'Vyana', country: 'Avstriya', airport: 'Vyana Beynəlxalq Hava Limanı' },
    { code: 'PRG', city: 'Praqa', country: 'Çexiya', airport: 'Václav Havel Hava Limanı' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromRef.current && !fromRef.current.contains(event.target)) {
        setShowFromDropdown(false);
      }
      if (toRef.current && !toRef.current.contains(event.target)) {
        setShowToDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFromChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, from: value }));
    
    if (value.length > 0) {
      const filtered = locations.filter(loc => 
        loc.city.toLowerCase().includes(value.toLowerCase()) ||
        loc.country.toLowerCase().includes(value.toLowerCase()) ||
        loc.code.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredFromLocations(filtered);
      setShowFromDropdown(true);
    } else {
      setFilteredFromLocations(locations);
      setShowFromDropdown(true);
    }
  };

  const handleToChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, to: value }));
    
    if (value.length > 0) {
      const filtered = locations.filter(loc => 
        loc.city.toLowerCase().includes(value.toLowerCase()) ||
        loc.country.toLowerCase().includes(value.toLowerCase()) ||
        loc.code.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredToLocations(filtered);
      setShowToDropdown(true);
    } else {
      setFilteredToLocations(locations);
      setShowToDropdown(true);
    }
  };

  const selectFromLocation = (location) => {
    setFormData(prev => ({ ...prev, from: `${location.city} (${location.code})` }));
    setShowFromDropdown(false);
  };

  const selectToLocation = (location) => {
    setFormData(prev => ({ ...prev, to: `${location.city} (${location.code})` }));
    setShowToDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to flight results with search data
    navigate('/flight-results', {
      state: {
        from: formData.from,
        to: formData.to,
        departure: formData.departure,
        returnDate: formData.returnDate,
        travelers: formData.travelers,
        class: formData.flightClass
      }
    });
  };

  const handleSwapLocations = () => {
    setFormData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  const handleFromFocus = () => {
    setFilteredFromLocations(locations);
    setShowFromDropdown(true);
  };

  const handleToFocus = () => {
    setFilteredToLocations(locations);
    setShowToDropdown(true);
  };

  const specialOffers = [
    {
      id: 1,
      airline: 'AZAL',
      discount: '$899 endirim',
      type: 'Daxili uçuşlar',
      code: 'AZAL125F',
      color: '#1e6f5c'
    },
    {
      id: 2,
      airline: 'Turkish Airlines',
      discount: '13% endirim',
      type: 'Daxili uçuşlar',
      code: 'TK125F',
      color: '#7f2982'
    },
    {
      id: 3,
      airline: 'Emirates',
      discount: '$2,400 endirim',
      type: 'Beynəlxalq uçuşlar',
      code: 'EK125F',
      color: '#2d545e'
    },
  ];

  const popularDestinations = [
    {
      id: 1,
      name: 'İstanbul',
      country: 'Türkiyə',
      image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=500',
      rating: 4.8,
      info: 'Növbəti uçuş 15 Yanvar',
      code: 'IST'
    },
    {
      id: 2,
      name: 'Dubai',
      country: 'BƏƏ',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500',
      rating: 4.9,
      info: 'Gündəlik 2 uçuş',
      code: 'DXB'
    },
    {
      id: 3,
      name: 'Paris',
      country: 'Fransa',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500',
      rating: 4.7,
      info: 'Həftədə 5 uçuş',
      code: 'CDG'
    },
    {
      id: 4,
      name: 'London',
      country: 'Böyük Britaniya',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500',
      rating: 4.6,
      info: 'Növbəti uçuş 12 Yanvar',
      code: 'LHR'
    },
  ];

  const handleDestinationClick = (destination) => {
    // Navigate to flight results with pre-filled destination
    navigate('/flight-results', {
      state: {
        from: 'Bakı (GYD)',
        to: `${destination.name} (${destination.code})`,
        departure: new Date().toISOString().split('T')[0],
        travelers: '1',
        class: 'economy'
      }
    });
  };

  return (
    <div className="flights-page">
      {/* Hero Section */}
      <section className="flights-hero" style={{ backgroundImage: `url(${ucakImage})` }}>
        <div className="flights-hero-overlay">
          <div className="flights-hero-content">
            <h1 className="flights-hero-title">Uçmağa Hazırsınız?</h1>

            {/* Search Form */}
            <div className="flights-search-card">
              {/* Trip Type Tabs */}
              <div className="trip-type-tabs">
                <button 
                  className={`trip-tab ${tripType === 'one-way' ? 'active' : ''}`}
                  onClick={() => setTripType('one-way')}
                >
                  Tək tərəfli
                </button>
                <button 
                  className={`trip-tab ${tripType === 'round-trip' ? 'active' : ''}`}
                  onClick={() => setTripType('round-trip')}
                >
                  Gediş-Gəliş
                </button>

                <div className="trip-selects">
                  <select 
                    name="flightClass" 
                    value={formData.flightClass}
                    onChange={handleChange}
                    className="trip-select"
                  >
                    <option value="economy">Ekonom</option>
                    <option value="business">Biznes</option>
                    <option value="first">Birinci sinif</option>
                  </select>

                  <select 
                    name="travelers" 
                    value={formData.travelers}
                    onChange={handleChange}
                    className="trip-select"
                  >
                    <option value="1">1 Sərnişin</option>
                    <option value="2">2 Sərnişin</option>
                    <option value="3">3 Sərnişin</option>
                    <option value="4">4 Sərnişin</option>
                    <option value="5">5+ Sərnişin</option>
                  </select>
                </div>
              </div>

              {/* Search Inputs */}
              <form onSubmit={handleSubmit} className="flights-search-form">
                <div className="flight-inputs-row">
                  <div className="flight-input-group" ref={fromRef}>
                    <label className="flight-label">
                      <FaPlane className="flight-icon" />
                      Haradan
                    </label>
                    <input
                      type="text"
                      name="from"
                      value={formData.from}
                      onChange={handleFromChange}
                      onFocus={handleFromFocus}
                      placeholder="Şəhər və ya hava limanı"
                      className="flight-input"
                      autoComplete="off"
                      required
                    />
                    {showFromDropdown && (
                      <div className="location-dropdown">
                        {filteredFromLocations.length > 0 ? (
                          filteredFromLocations.map(location => (
                            <div 
                              key={location.code}
                              className="location-item"
                              onClick={() => selectFromLocation(location)}
                            >
                              <div className="location-code">{location.code}</div>
                              <div className="location-info">
                                <div className="location-city">{location.city}</div>
                                <div className="location-details">
                                  {location.airport} • {location.country}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="location-empty">Nəticə tapılmadı</div>
                        )}
                      </div>
                    )}
                  </div>

                  <button 
                    type="button" 
                    className="swap-button"
                    onClick={handleSwapLocations}
                    title="Yerləri dəyiş"
                  >
                    <FaExchangeAlt />
                  </button>

                  <div className="flight-input-group" ref={toRef}>
                    <label className="flight-label">
                      <FaPlane className="flight-icon rotated" />
                      Hara
                    </label>
                    <input
                      type="text"
                      name="to"
                      value={formData.to}
                      onChange={handleToChange}
                      onFocus={handleToFocus}
                      placeholder="Şəhər və ya hava limanı"
                      className="flight-input"
                      autoComplete="off"
                      required
                    />
                    {showToDropdown && (
                      <div className="location-dropdown">
                        {filteredToLocations.length > 0 ? (
                          filteredToLocations.map(location => (
                            <div 
                              key={location.code}
                              className="location-item"
                              onClick={() => selectToLocation(location)}
                            >
                              <div className="location-code">{location.code}</div>
                              <div className="location-info">
                                <div className="location-city">{location.city}</div>
                                <div className="location-details">
                                  {location.airport} • {location.country}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="location-empty">Nəticə tapılmadı</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flight-input-group">
                    <label className="flight-label">
                      <FaCalendarAlt className="flight-icon" />
                      Gediş tarixi
                    </label>
                    <input
                      type="date"
                      name="departure"
                      value={formData.departure}
                      onChange={handleChange}
                      className="flight-input"
                      required
                    />
                  </div>

                  {tripType === 'round-trip' && (
                    <div className="flight-input-group">
                      <label className="flight-label">
                        <FaCalendarAlt className="flight-icon" />
                        Gəliş tarixi
                      </label>
                      <input
                        type="date"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleChange}
                        className="flight-input"
                      />
                    </div>
                  )}
                </div>

                <button type="submit" className="flight-search-button">
                  Bilet Tap
                  <FaPlane />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="special-offers-section">
        <div className="container">
          <h2 className="section-title">Xüsusi Təkliflər</h2>
          <div className="offers-grid">
            {specialOffers.map(offer => (
              <div key={offer.id} className="offer-card" style={{ backgroundColor: offer.color }}>
                <div className="offer-badge">Endirim</div>
                <h3 className="offer-airline">{offer.airline}</h3>
                <p className="offer-discount">{offer.discount}</p>
                <p className="offer-type">{offer.type}</p>
                <div className="offer-footer">
                  <span className="offer-code">{offer.code}</span>
                  <button className="offer-button">→</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="popular-destinations-section">
        <div className="container">
          <h2 className="section-title">Populyar İstiqamətlər</h2>
          <div className="destinations-grid">
            {popularDestinations.map(destination => (
              <div 
                key={destination.id} 
                className="destination-card"
                onClick={() => handleDestinationClick(destination)}
                style={{ cursor: 'pointer' }}
              >
                <div className="destination-image-wrapper">
                  <img src={destination.image} alt={destination.name} className="destination-image" />
                  <div className="destination-rating">
                    {destination.rating} ⭐
                  </div>
                </div>
                <div className="destination-content">
                  <h3 className="destination-name">{destination.name}</h3>
                  <p className="destination-country">{destination.country}</p>
                  <p className="destination-info">{destination.info}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-section">
        <div className="container">
          <div className="why-grid">
            <div className="why-item">
              <div className="why-icon">🌍</div>
              <h3>Geniş Seçim</h3>
              <p>630+ istiqamət ilə işləyirik</p>
            </div>
            <div className="why-item">
              <div className="why-icon">📍</div>
              <h3>İstiqaməti Seçin</h3>
              <p>Ən sərfəli marşrutlar</p>
            </div>
            <div className="why-item">
              <div className="why-icon">✈️</div>
              <h3>Asan Rezervasiya</h3>
              <p>Sürətli və təhlükəsiz bilet alışı</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Kəşf etmək vaxtıdır ✈️</h2>
          <p className="cta-text">
            Dünyanın ən gözəl yerlərini kəşf edin və unudulmaz səyahətlər yaşayın
          </p>
          <button className="cta-button">Uçuş Rezerv Et</button>
        </div>
      </section>
    </div>
  );
};

export default Flights;
