import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaFilter, FaTimesCircle } from 'react-icons/fa';
import CabinPicker from '../../components/common/CabinPicker/CabinPicker';
import { getAirlines, getFlights, getFlightAirports, CABIN_LABELS } from '../../api/client';
import { useSiteContent } from '../../context/SiteContentContext';
import { DEFAULT_FLIGHT_GUIDELINES } from '../../constants/flightGuidelines';
import './FlightResults.css';

const FlightResults = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const { content: siteContent } = useSiteContent();
  const siteSettings = siteContent?.settings || {};
  const [showGuidelines, setShowGuidelines] = useState(false);
  const searchParams = {
    from: query.get('origin') || query.get('from') || '',
    to: query.get('destination') || query.get('to') || '',
    departure: query.get('date') || query.get('departure') || '',
    travelers: query.get('passengers') || query.get('travelers') || '1',
    class: query.get('cabin') || query.get('class') || '',
  };

  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedAirports, setSelectedAirports] = useState([]);

  const [flights, setFlights] = useState([]);
  // The class picked on each flight card (flight id -> class); the server's choice is the default.
  const [cabinChoice, setCabinChoice] = useState({});
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    getFlights({
      origin: searchParams.from,
      destination: searchParams.to,
      date: searchParams.departure,
      passengers: searchParams.travelers,
      cabin: searchParams.class,
      sort: 'price',
    })
      .then((data) => {
        if (active) setFlights(data);
      })
      .catch((error) => {
        if (active) setLoadError(error.message);
      });
    return () => {
      active = false;
    };
  }, [searchParams.from, searchParams.to, searchParams.departure, searchParams.class]);

  // The airline filter lists the airlines admins created, not just the ones in the current results.
  const [airlineList, setAirlineList] = useState([]);
  useEffect(() => {
    getAirlines().then(setAirlineList).catch(() => setAirlineList([]));
  }, []);
  const airlines = airlineList.map((airline) => airline.name);
  // Stop options are the ones the found flights actually have, fewest stops first.
  const stopOptions = [...new Map(flights.map((flight) => [flight.stopCount, flight.stops])).entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, label]) => label);

  // Airports and their flight counts are calculated by the server for the same search.
  const [airports, setAirports] = useState([]);
  useEffect(() => {
    let active = true;
    getFlightAirports({
      origin: searchParams.from,
      destination: searchParams.to,
      date: searchParams.departure,
      passengers: searchParams.travelers,
      cabin: searchParams.class,
    })
      .then((data) => active && setAirports(data))
      .catch(() => active && setAirports([]));
    return () => {
      active = false;
    };
  }, [searchParams.from, searchParams.to, searchParams.departure, searchParams.class]);

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
    setPriceRange([0, 2000]);
    setSelectedStops([]);
    setSelectedAirlines([]);
    setSelectedAirports([]);
  };

  const filteredFlights = flights.filter(flight => {
    const priceMatch = flight.price >= priceRange[0] && flight.price <= priceRange[1];
    const stopsMatch = selectedStops.length === 0 || selectedStops.includes(flight.stops);
    const airlineMatch = selectedAirlines.length === 0 || selectedAirlines.includes(flight.airline);
    const airportMatch = selectedAirports.length === 0
      || selectedAirports.includes(flight.originCode) || selectedAirports.includes(flight.destinationCode);
    return priceMatch && stopsMatch && airlineMatch && airportMatch;
  });

  return (
    <div className="flight-results-page">
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
                {stopOptions.map(stop => (
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
                  {searchParams.departure}
                </p>
              </div>

              {/* Guidelines Banner */}
              <div className="guidelines-banner">
                <div className="guidelines-content">
                  <div className="guidelines-icon">✈️</div>
                  <div className="guidelines-text">
                    <h3>{siteSettings.flightGuidelinesTitle || 'Beynəlxalq Qaydalar'}</h3>
                    <p>{siteSettings.flightGuidelinesSummary || 'COVID təhlükəsizlik tədbirləri, VİZA məhdudiyyətləri və karantin qaydaları'}</p>
                  </div>
                  <button type="button" className="btn-view-guidelines" onClick={() => setShowGuidelines((v) => !v)}>{showGuidelines ? 'Bağla' : 'Qaydaları Oxu'}</button>
                </div>
                {showGuidelines && (
                  <div className="guidelines-full" style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                    {siteSettings.flightGuidelinesText || DEFAULT_FLIGHT_GUIDELINES}
                  </div>
                )}
              </div>

              {/* Flight Cards */}
              <div className="flights-grid">
                {filteredFlights.map(flight => {
                  const chosenClass = cabinChoice[flight.id] || flight.cabinClass;
                  const chosen = (flight.cabins || []).find((item) => item.cabinClass === chosenClass)
                    || { cabinClass: flight.cabinClass, price: flight.price, seatsAvailable: flight.seatsLeft };
                  const party = Number(searchParams.travelers) || 1;
                  return (
                  <div key={flight.id} className="flight-card">
                    <div className="flight-card-header">
                      <div className="airline-info">
                        <span className="airline-logo">{flight.logo}</span>
                        <div>
                          <div className="airline-name">{flight.airline}</div>
                          <div className="flight-number">{flight.flightNumber}</div>
                        </div>
                      </div>
                      <div className="travel-class">{CABIN_LABELS[chosen.cabinClass] || flight.class}</div>
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
                        <CabinPicker
                          cabins={flight.cabins}
                          value={chosen.cabinClass}
                          party={party}
                          onChange={(next) => setCabinChoice((prev) => ({ ...prev, [flight.id]: next }))}
                        />
                        <span className={`seats-left ${chosen.seatsAvailable < 10 ? 'low' : ''}`}>
                          {chosen.seatsAvailable < 10 ? `Yalnız ${chosen.seatsAvailable} yer qalıb` : `${chosen.seatsAvailable} yer mövcuddur`}
                        </span>
                        <span className={`refund-status ${flight.refundable ? 'refundable' : 'non-refundable'}`}>
                          {flight.refundable ? 'Geri qaytarıla bilər' : 'Geri qaytarılmır'}
                        </span>
                      </div>
                      
                      <div className="flight-price-action">
                        <div className="flight-price">
                          <span className="price-amount">₼{chosen.price}</span>
                        </div>
                        <button 
                          className="btn-book-flight"
                          onClick={() => navigate('/flight-booking', {
                            state: {
                              flight: {
                                ...flight,
                                cabinClass: chosen.cabinClass,
                                class: CABIN_LABELS[chosen.cabinClass] || flight.class,
                                price: chosen.price,
                                seatsAvailable: chosen.seatsAvailable,
                              },
                            },
                          })}
                        >
                          Rezerv Et
                        </button>
                        <button className="btn-flight-details">Ətraflı</button>
                      </div>
                    </div>
                  </div>
                  );
                })}
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