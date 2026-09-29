import React, { useState } from 'react';
import { FaSearch, FaFilter, FaSort } from 'react-icons/fa';
import HotelCard from '../../components/common/HotelCard/HotelCard';
import { HOTELS_EXTENDED } from '../../data/hotelsData';
import './Hotels.css';

const Hotels = () => {
  const [filters, setFilters] = useState({
    search: '',
    priceRange: [0, 2000],
    stars: [],
    amenities: [],
    hotelType: []
  });
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);

  const allAmenities = ['Spa', 'Hovuz', 'Wi-Fi', 'Restoran', 'Fitness', 'Plaj', 'Parking', 'Bar'];
  const hotelTypes = ['Lüks', 'Wellness', 'Ailə', 'Şəhər'];

  const filteredHotels = HOTELS_EXTENDED.filter(hotel => {
    const matchesSearch = hotel.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         hotel.city.toLowerCase().includes(filters.search.toLowerCase());
    const matchesPrice = hotel.pricePerNight >= filters.priceRange[0] && 
                        hotel.pricePerNight <= filters.priceRange[1];
    const matchesStars = filters.stars.length === 0 || filters.stars.includes(hotel.stars);
    const matchesAmenities = filters.amenities.length === 0 || 
                            filters.amenities.every(a => hotel.amenities.includes(a));
    const matchesType = filters.hotelType.length === 0 || filters.hotelType.includes(hotel.hotelType);
    
    return matchesSearch && matchesPrice && matchesStars && matchesAmenities && matchesType;
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
          <h1 className="hotels-page-title">Otelləri Kəşf Et</h1>
          <p className="hotels-page-subtitle">
            {sortedHotels.length} otel tapıldı
          </p>

          <div className="hotels-search-bar">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Otel və ya şəhər axtar..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="search-input"
              />
            </div>
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
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => setFilters({
                    ...filters,
                    priceRange: [Number(e.target.value), filters.priceRange[1]]
                  })}
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters({
                    ...filters,
                    priceRange: [filters.priceRange[0], Number(e.target.value)]
                  })}
                  placeholder="Max"
                />
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
                  <option value="recommended">Tövsiyə edilən</option>
                  <option value="price-low">Qiymət: Aşağıdan yuxarıya</option>
                  <option value="price-high">Qiymət: Yuxarıdan aşağıya</option>
                  <option value="rating">Ən yüksək reytinq</option>
                </select>
              </div>
            </div>

            {/* Hotels Grid */}
            {sortedHotels.length > 0 ? (
              <div className="hotels-grid">
                {sortedHotels.map(hotel => (
                  <HotelCard key={hotel.id} hotel={hotel} currency="AZN" />
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
