import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlane, FaExchangeAlt, FaFilter, FaTimesCircle } from 'react-icons/fa';
import './FlightResults.css';

const FlightResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state || {
    from: 'Bakı (GYD)',
    to: 'İstanbul (IST)',
    departure: '2026-01-25',
    travelers: '2',
    class: 'economy'
  };

  const [priceRange, setPriceRange] = useState([70, 500]);
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedAirports, setSelectedAirports] = useState([]);

  const flights = [
    {
      id: 1,
      airline: 'AZAL',
      flightNumber: 'J2-5620',
      logo: '🛫',
      departTime: '14:50',
      departDate: 'Baz, 25 Yan 2026',
      departLocation: 'GYD - Terminal 1',
      departCity: 'Bakı, Azərbaycan',
      arriveTime: '17:35',
      arriveDate: 'Baz, 25 Yan 2026',
      arriveLocation: 'IST - Terminal 1',
      arriveCity: 'İstanbul, Türkiyə',
      duration: '2s 45dəq',
      stops: 'Birbaşa',
      price: 180,
      class: 'Ekonom',
      seatsLeft: 15,
      refundable: true
    },
    {
      id: 2,
      airline: 'Turkish Airlines',
      flightNumber: 'TK-1254',
      logo: '✈️',
      departTime: '09:20',
      departDate: 'Baz, 25 Yan 2026',
      departLocation: 'GYD - Terminal 1',
      departCity: 'Bakı, Azərbaycan',
      arriveTime: '12:10',
      arriveDate: 'Baz, 25 Yan 2026',
      arriveLocation: 'IST - Terminal 2',
      arriveCity: 'İstanbul, Türkiyə',
      duration: '2s 50dəq',
      stops: 'Birbaşa',
      price: 220,
      class: 'Ekonom',
      seatsLeft: 8,
      refundable: false
    },
    {
      id: 3,
      airline: 'Buta Airways',
      flightNumber: 'J2-2158',
      logo: '🛩️',
      departTime: '18:30',
      departDate: 'Baz, 25 Yan 2026',
      departLocation: 'GYD - Terminal 1',
      departCity: 'Bakı, Azərbaycan',
      arriveTime: '21:15',
      arriveDate: 'Baz, 25 Yan 2026',
      arriveLocation: 'SAW - Terminal 1',
      arriveCity: 'İstanbul, Türkiyə',
      duration: '2s 45dəq',
      stops: 'Birbaşa',
      price: 150,
      class: 'Ekonom',
      seatsLeft: 22,
      refundable: true
    },
    {
      id: 4,
      airline: 'Pegasus',
      flightNumber: 'PC-1145',
      logo: '🦄',
      departTime: '06:40',
      departDate: 'Baz, 25 Yan 2026',
      departLocation: 'GYD - Terminal 1',
      departCity: 'Bakı, Azərbaycan',
      arriveTime: '09:25',
      arriveDate: 'Baz, 25 Yan 2026',
      arriveLocation: 'SAW - Terminal 2',
      arriveCity: 'İstanbul, Türkiyə',
      duration: '2s 45dəq',
      stops: 'Birbaşa',
      price: 165,
      class: 'Ekonom',
      seatsLeft: 5,
      refundable: false
    },
  ];

  const airlines = ['AZAL', 'Turkish Airlines', 'Buta Airways', 'Pegasus'];
  const airports = [
    { code: 'GYD', name: 'Bakı', count: 4 },
    { code: 'IST', name: 'İstanbul', count: 2 },
    { code: 'SAW', name: 'Sabiha Gökçən', count: 2 },
  ];

  const handleStopsFilter = (stop) => {
    setSelectedStops(prev => 
      prev.includes(stop) ? prev.filter(s => s !== stop) : [...prev, stop]
    );
  };

  const handleAirlineFilter = (airline) => {
    setSelectedAirlines(prev =>
      prev.includes(airline) ? prev.filter(a => a !== airline) : [...prev, airline]
    );
  };

  const handleAirportFilter = (airport) => {
    setSelectedAirports(prev =>
      prev.includes(airport) ? prev.filter(a => a !== airport) : [...prev, airport]
    );
  };

  const clearFilters = () => {
    setPriceRange([70, 500]);
    setSelectedStops([]);
    setSelectedAirlines([]);
    setSelectedAirports([]);
  };

  const filteredFlights = flights.filter(flight => {
    const priceMatch = flight.price >= priceRange[0] && flight.price <= priceRange[1];
    const stopsMatch = selectedStops.length === 0 || selectedStops.includes(flight.stops);
    const airlineMatch = selectedAirlines.length === 0 || selectedAirlines.includes(flight.airline);
    return priceMatch && stopsMatch && airlineMatch;
  });

  return (
    <div className="flight-results-page">
      {/* Search Summary Bar */}
      <div className="search-summary-bar">
        <div className="container">
          <div className="summary-content">
            <div className="summary-route">
              <div className="summary-location">
                <FaPlane className="summary-icon" />
                <div>
                  <span className="summary-label">Haradan</span>
                  <span className="summary-value">{searchParams.from}</span>
                </div>
              </div>
              
              <FaExchangeAlt className="summary-swap" />
              
              <div className="summary-location">
                <FaPlane className="summary-icon rotated" />
                <div>
                  <span className="summary-label">Hara</span>
                  <span className="summary-value">{searchParams.to}</span>
                </div>
              </div>
            </div>

            <div className="summary-details">
              <div className="summary-item">
                <span className="summary-label">Tarix</span>
                <span className="summary-value">{searchParams.departure}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Sərnişin</span>
                <span className="summary-value">{searchParams.travelers}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Sinif</span>
                <span className="summary-value">
                  {searchParams.class === 'economy' ? 'Ekonom' : searchParams.class === 'business' ? 'Biznes' : 'Birinci'}
                </span>
              </div>
            </div>

            <button className="btn-modify-search" onClick={() => navigate('/flights')}>
              Dəyişdir
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flight-results-container">
        <div className="container">
          <div className="results-layout">
            {/* Sidebar Filters */}
            <aside className="filters-sidebar">
              <div className="filters-header">
                <h3>
                  <FaFilter /> Filtrlər
                </h3>
                <button className="btn-clear-filters" onClick={clearFilters}>
                  Təmizlə
                </button>
              </div>

              {/* Price Range */}
              <div className="filter-section">
                <h4 className="filter-title">Qiymət Aralığı</h4>
                <div className="price-range-display">
                  ₼{priceRange[0]} - ₼{priceRange[1]}
                </div>
                <input
                  type="range"
                  min="70"
                  max="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="price-range-slider"
                />
              </div>

              {/* Stops Filter */}
              <div className="filter-section">
                <h4 className="filter-title">Dayanacaqlar</h4>
                {['Birbaşa', '1 dayanacaq', '2+ dayanacaq'].map(stop => (
                  <label key={stop} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedStops.includes(stop)}
                      onChange={() => handleStopsFilter(stop)}
                    />
                    <span>{stop}</span>
                  </label>
                ))}
              </div>

              {/* Airlines Filter */}
              <div className="filter-section">
                <h4 className="filter-title">Hava Yolu Şirkəti</h4>
                {airlines.map(airline => (
                  <label key={airline} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedAirlines.includes(airline)}
                      onChange={() => handleAirlineFilter(airline)}
                    />
                    <span>{airline}</span>
                  </label>
                ))}
              </div>

              {/* Airports Filter */}
              <div className="filter-section">
                <h4 className="filter-title">Hava Limanları</h4>
                {airports.map(airport => (
                  <label key={airport.code} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedAirports.includes(airport.code)}
                      onChange={() => handleAirportFilter(airport.code)}
                    />
                    <span>
                      {airport.name} <span className="airport-count">({airport.count})</span>
                    </span>
                  </label>
                ))}
              </div>
            </aside>

            {/* Flights List */}
            <main className="flights-list">
              <div className="results-header">
                <h2>{filteredFlights.length} Uçuş Mövcuddur</h2>
                <p className="results-date">
                  {searchParams.departure} • 1 dayanacaq
                </p>
              </div>

              {/* Guidelines Banner */}
              <div className="guidelines-banner">
                <div className="guidelines-content">
                  <div className="guidelines-icon">✈️</div>
                  <div className="guidelines-text">
                    <h3>Beynəlxalq Qaydalar</h3>
                    <p>COVID təhlükəsizlik tədbirləri, VİZA məhdudiyyətləri və karantin qaydaları</p>
                  </div>
                  <button className="btn-view-guidelines">Qaydaları Oxu</button>
                </div>
              </div>

              {/* Flight Cards */}
              <div className="flights-grid">
                {filteredFlights.map(flight => (
                  <div key={flight.id} className="flight-card">
                    <div className="flight-card-header">
                      <div className="airline-info">
                        <span className="airline-logo">{flight.logo}</span>
                        <div>
                          <div className="airline-name">{flight.airline}</div>
                          <div className="flight-number">{flight.flightNumber}</div>
                        </div>
                      </div>
                      <div className="travel-class">{flight.class}</div>
                    </div>

                    <div className="flight-card-body">
                      <div className="flight-time-info">
                        <div className="time-block">
                          <div className="time-large">{flight.departTime}</div>
                          <div className="time-location">{flight.departLocation}</div>
                          <div className="time-city">{flight.departCity}</div>
                        </div>

                        <div className="flight-duration">
                          <div className="duration-line">
                            <div className="duration-dot"></div>
                            <div className="duration-path"></div>
                            <div className="duration-dot"></div>
                          </div>
                          <div className="duration-text">{flight.duration}</div>
                        </div>

                        <div className="time-block">
                          <div className="time-large">{flight.arriveTime}</div>
                          <div className="time-location">{flight.arriveLocation}</div>
                          <div className="time-city">{flight.arriveCity}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flight-card-footer">
                      <div className="flight-meta">
                        <span className={`seats-left ${flight.seatsLeft < 10 ? 'low' : ''}`}>
                          {flight.seatsLeft < 10 ? `Yalnız ${flight.seatsLeft} yer qalıb` : `${flight.seatsLeft} yer mövcuddur`}
                        </span>
                        <span className={`refund-status ${flight.refundable ? 'refundable' : 'non-refundable'}`}>
                          {flight.refundable ? 'Geri qaytarıla bilər' : 'Geri qaytarılmır'}
                        </span>
                      </div>
                      
                      <div className="flight-price-action">
                        <div className="flight-price">
                          <span className="price-amount">₼{flight.price}</span>
                        </div>
                        <button 
                          className="btn-book-flight"
                          onClick={() => navigate('/flight-booking', { state: { flight } })}
                        >
                          Rezerv Et
                        </button>
                        <button className="btn-flight-details">Ətraflı</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredFlights.length === 0 && (
                <div className="no-flights">
                  <FaTimesCircle />
                  <h3>Uçuş tapılmadı</h3>
                  <p>Filtrləri dəyişib yenidən cəhd edin</p>
                  <button onClick={clearFilters} className="btn-clear-filters-large">
                    Filtrləri Təmizlə
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightResults;
