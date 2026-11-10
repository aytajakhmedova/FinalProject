import Select from '../../components/common/Select/Select';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaStar, FaClock, FaMapMarkerAlt, FaUsers, FaSearch, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getTours, getTourCategories, resolveImage } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteContent } from '../../context/SiteContentContext';
import './Tours.css';

const PAGE_SIZE = 6;

const Tours = () => {
  const { t } = useLanguage();
  const { content: siteContent } = useSiteContent();
  const heroVideo = resolveImage(siteContent?.settings?.toursPageVideoUrl);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('destination') || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [tours, setTours] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState(searchTerm.trim());
  const [page, setPage] = useState(1);
  const resultsRef = useRef(null);

  // Wait for a pause in typing before asking the server.
  useEffect(() => {
    const timer = setTimeout(() => setQuery(searchTerm.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    getTourCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let active = true;
    getTours({
      destination: query || undefined,
      date: searchParams.get('date') || undefined,
      guests: searchParams.get('guests') || undefined,
      category: selectedCategory || undefined,
      sort: sortBy,
    })
      .then((items) => {
        if (!active) return;
        // Filter out Maldives tours
        const filteredItems = items.filter(tour => {
          const destination = tour.destination?.toLowerCase() || '';
          return !destination.includes('maldiv') && !destination.includes('maldives');
        });
        setTours(filteredItems);
        setLoadError('');
        setPage(1);
      })
      .catch((error) => {
        if (!active) return;
        setTours([]);
        setLoadError(error.message || 'Turlar yüklənmədi.');
        setPage(1);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [searchParams, query, selectedCategory, sortBy]);

  // Search, category and sorting are all done by the server.
  const sortedTours = tours;

  const totalPages = Math.max(1, Math.ceil(sortedTours.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const visibleTours = sortedTours.slice(pageStart, pageStart + PAGE_SIZE);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter(number => totalPages <= 7 || number === 1 || number === totalPages || Math.abs(number - currentPage) <= 1);
  const scrollToResults = () => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const changePage = (nextPage) => {
    setPage(Math.max(1, Math.min(nextPage, totalPages)));
    scrollToResults();
  };

  return (
    <div className="tours-page">
      {/* Hero Section with Video */}
      <section className="tours-hero">
        {heroVideo && (
          <video
            className="tours-hero-video"
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
          />
        )}
        <div className="tours-hero-overlay"></div>
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
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="">{t('tours.allCats')}</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Select>
              </div>

              <div className="filter-item">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="popular">{t('tours.popular')}</option>
                  <option value="price-low">{t('tours.priceLow')}</option>
                  <option value="price-high">{t('tours.priceHigh')}</option>
                  <option value="rating">{t('tours.rating')}</option>
                  <option value="duration">{t('tours.duration')}</option>
                </Select>
              </div>
            </div>
          </div>

          <p className="results-count">
            {loading ? t('common.loading') : loadError || t('tours.found', { count: sortedTours.length })}
          </p>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="tours-grid-section" ref={resultsRef}>
        <div className="tours-container">
          <div className="tours-grid">
            {visibleTours.map(tour => (
              <div key={tour.id} className="tour-card">
                <Link to={`/tours/${tour.id}`} className="tour-card-link">
                  <div className="tour-card-image">
                    <img src={tour.image} alt={tour.name} loading="lazy" decoding="async" />
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

          {!loading && !loadError && sortedTours.length > 0 && (
            <div className="tours-pagination-bar">
              <p>{pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, sortedTours.length)} / {sortedTours.length} tur</p>
              {totalPages > 1 && <nav className="tours-pagination" aria-label="Turların səhifələri">
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
      </section>
    </div>
  );
};

export default Tours;
