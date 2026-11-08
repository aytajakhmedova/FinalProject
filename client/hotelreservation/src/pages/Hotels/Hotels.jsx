import Select from '../../components/common/Select/Select';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilter, FaSort } from 'react-icons/fa';
import HotelCard from '../../components/common/HotelCard/HotelCard';
import { getHotels, getHotelFilterOptions, resolveImage } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteContent } from '../../context/SiteContentContext';
import './Hotels.css';

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
  // The type and amenity lists come from the hotels in the database
  const [filterOptions, setFilterOptions] = useState({ hotelTypes: [], amenities: [] });

  useEffect(() => {
    getHotelFilterOptions()
      .then((data) => setFilterOptions({ hotelTypes: data.hotelTypes || [], amenities: data.amenities || [] }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
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
        setHotels(data);
      })
      .catch((error) => {
        if (!active) return;
        setHotels([]);
        setLoadError(error.message || t('hotels.loadError'));
      });
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
          <p className="hotels-hero-subtitle">
            {loadError || t('hotels.found', { count: sortedHotels.length })}
          </p>
        </div>
      </section>

      {/* Search Header */}
      <section className="hotels-search-section">
        <div className="hotels-container">
          <div className="hotels-search-bar">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder={t('hotels.searchPh')}
                value={searchParams.get('location') || ''}
                onChange={(e) => updateStayParams({ location: e.target.value, country: '' })}
                className="search-input"
              />
            </div>
            <input
              type="date"
              className="stay-date-input"
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value);
                updateStayParams({ checkIn: e.target.value });
              }}
            />
            <input
              type="date"
              className="stay-date-input"
              min={checkIn}
              value={checkOut}
              onChange={(e) => {
                setCheckOut(e.target.value);
                updateStayParams({ checkOut: e.target.value });
              }}
            />
            <Select
              className="stay-guests-input"
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
            <button 
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
              <span>{t('hotels.filters')}</span>
            </button>
          </div>
        </div>
      </section>

      <div className="hotels-container">
        <div className="hotels-content">
          {/* Filter Sidebar */}
          <aside className={`hotels-filters ${showFilters ? 'show-mobile' : ''}`}>
            <div className="filter-header">
              <h3>{t('hotels.filters')}</h3>
              <button 
                className="close-filters"
                onClick={() => setShowFilters(false)}
              >
                ✕
              </button>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <h4>{t('hotels.priceRange')}</h4>
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
                {[5, 4, 3].map(star => (
                  <label key={star} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.stars.includes(star)}
                      onChange={() => toggleFilter('stars', star)}
                    />
                    <span>{t('hotels.starN', { n: star })}</span>
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
            <div className="filter-group">
              <h4>{t('hotels.amenities')}</h4>
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
            </div>

            <button 
              className="reset-filters-btn"
              onClick={() => {
                setFilters({ priceRange: [0, 2000], stars: [], amenities: [], hotelType: [] });
                updateStayParams({ location: '', country: '' });
              }}
            >
              {t('hotels.reset')}
            </button>
          </aside>

          {/* Hotel Grid */}
          <div className="hotels-main">
            {/* Sort Bar */}
            <div className="hotels-sort-bar">
              <div className="sort-group">
                <FaSort />
                <Select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="recommended">{t('hotels.recommended')}</option>
                  <option value="price-low">{t('hotels.priceLow')}</option>
                  <option value="price-high">{t('hotels.priceHigh')}</option>
                  <option value="rating">{t('hotels.rating')}</option>
                </Select>
              </div>
            </div>

            {/* Hotels Grid */}
            {loadError && <div className="no-results"><h3>{loadError}</h3></div>}

            {sortedHotels.length > 0 ? (
              <div className="hotels-grid">
                {sortedHotels.map(hotel => (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotels;
