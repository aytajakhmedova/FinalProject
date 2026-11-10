import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaFeatherAlt, FaFilter, FaGlobe, FaLayerGroup, FaPlane, FaTimesCircle } from 'react-icons/fa';
import CabinPicker from '../../components/common/CabinPicker/CabinPicker';
import { getAirlines, getFlights, getFlightAirports, CABIN_LABELS } from '../../api/client';
import { useSiteContent } from '../../context/SiteContentContext';
import { DEFAULT_FLIGHT_GUIDELINES } from '../../constants/flightGuidelines';
import './FlightResults.css';

const PAGE_SIZE = 3;
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
  const [cabinChoice, setCabinChoice] = useState({});
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [expandedFlight, setExpandedFlight] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError('');
    setPage(1);
    setExpandedFlight(null);
    getFlights({ origin: searchParams.from, destination: searchParams.to, date: searchParams.departure, passengers: searchParams.travelers, cabin: searchParams.class, sort: 'price' })
      .then((data) => { if (active) setFlights(data); })
      .catch((error) => { if (active) { setFlights([]); setLoadError(error.message); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [searchParams.from, searchParams.to, searchParams.departure, searchParams.travelers, searchParams.class]);

  const [airlineList, setAirlineList] = useState([]);
  useEffect(() => {
    let active = true;
    getAirlines().then((data) => { if (active) setAirlineList(data); }).catch(() => {});
    return () => { active = false; };
  }, []);
  const airlines = [...new Set([...airlineList.map((airline) => airline.name), ...flights.map((flight) => flight.airline)])].filter(Boolean);
  const stopOptions = [...new Map(flights.map((flight) => [flight.stopCount, flight.stops])).entries()].sort((a, b) => a[0] - b[0]).map(([, label]) => label);
  const [airports, setAirports] = useState([]);
  useEffect(() => {
    let active = true;
    getFlightAirports({ origin: searchParams.from, destination: searchParams.to, date: searchParams.departure, passengers: searchParams.travelers, cabin: searchParams.class })
      .then((data) => { if (active) setAirports(data); })
      .catch(() => { if (active) setAirports([]); });
    return () => { active = false; };
  }, [searchParams.from, searchParams.to, searchParams.departure, searchParams.travelers, searchParams.class]);

  const toggleFilter = (setFilter, value) => {
    setFilter((previous) => previous.includes(value) ? previous.filter((item) => item !== value) : [...previous, value]);
    setPage(1);
  };
  const clearFilters = () => {
    setPriceRange([0, 2000]); setSelectedStops([]); setSelectedAirlines([]); setSelectedAirports([]); setPage(1);
  };
  const filteredFlights = flights.filter((flight) =>
    flight.price >= priceRange[0] && flight.price <= priceRange[1]
    && (!selectedStops.length || selectedStops.includes(flight.stops))
    && (!selectedAirlines.length || selectedAirlines.includes(flight.airline))
    && (!selectedAirports.length || selectedAirports.includes(flight.originCode) || selectedAirports.includes(flight.destinationCode))
  );
  const pageCount = Math.max(1, Math.ceil(filteredFlights.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const firstIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleFlights = filteredFlights.slice(firstIndex, firstIndex + PAGE_SIZE);
  const pageStart = Math.max(1, Math.min(currentPage - 2, pageCount - 4));
  const pageNumbers = Array.from({ length: Math.min(5, pageCount) }, (_, index) => pageStart + index);
  const goToPage = (next) => {
    setPage(Math.min(pageCount, Math.max(1, next)));
    setExpandedFlight(null);
    listRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  };

  return (
    <div className="flight-results-page">
      <div className="flight-results-container">
        <div className="results-layout">
          <aside className="filters-sidebar" aria-label="Uçuş filtrləri">
            <div className="filters-header"><h2><FaFilter aria-hidden="true" />Filtrlər</h2><button className="btn-clear-filters" onClick={clearFilters}>Təmizlə</button></div>
            <div className="filter-section">
              <h3 className="filter-title">Qiymət Aralığı</h3>
              <div className="price-range-display">₼{priceRange[0]} – ₼{priceRange[1]}</div>
              <div className="flight-price-range" style={{ '--range-start': `${priceRange[0] / 20}%`, '--range-end': `${priceRange[1] / 20}%` }}>
                <div className="flight-price-track" />
                <input type="range" min="0" max="2000" value={priceRange[0]} aria-label="Minimum qiymət" onChange={(event) => { setPriceRange([Math.min(Number(event.target.value), priceRange[1]), priceRange[1]]); setPage(1); }} />
                <input type="range" min="0" max="2000" value={priceRange[1]} aria-label="Maksimum qiymət" onChange={(event) => { setPriceRange([priceRange[0], Math.max(Number(event.target.value), priceRange[0])]); setPage(1); }} />
              </div>
            </div>
            <div className="filter-section"><h3 className="filter-title">Dayanacaqlar</h3>{stopOptions.map((stop) => <label key={stop} className="filter-checkbox"><input type="checkbox" checked={selectedStops.includes(stop)} onChange={() => toggleFilter(setSelectedStops, stop)} /><span>{stop}</span></label>)}</div>
            <div className="filter-section"><h3 className="filter-title">Hava Yolu Şirkəti</h3>{airlines.map((airline) => <label key={airline} className="filter-checkbox"><input type="checkbox" checked={selectedAirlines.includes(airline)} onChange={() => toggleFilter(setSelectedAirlines, airline)} /><span>{airline}</span></label>)}</div>
            <div className="filter-section"><h3 className="filter-title">Hava Limanları</h3>{airports.map((airport) => <label key={airport.code} className="filter-checkbox"><input type="checkbox" checked={selectedAirports.includes(airport.code)} onChange={() => toggleFilter(setSelectedAirports, airport.code)} /><span>{airport.name} <span className="airport-count">({airport.count})</span></span></label>)}</div>
          </aside>
          <main className="flights-list" ref={listRef}>
            <header className="results-header"><h1><FaPlane aria-hidden="true" />Uçuşlar</h1><p>Səyahətiniz üçün ən uyğun uçuşları seçin.</p>{searchParams.departure && <p className="results-date">{searchParams.departure}</p>}</header>
            <section className="guidelines-banner" aria-labelledby="flight-guidelines-title">
              <div className="guidelines-content"><FaGlobe className="guidelines-icon" aria-hidden="true" /><div className="guidelines-text"><h2 id="flight-guidelines-title">{siteSettings.flightGuidelinesTitle || 'Beynəlxalq Qaydalar'}</h2><p>{siteSettings.flightGuidelinesSummary || 'COVID təhlükəsizlik tədbirləri, VİZA məhdudiyyətləri və karantin qaydaları'}</p></div><button type="button" className="btn-view-guidelines" aria-expanded={showGuidelines} aria-controls="flight-guidelines-text" onClick={() => setShowGuidelines((value) => !value)}>{showGuidelines ? 'Bağla' : 'Qaydaları Oxu'}</button></div>
              {showGuidelines && <div className="guidelines-full" id="flight-guidelines-text">{siteSettings.flightGuidelinesText || DEFAULT_FLIGHT_GUIDELINES}</div>}
            </section>
            {loading && <p className="flight-results-status" role="status">Uçuşlar yüklənir...</p>}
            {!loading && loadError && <p className="flight-results-status" role="alert">{loadError}</p>}
            {!loading && !loadError && <>
              <div className="flights-grid">
                {visibleFlights.map((flight) => {
                  const chosenClass = cabinChoice[flight.id] || flight.cabinClass;
                  const chosen = (flight.cabins || []).find((item) => item.cabinClass === chosenClass) || { cabinClass: flight.cabinClass, price: flight.price, seatsAvailable: flight.seatsLeft };
                  const party = Number(searchParams.travelers) || 1;
                  const cabinLabel = CABIN_LABELS[chosen.cabinClass] || flight.class;
                  const airlineStyle = /pegasus/i.test(flight.airline) ? 'pegasus' : /turkish/i.test(flight.airline) ? 'turkish' : /azal/i.test(flight.airline) ? 'azal' : '';
                  return <article key={flight.id} className="flight-card" aria-label={`${flight.airline} ${flight.flightNumber}`}>
                    <div className="flight-airline-column">
                      <div className="airline-info"><span className={`airline-logo ${airlineStyle}`} aria-hidden="true">{airlineStyle === 'pegasus' ? 'P' : airlineStyle === 'azal' ? <FaFeatherAlt /> : <FaPlane />}</span><div><h2 className="airline-name">{flight.airline}</h2><p className="flight-number">{flight.flightNumber}</p></div></div>
                      <div className="flight-meta"><CabinPicker cabins={flight.cabins?.length ? flight.cabins : [{ ...chosen, label: cabinLabel }]} value={chosen.cabinClass} party={party} onChange={(next) => setCabinChoice((previous) => ({ ...previous, [flight.id]: next }))} /><div className="flight-availability"><span className="seats-left">{chosen.seatsAvailable} yer mövcuddur</span><span className={`refund-status ${flight.refundable ? 'refundable' : 'non-refundable'}`}>{flight.refundable ? 'Geri qaytarıla bilər' : 'Geri qaytarılmır'}</span></div></div>
                    </div>
                    <div className="flight-route-column"><span className="travel-class">{cabinLabel}</span><div className="flight-time-info"><div className="time-block"><strong className="time-large">{flight.departTime}</strong><span className="time-location">{flight.departLocation}</span><span className="time-city">{flight.departCity}</span></div><div className="flight-duration"><div className="duration-line" aria-hidden="true"><span /><FaPlane /><span /></div><span className="duration-text">{flight.duration}</span></div><div className="time-block"><strong className="time-large">{flight.arriveTime}</strong><span className="time-location">{flight.arriveLocation}</span><span className="time-city">{flight.arriveCity}</span></div></div></div>
                    <div className="flight-price-action"><div className="flight-price"><span>₼</span><strong>{chosen.price}</strong></div><button className="btn-book-flight" disabled={chosen.seatsAvailable < party} onClick={() => navigate('/flight-booking', { state: { flight: { ...flight, cabinClass: chosen.cabinClass, class: cabinLabel, price: chosen.price, seatsAvailable: chosen.seatsAvailable } } })}><FaPlane aria-hidden="true" />Rezerv Et</button><button className="btn-flight-details" aria-expanded={expandedFlight === flight.id} aria-controls={`flight-details-${flight.id}`} onClick={() => setExpandedFlight(expandedFlight === flight.id ? null : flight.id)}>{expandedFlight === flight.id ? 'Bağla' : 'Ətraflı'}</button></div>
                    {expandedFlight === flight.id && <div className="flight-expanded-details" id={`flight-details-${flight.id}`}><span><strong>Marşrut:</strong> {flight.departCity} → {flight.arriveCity}</span><span><strong>Dayanacaqlar:</strong> {flight.stops}</span><span><strong>Sinif:</strong> {cabinLabel}</span>{flight.departureAt && <span><strong>Tarix:</strong> {new Date(flight.departureAt).toLocaleDateString('az-AZ')}</span>}</div>}
                  </article>;
                })}
              </div>
              {filteredFlights.length > 0 ? <div className="flight-pagination"><p role="status"><FaPlane aria-hidden="true" />{firstIndex + 1} – {Math.min(firstIndex + PAGE_SIZE, filteredFlights.length)} / {filteredFlights.length} uçuş göstərilir</p><nav aria-label="Uçuş səhifələri"><button aria-label="Əvvəlki səhifə" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}><FaChevronLeft /></button>{pageNumbers.map((number) => <button key={number} aria-label={`Səhifə ${number}`} aria-current={currentPage === number ? 'page' : undefined} onClick={() => goToPage(number)}>{number}</button>)}<button aria-label="Növbəti səhifə" disabled={currentPage === pageCount} onClick={() => goToPage(currentPage + 1)}><FaChevronRight /></button></nav><p className="flight-page-size"><FaLayerGroup aria-hidden="true" />Hər səhifədə 3 uçuş</p></div> : <div className="no-flights"><FaTimesCircle aria-hidden="true" /><h2>Uçuş tapılmadı</h2><p>Filtrləri dəyişib yenidən cəhd edin</p><button onClick={clearFilters} className="btn-clear-filters-large">Filtrləri Təmizlə</button></div>}
            </>}
          </main>
        </div>
      </div>
    </div>
  );
};
export default FlightResults;
