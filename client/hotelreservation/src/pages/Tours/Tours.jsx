import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaClock, FaMapMarkerAlt, FaUsers, FaSearch, FaFilter } from 'react-icons/fa';
import { TOURS_DATA, getTourCategories } from '../../data/toursData';
import { useLanguage } from '../../context/LanguageContext';
import './Tours.css';

const Tours = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const categories = getTourCategories();

  // Filter tours
  const filteredTours = TOURS_DATA.filter(tour => {
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
      <section className="tours-hero">
        <div className="tours-hero-content">
          <h1 className="tours-hero-title">{t('tours.title')}</h1>
          <p className="tours-hero-subtitle">
            Azərbaycanın gözəl yerlərini kəşf edin
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
                placeholder="Tur və ya təyinat axtar..."
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
                  <option value="">Bütün Kateqoriyalar</option>
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
                  <option value="popular">Populyar</option>
                  <option value="price-low">Qiymət (Aşağıdan)</option>
                  <option value="price-high">Qiymət (Yuxarıdan)</option>
                  <option value="rating">Reytinq</option>
                  <option value="duration">Müddət</option>
                </select>
              </div>
            </div>
          </div>

          <p className="results-count">
            {sortedTours.length} tur tapıldı
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
                    <div className={`tour-difficulty-badge difficulty-${tour.difficulty.toLowerCase()}`}>
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
                        <span>{tour.minGuests}-{tour.maxGuests} nəfər</span>
                      </div>
                    </div>

                    <div className="tour-card-footer">
                      <div className="tour-price">
                        <span className="price-label">Başlanğıc qiymət</span>
                        <span className="price-amount">₼{tour.price}</span>
                      </div>
                      <button className="btn-tour-view">
                        Ətraflı bax
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {sortedTours.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>Tur tapılmadı</h3>
              <p>Axtarış və ya filter parametrlərini dəyişin</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Tours;
