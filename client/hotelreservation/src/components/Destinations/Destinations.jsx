import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegCalendarAlt, FaMapMarkerAlt, FaInfoCircle, FaPlane, FaGlobeAmericas } from 'react-icons/fa';
import { IMAGE_PLACEHOLDER, getHotels, getSeasonalPrices } from '../../api/client';
import { countryImages } from '../../data/travelData';
import { MONTH_NAMES, formatPriceRange } from '../../data/seasonalPrices';
import { useLanguage } from '../../context/LanguageContext';
import './Destinations.css';

const countryBadges = { 'Azərbaycan': 'az', 'Fransa': 'fr', 'İtaliya': 'it', 'Türkiyə': 'tr' };

const Destinations = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [prices, setPrices] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    let active = true;
    getSeasonalPrices()
      .then((items) => {
        if (!active) return;
        // Filter out Maldives from prices
        const filteredItems = items.filter(price => {
          const country = price.country?.toLowerCase() || '';
          return !country.includes('maldiv') && !country.includes('maldives');
        });
        setPrices(filteredItems);
      })
      .catch(() => {
        if (active) setPrices([]);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    getHotels()
      .then((items) => {
        if (!active) return;
        // Filter out Maldives hotels
        const filteredItems = items.filter(hotel => {
          const country = hotel.country?.toLowerCase() || '';
          return !country.includes('maldiv') && !country.includes('maldives');
        });
        setHotels(filteredItems);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const images = useMemo(() => countryImages(hotels), [hotels]);

  // [{ country, months: [{ id, month, minPrice, maxPrice, currency }] }] in the order the server sent them
  const countries = useMemo(() => {
    const grouped = new Map();
    prices.forEach((price) => {
      // Filter out Maldives - check all possible variations
      const country = price.country?.toLowerCase() || '';
      if (country.includes('maldiv') || country.includes('maldives')) return;
      
      if (!grouped.has(price.country)) grouped.set(price.country, []);
      grouped.get(price.country).push(price);
    });
    return [...grouped.entries()].map(([country, months]) => ({
      country,
      months: [...months].sort((a, b) => a.month - b.month),
    }));
  }, [prices]);

  const selected = countries.find((item) => item.country === activeTab) || countries[0];
  if (!selected) return null;

  const openHotels = (price) => {
    navigate(`/hotels?${new URLSearchParams({
      country: selected.country,
      minPrice: String(price.minPrice),
      maxPrice: String(price.maxPrice),
      currency: price.currency,
    })}`);
  };

  return (
    <section className="destinations-section" id="destinations">
      <svg className="seasonal-waves" viewBox="0 0 1600 700" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="seasonal-gold"><stop stopColor="#9b5826" stopOpacity="0" /><stop offset=".2" stopColor="#ffd489" /><stop offset=".5" stopColor="#a6692e" stopOpacity=".3" /><stop offset=".8" stopColor="#efb567" /><stop offset="1" stopColor="#ad6d31" stopOpacity=".2" /></linearGradient>
          <linearGradient id="seasonal-silk" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#b87936" stopOpacity=".28" /><stop offset="1" stopColor="#442719" stopOpacity="0" /></linearGradient>
          <filter id="seasonal-glow"><feGaussianBlur stdDeviation="7" /></filter>
        </defs>
        <path d="M-80 590 Q280 270 670 530 T1680 450 L1680 740 H-80Z" fill="url(#seasonal-silk)" />
        <path d="M-80 590 Q280 270 670 530 T1680 450" fill="none" stroke="url(#seasonal-gold)" strokeWidth="12" filter="url(#seasonal-glow)" />
        <path d="M-80 590 Q280 270 670 530 T1680 450" fill="none" stroke="url(#seasonal-gold)" strokeWidth="2" />
        <path d="M-50 630 Q310 390 720 570 T1660 510" fill="none" stroke="url(#seasonal-gold)" strokeOpacity=".25" />
        <path d="M1280 430 Q1440 390 1510 320" fill="none" stroke="#b57c3b" strokeOpacity=".6" strokeWidth="2" strokeDasharray="8 8" />
      </svg>
      <FaPlane className="seasonal-plane" aria-hidden="true" />
      <div className="destinations-container">
        <p className="eyebrow center">{t('dest.eyebrow')}</p>
        <h2 className="destinations-title">
          {t('dest.title')}
        </h2>
        <p className="destinations-subtitle">Mövsüm cədvəlində qiymət aralığını görün, sonra ölkəni seçib otel siyahısına keçin.</p>

        <div className="destinations-tabs">
          {countries.map((item) => (
            <button
              key={item.country}
              className={`tab-btn ${selected.country === item.country ? 'active' : ''}`}
              aria-pressed={selected.country === item.country}
              onClick={() => setActiveTab(item.country)}
            >
              <span className={`country-badge country-badge-${countryBadges[item.country] || 'other'}`} aria-hidden="true">{['az', 'tr'].includes(countryBadges[item.country]) ? <span>☾<small>★</small></span> : !countryBadges[item.country] ? <FaGlobeAmericas /> : null}</span>
              {item.country}
            </button>
          ))}
        </div>

        <div className="destinations-content" key={selected.country}>
          <div className="destination-image">
            <img src={images[selected.country] || IMAGE_PLACEHOLDER} alt={selected.country} />
            <div className="destination-caption"><FaMapMarkerAlt aria-hidden="true" /><div><strong>{selected.country}</strong><span>Populyar istiqamət</span></div></div>
          </div>

          <div className="destination-prices">
            <h3 className="seasonal-prices-title"><FaRegCalendarAlt aria-hidden="true" />Mövsüm üzrə orta qiymətlər</h3>
            {selected.months.map((price) => (
              <button key={price.id} className="price-row" onClick={() => openHotels(price)}>
                <FaRegCalendarAlt className="price-calendar" aria-hidden="true" />
                <span className="month-name">{MONTH_NAMES[price.month - 1]}</span>
                <span className="price-range">{formatPriceRange(price)}</span>
                <span className="arrow">›</span>
              </button>
            ))}
            <p className="price-note"><FaInfoCircle aria-hidden="true" />{t('dest.note')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Destinations;
