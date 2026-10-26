import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaStar, FaClock, FaMapMarkerAlt, FaUsers, FaSearch, FaFilter } from 'react-icons/fa';
import { getTours } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';
import { MEDIA } from '../../data/localMedia';
import './Tours.css';

const Tours = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('destination') || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [tours, setTours] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getTours({
      destination: searchParams.get('destination') || undefined,
      date: searchParams.get('date') || undefined,
      guests: searchParams.get('guests') || undefined,
    })
      .then((items) => {
        if (!active) return;
        setTours(items);
        setLoadError('');
      })
      .catch((error) => {
        if (!active) return;
        setTours([]);
        setLoadError(error.message || 'Turlar yüklənmədi.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [searchParams]);

  const categories = [...new Set(tours.map((tour) => tour.category).filter(Boolean))];

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || tour.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort tours
  const sortedTours = [...filteredTours].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'duration':
        return a.duration.localeCompare(b.duration);
      default: // popular
        return b.reviews - a.reviews;
    }
  });

  return (
    <div className="tours-page">
      {/* Hero Section */}
      <section className="tours-hero" style={{ '--tours-hero-image': `url(${MEDIA.tourGondolas})` }}>
        <div className="tours-hero-content">
          <h1 className="tours-hero-title">{t('tours.title')}</h1>
          <p className="tours-hero-subtitle">
            {t('tours.subtitle')}
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="tours-search-section">
        <div className="tours-container">
          <div className="search-filter-bar">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder={t('tours.searchPh')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <div className="filter-item">
                <FaFilter className="filter-icon" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="">{t('tours.allCats')}</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="filter-item">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="popular">{t('tours.popular')}</option>
                  <option value="price-low">{t('tours.priceLow')}</option>
                  <option value="price-high">{t('tours.priceHigh')}</option>
                  <option value="rating">{t('tours.rating')}</option>
                  <option value="duration">{t('tours.duration')}</option>
                </select>
              </div>
            </div>
          </div>

          <p className="results-count">
            {loading ? t('common.loading') : loadError || t('tours.found', { count: sortedTours.length })}
          </p>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="tours-grid-section">
        <div className="tours-container">
          <div className="tours-grid">
            {sortedTours.map(tour => (
              <div key={tour.id} className="tour-card">
                <Link to={`/tours/${tour.id}`} className="tour-card-link">
                  <div className="tour-card-image">
                    <img src={tour.image} alt={tour.name} />
                    <div className="tour-category-badge">{tour.category}</div>
                    <div className={`tour-difficulty-badge difficulty-${(tour.difficulty || '').toLowerCase()}`}>
                      {tour.difficulty}
                    </div>
                  </div>

                  <div className="tour-card-content">
                    <h3 className="tour-card-title">{tour.name}</h3>
                    
                    <div className="tour-card-meta">
                      <div className="tour-location">
                        <FaMapMarkerAlt />
                        <span>{tour.destination}</span>
                      </div>
                      <div className="tour-rating">
                        <FaStar />
                        <span>{tour.rating}</span>
                        <span className="reviews-count">({tour.reviews})</span>
                      </div>
                    </div>

                    <div className="tour-card-info">
                      <div className="tour-duration">
                        <FaClock />
                        <span>{tour.duration}</span>
                      </div>
                      <div className="tour-guests">
                        <FaUsers />
                        <span>{t('tours.people', { min: tour.minGuests, max: tour.maxGuests })}</span>
                      </div>
                    </div>

                    <div className="tour-card-footer">
                      <div className="tour-price">
                        <span className="price-label">{t('tours.fromPrice')}</span>
                        <span className="price-amount">₼{tour.price}</span>
                      </div>
                      <button className="btn-tour-view">
                        {t('tours.details')}
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {!loading && sortedTours.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>{t('tours.empty')}</h3>
              <p>{t('tours.emptyHint')}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Tours;
