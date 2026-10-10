import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilter, FaSort } from 'react-icons/fa';
import HotelCard from '../../components/common/HotelCard/HotelCard';
import { getHotels } from '../../data/hotelsData';
import { hotelHasAvailability } from '../../data/roomsData';
import { useLanguage } from '../../context/LanguageContext';
import './Hotels.css';

const Hotels = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('location') || '',
    priceRange: [0, 2000],
    stars: [],
    amenities: [],
    hotelType: []
  });
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '2');
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);

  const hotels = getHotels();
  const guestCount = parseInt(guests, 10) || 1;

  const updateStayParams = (next) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    setSearchParams(params);
  };

  const allAmenities = ['Spa', 'Hovuz', 'Wi-Fi', 'Restoran', 'Fitness', 'Plaj', 'Parking', 'Bar'];
  const hotelTypes = ['Lüks', 'Wellness', 'Ailə', 'Şəhər'];

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         hotel.city.toLowerCase().includes(filters.search.toLowerCase());
    const matchesPrice = hotel.pricePerNight >= filters.priceRange[0] && 
                        hotel.pricePerNight <= filters.priceRange[1];
    const matchesStars = filters.stars.length === 0 || filters.stars.includes(hotel.stars);
    const matchesAmenities = filters.amenities.length === 0 || 
                            filters.amenities.every(a => hotel.amenities.includes(a));
    const matchesType = filters.hotelType.length === 0 || filters.hotelType.includes(hotel.hotelType);
    const matchesStay = hotelHasAvailability(hotel, checkIn, checkOut, guestCount);
    
    return matchesSearch && matchesPrice && matchesStars && matchesAmenities && matchesType && matchesStay;
  });

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
      {/* Search Header */}
      <section className="hotels-search-section">
        <div className="hotels-container">
          <h1 className="hotels-page-title">{t('hotels.title')}</h1>
          <p className="hotels-page-subtitle">
            {t('hotels.found', { count: sortedHotels.length })}
          </p>

          <div className="hotels-search-bar">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder={t('hotels.searchPh')}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
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
            <select
              className="stay-guests-input"
              value={guests}
              onChange={(e) => {
                setGuests(e.target.value);
                updateStayParams({ guests: e.target.value });
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n} qonaq</option>
              ))}
            </select>
            <button 
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
              <span>Filtrlər</span>
            </button>
          </div>
        </div>
      </section>

      <div className="hotels-container">
        <div className="hotels-content">
          {/* Filter Sidebar */}
          <aside className={`hotels-filters ${showFilters ? 'show-mobile' : ''}`}>
            <div className="filter-header">
              <h3>Filtrlər</h3>
              <button 
                className="close-filters"
                onClick={() => setShowFilters(false)}
              >
                ✕
              </button>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <h4>Qiymət aralığı</h4>
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
              <h4>Ulduz reytinqi</h4>
              <div className="checkbox-group">
                {[5, 4, 3].map(star => (
                  <label key={star} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.stars.includes(star)}
                      onChange={() => toggleFilter('stars', star)}
                    />
                    <span>{star} ulduz</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hotel Type */}
            <div className="filter-group">
              <h4>Otel tipi</h4>
              <div className="checkbox-group">
                {hotelTypes.map(type => (
                  <label key={type} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.hotelType.includes(type)}
                      onChange={() => toggleFilter('hotelType', type)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="filter-group">
              <h4>İmkanlar</h4>
              <div className="checkbox-group">
                {allAmenities.map(amenity => (
                  <label key={amenity} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(amenity)}
                      onChange={() => toggleFilter('amenities', amenity)}
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              className="reset-filters-btn"
              onClick={() => setFilters({
                search: '',
                priceRange: [0, 2000],
                stars: [],
                amenities: [],
                hotelType: []
              })}
            >
              Filtrləri sıfırla
            </button>
          </aside>

          {/* Hotel Grid */}
          <div className="hotels-main">
            {/* Sort Bar */}
            <div className="hotels-sort-bar">
              <div className="sort-group">
                <FaSort />
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="recommended">{t('hotels.recommended')}</option>
                  <option value="price-low">{t('hotels.priceLow')}</option>
                  <option value="price-high">{t('hotels.priceHigh')}</option>
                  <option value="rating">{t('hotels.rating')}</option>
                </select>
              </div>
            </div>

            {/* Hotels Grid */}
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
                <h3>Nəticə tapılmadı</h3>
                <p>Axtarış və ya filtr parametrlərini dəyişdirməyə cəhd edin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotels;
