import Select from '../../components/common/Select/Select';
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaSlidersH, FaHotel, FaStar, FaRegStar, FaThLarge, FaList, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import HotelCard from '../../components/common/HotelCard/HotelCard';
import { getHotels, getHotelFilterOptions, resolveImage } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteContent } from '../../context/SiteContentContext';
import './Hotels.css';

const PAGE_SIZE = 6;

const Hotels = () => {
  const { t } = useLanguage();
  const { content: siteContent } = useSiteContent();
  const heroVideo = resolveImage(siteContent?.settings?.hotelsPageVideoUrl);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    // A price range picked on the home page is already applied by the server, so keep the
    // local slider wide enough not to hide those hotels.
    priceRange: [0, searchParams.get('maxPrice') ? 100000 : 2000],
    stars: [],
    amenities: [],
    hotelType: []
  });
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '2');
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const resultsRef = useRef(null);
  // The type and amenity lists come from the hotels in the database
  const [filterOptions, setFilterOptions] = useState({ hotelTypes: [], amenities: [] });

  useEffect(() => {
    getHotelFilterOptions()
      .then((data) => setFilterOptions({ hotelTypes: data.hotelTypes || [], amenities: data.amenities || [] }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getHotels({ city: searchParams.get('country') ? undefined : searchParams.get('location'),
      country: searchParams.get('country'), checkIn, checkOut, guests: searchParams.get('guests'),
      adults: searchParams.get('adults'), children: searchParams.get('children'), rooms: searchParams.get('rooms'),
      // Price, stars, type and amenities are filtered by the server. A range picked on the home page
      // (kept in its own currency) applies until the sliders are touched.
      ...(filters.priceRange[1] === 100000 && searchParams.get('maxPrice')
        ? { minPrice: searchParams.get('minPrice'), maxPrice: searchParams.get('maxPrice'), currency: searchParams.get('currency') }
        : { minPrice: filters.priceRange[0] || undefined, maxPrice: filters.priceRange[1] }),
      stars: filters.stars.join(',') || undefined,
      hotelTypes: filters.hotelType.join(',') || undefined,
      amenities: filters.amenities.join(',') || undefined })
      .then((data) => {
        if (!active) return;
        setLoadError('');
        // Filter out Maldives hotels
        const filteredData = data.filter(hotel => {
          const country = hotel.country?.toLowerCase() || '';
          return !country.includes('maldiv') && !country.includes('maldives');
        });
        setHotels(filteredData);
        setPage(1);
      })
      .catch((error) => {
        if (!active) return;
        setHotels([]);
        setLoadError(error.message || t('hotels.loadError'));
        setPage(1);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => {
      active = false;
    };
  }, [checkIn, checkOut, guests, searchParams, filters]);

  const guestCount = parseInt(guests, 10) || 1;

  const updateStayParams = (next) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    setSearchParams(params);
  };

  // Known values keep their translation; a value an admin typed is shown as written
  const TYPE_KEYS = { 'Lüks': 'hotels.typeLuxury', Wellness: 'hotels.typeWellness', 'Ailə': 'hotels.typeFamily', 'Şəhər': 'hotels.typeCity' };
  const AMENITY_KEYS = { Spa: 'hotels.amSpa', Hovuz: 'hotels.amPool', 'Wi-Fi': 'hotels.amWifi', Restoran: 'hotels.amRest', Fitness: 'hotels.amFit', Plaj: 'hotels.amBeach', Parking: 'hotels.amPark', Bar: 'hotels.amBar' };
  const labelOf = (keys, value) => (keys[value] ? t(keys[value]) : value);
  const hotelTypes = filterOptions.hotelTypes.map((value) => ({ value, label: labelOf(TYPE_KEYS, value) }));
  const allAmenities = filterOptions.amenities.map((value) => ({ value, label: labelOf(AMENITY_KEYS, value) }));

  const filteredHotels = hotels;

  const sortedHotels = [...filteredHotels].sort((a, b) => {
    switch(sortBy) {
      case 'price-low': return a.pricePerNight - b.pricePerNight;
      case 'price-high': return b.pricePerNight - a.pricePerNight;
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  const toggleFilter = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value]
    }));
  };

  const resetFilters = () => {
    setFilters({ priceRange: [0, 2000], stars: [], amenities: [], hotelType: [] });
    updateStayParams({ location: '', country: '' });
    setPage(1);
  };
  const totalPages = Math.max(1, Math.ceil(sortedHotels.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const visibleHotels = sortedHotels.slice(pageStart, pageStart + PAGE_SIZE);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter(number => totalPages <= 7 || number === 1 || number === totalPages || Math.abs(number - currentPage) <= 1);
  const scrollToResults = () => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const changePage = (nextPage) => {
    setPage(Math.max(1, Math.min(nextPage, totalPages)));
    scrollToResults();
  };
  const resultLabel = loading ? t('common.loading') : loadError || t('hotels.found', { count: sortedHotels.length });

  return (
    <div className="hotels-page">
      {/* Hero Section with Video */}
      <section className="hotels-hero">
        {heroVideo && (
          <video
            className="hotels-hero-video"
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
          />
        )}
        <div className="hotels-hero-overlay"></div>
        <div className="hotels-hero-content">
          <h1 className="hotels-hero-title">{t('hotels.title')}</h1>
          <div className="hotels-hero-ornament" aria-hidden="true"><span /><FaHotel /><span /></div>
          <p className="hotels-hero-subtitle">
            {resultLabel}
          </p>
        </div>
      </section>

      {/* Search Header */}
      <section className="hotels-search-section">
        <div className="hotels-container">
          <form className="hotels-search-bar" onSubmit={(event) => { event.preventDefault(); setPage(1); scrollToResults(); }}>
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder={t('hotels.searchPh')}
                value={searchParams.get('location') || ''}
                onChange={(e) => updateStayParams({ location: e.target.value, country: '' })}
                className="search-input"
                aria-label={t('hotels.searchPh')}
              />
            </div>
            <label className="hotels-date-field">
              {!checkIn && <span>Giriş tarixi</span>}
            <input
              type="date"
              className="stay-date-input"
              aria-label={t('search.checkIn')}
              data-empty={!checkIn}
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value);
                updateStayParams({ checkIn: e.target.value });
              }}
            />
            </label>
            <label className="hotels-date-field">
              {!checkOut && <span>Çıxış tarixi</span>}
            <input
              type="date"
              className="stay-date-input"
              aria-label={t('search.checkOut')}
              data-empty={!checkOut}
              min={checkIn}
              value={checkOut}
              onChange={(e) => {
                setCheckOut(e.target.value);
                updateStayParams({ checkOut: e.target.value });
              }}
            />
            </label>
            <Select
              className="stay-guests-input"
              aria-label={t('search.guests')}
              value={guests}
              onChange={(e) => {
                setGuests(e.target.value);
                const kids = Math.min(Number(searchParams.get('children') || 0), Number(e.target.value) - 1);
                updateStayParams({ guests: e.target.value, adults: String(Number(e.target.value) - kids), children: String(kids) });
              }}
            >
              {[...new Set([1, 2, 3, 4, 5, 6, guestCount])].sort((a, b) => a - b).map((n) => (
                <option key={n} value={n}>{t('hotels.guestsN', { n })}</option>
              ))}
            </Select>
            <button type="submit" className="hotels-search-submit">{t('search.search')}</button>
          </form>
            <button 
              className="filter-toggle-btn"
              type="button"
              aria-expanded={showFilters}
              aria-controls="hotels-filter-panel"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaSlidersH />
              <span>{t('hotels.filters')}</span>
            </button>
        </div>
      </section>

      <div className="hotels-container">
        <div className="hotels-content">
          {/* Filter Sidebar */}
          <aside id="hotels-filter-panel" className={`hotels-filters ${showFilters ? 'show-mobile' : ''}`}>
            <div className="filter-header">
              <h3><FaSlidersH aria-hidden="true" />{t('hotels.filters')}</h3>
              <button type="button" className="reset-filters-btn" onClick={resetFilters}>Sıfırla</button>
              <button 
                className="close-filters"
                type="button"
                aria-label="Filtrləri bağla"
                onClick={() => setShowFilters(false)}
              >
                ✕
              </button>
            </div>

            <div className="hotels-filter-fields">
            {/* Price Range */}
            <div className="filter-group">
              <h4>{t('hotels.priceRange')}</h4>
              <div className="hotels-price-sliders">
                <input type="range" aria-label="Minimum qiymət" min="0" max="2000" step="10"
                  value={Math.min(filters.priceRange[0], 2000)}
                  onChange={(event) => setFilters(prev => ({ ...prev, priceRange: [Math.min(Number(event.target.value), prev.priceRange[1]), prev.priceRange[1]] }))} />
                <input type="range" aria-label="Maksimum qiymət" min="0" max="2000" step="10"
                  value={Math.min(filters.priceRange[1], 2000)}
                  onChange={(event) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], Math.max(Number(event.target.value), prev.priceRange[0])] }))} />
              </div>
              <div className="price-inputs">
                <label className="price-field">
                  <span className="price-field-label">Min</span>
                  <div className="price-field-control">
                    <input
                      type="number"
                      min="0"
                      max="2000"
                      value={filters.priceRange[0]}
                      onChange={(e) => setFilters({
                        ...filters,
                        priceRange: [Number(e.target.value), filters.priceRange[1]]
                      })}
                      placeholder="0"
                    />
                    <span className="price-currency">₼</span>
                  </div>
                </label>
                <span className="price-separator">—</span>
                <label className="price-field">
                  <span className="price-field-label">Max</span>
                  <div className="price-field-control">
                    <input
                      type="number"
                      min="0"
                      max="2000"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters({
                        ...filters,
                        priceRange: [filters.priceRange[0], Number(e.target.value)]
                      })}
                      placeholder="2000"
                    />
                    <span className="price-currency">₼</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Star Rating */}
            <div className="filter-group">
              <h4>{t('hotels.starsLabel')}</h4>
              <div className="checkbox-group">
                {[5, 4, 3, 2, 1].map(star => (
                  <label key={star} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.stars.includes(star)}
                      aria-label={t('hotels.starN', { n: star })}
                      onChange={() => toggleFilter('stars', star)}
                    />
                    <span className="hotels-filter-stars" aria-hidden="true">{[1, 2, 3, 4, 5].map(value => value <= star ? <FaStar key={value} /> : <FaRegStar key={value} />)}</span>
                    <span className="hotels-star-count" aria-hidden="true">({star})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hotel Type */}
            <div className="filter-group">
              <h4>{t('hotels.type')}</h4>
              <div className="checkbox-group">
                {hotelTypes.map(type => (
                  <label key={type.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.hotelType.includes(type.value)}
                      onChange={() => toggleFilter('hotelType', type.value)}
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <details className="filter-group hotels-amenities-filter">
              <summary>{t('hotels.amenities')}{filters.amenities.length > 0 && ` (${filters.amenities.length})`}</summary>
              <div className="checkbox-group">
                {allAmenities.map(amenity => (
                  <label key={amenity.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(amenity.value)}
                      onChange={() => toggleFilter('amenities', amenity.value)}
                    />
                    <span>{amenity.label}</span>
                  </label>
                ))}
              </div>
            </details>

            </div>
            <button 
              type="button"
              className="hotels-apply-filters"
              onClick={() => { setShowFilters(false); scrollToResults(); }}
            >
              Filtrləri tətbiq et
            </button>
          </aside>

          {/* Hotel Grid */}
          <div className="hotels-main" ref={resultsRef} aria-busy={loading}>
            {/* Sort Bar */}
            <div className="hotels-sort-bar">
              <p className="hotels-result-count" role="status">{resultLabel}</p>
              <div className="hotels-display-controls">
              <div className="sort-group">
                <span>Sıralama:</span>
                <Select 
                  aria-label="Otelləri sırala"
                  value={sortBy} 
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="sort-select"
                >
                  <option value="recommended">{t('hotels.recommended')}</option>
                  <option value="price-low">{t('hotels.priceLow')}</option>
                  <option value="price-high">{t('hotels.priceHigh')}</option>
                  <option value="rating">{t('hotels.rating')}</option>
                </Select>
              </div>
              <div className="hotels-view-toggle" role="group" aria-label="Görünüş">
                <button type="button" aria-label="Kart görünüşü" aria-pressed={viewMode === 'grid'} onClick={() => setViewMode('grid')}><FaThLarge /></button>
                <button type="button" aria-label="Siyahı görünüşü" aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')}><FaList /></button>
              </div>
              </div>
            </div>

            {/* Hotels Grid */}
            {loading ? <div className="no-results" role="status">{t('common.loading')}</div> : loadError ? (
              <div className="no-results" role="alert"><h3>{loadError}</h3></div>
            ) : sortedHotels.length > 0 ? (
              <div className={`hotels-grid${viewMode === 'list' ? ' hotels-grid-list' : ''}`}>
                {visibleHotels.map(hotel => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    currency="AZN"
                    queryString={searchParams.toString() ? `?${searchParams.toString()}` : ''}
                  />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h3>{t('hotels.noResults')}</h3>
                <p>{t('hotels.noResultsHint')}</p>
              </div>
            )}
            {!loading && !loadError && sortedHotels.length > 0 && (
              <div className="hotels-pagination-bar">
                <p>{pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, sortedHotels.length)} / {sortedHotels.length} otel</p>
                {totalPages > 1 && <nav className="hotels-pagination" aria-label="Otellərin səhifələri">
                  <button type="button" aria-label={t('feat.prev')} disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}><FaChevronLeft /></button>
                  {pageNumbers.map((number, index) => <React.Fragment key={number}>
                    {index > 0 && number - pageNumbers[index - 1] > 1 && <span className="pagination-gap" aria-hidden="true">…</span>}
                    <button type="button" aria-label={`Səhifə ${number}`} aria-current={currentPage === number ? 'page' : undefined} onClick={() => changePage(number)}>{number}</button>
                  </React.Fragment>)}
                  <button type="button" aria-label={t('feat.next')} disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}><FaChevronRight /></button>
                </nav>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotels;
