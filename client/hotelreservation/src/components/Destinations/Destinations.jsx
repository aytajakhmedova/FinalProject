import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMAGE_PLACEHOLDER, getHotels, getSeasonalPrices } from '../../api/client';
import { countryImages } from '../../data/travelData';
import { MONTH_NAMES, formatPriceRange } from '../../data/seasonalPrices';
import { useLanguage } from '../../context/LanguageContext';
import './Destinations.css';

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
        if (active) setPrices(items);
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
        if (active) setHotels(items);
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
      <div className="destinations-container">
        <p className="eyebrow center">{t('dest.eyebrow')}</p>
        <h2 className="destinations-title">
          {t('dest.title')}
        </h2>

        <div className="destinations-tabs">
          {countries.map((item) => (
            <button
              key={item.country}
              className={`tab-btn ${selected.country === item.country ? 'active' : ''}`}
              onClick={() => setActiveTab(item.country)}
            >
              {item.country}
            </button>
          ))}
        </div>

        <div className="destinations-content" key={selected.country}>
          <div className="destination-image">
            <img src={images[selected.country] || IMAGE_PLACEHOLDER} alt={selected.country} />
          </div>

          <div className="destination-prices">
            {selected.months.map((price) => (
              <button key={price.id} className="price-row" onClick={() => openHotels(price)}>
                <span className="month-name">{MONTH_NAMES[price.month - 1]}</span>
                <span className="price-range">{formatPriceRange(price)}</span>
                <span className="arrow">›</span>
              </button>
            ))}
            <p className="price-note">{t('dest.note')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Destinations;
