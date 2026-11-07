import Combobox from '../../components/common/Select/Combobox';
import Select from '../../components/common/Select/Select';
import React, { useEffect, useMemo, useState } from 'react';
import { FaExchangeAlt, FaCalendarAlt, FaPlane, FaGlobeAmericas, FaMapMarkerAlt, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import istanbulImage from '../../assets/images/istanbul.jpg';
import dubaiImage from '../../assets/images/dubai.jpg';
import parisImage from '../../assets/images/paris.jpg';
import londonImage from '../../assets/images/london.jpg';
import { getSiteCities, listFlights, resolveImage } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteContent } from '../../context/SiteContentContext';
import './Flights.css';

const Flights = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { content: siteContent } = useSiteContent();
  const heroVideo = resolveImage(siteContent?.settings?.flightsPageVideoUrl);
  const [tripType, setTripType] = useState('one-way');
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departure: '',
    returnDate: '',
    travelers: '1',
    flightClass: 'economy',
  });
  const [dbFlights, setDbFlights] = useState([]);
  useEffect(() => {
    let active = true;
    listFlights().then((items) => { if (active) setDbFlights(items || []); }).catch(() => {});
    return () => { active = false; };
  }, []);
  const [locations, setLocations] = useState([]);
  useEffect(() => {
    let active = true;
    getSiteCities()
      .then((cities) => {
        if (!active) return;
        setLocations((cities || [])
          .filter((c) => c && c.name)
          .map((c) => ({ city: c.name, country: c.country || '' })));
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ origin: formData.from, destination: formData.to, date: formData.departure, passengers: formData.travelers, cabin: formData.flightClass });
    navigate(`/flight-results?${params.toString()}`);
  };

  const handleSwapLocations = () => {
    setFormData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  // Special offers: the cheapest real flights per route, straight from the database.
  const specialOffers = useMemo(() => {
    const cheapestByRoute = new Map();
    dbFlights.forEach((f) => {
      const key = `${f.originCity}|${f.destinationCity}`;
      const current = cheapestByRoute.get(key);
      if (!current || Number(f.price) < Number(current.price)) cheapestByRoute.set(key, f);
    });
    return [...cheapestByRoute.values()]
      .sort((a, b) => Number(a.price) - Number(b.price))
      .slice(0, 3)
      .map((f) => ({
        id: f.id,
        airline: f.airline,
        amount: `${Number(f.price)} ₼`,
        label: 'başlayan qiymət',
        type: f.originCountry && f.originCountry === f.destinationCountry ? t('flights.offerDomestic') : t('flights.offerIntl'),
        route: `${f.originCity} — ${f.destinationCity}`,
        from: f.originCity,
        to: f.destinationCity,
        code: f.flightNumber,
      }));
  }, [dbFlights, t]);

  const handleOfferClick = (offer) => {
    const params = new URLSearchParams({ origin: offer.from, destination: offer.to });
    navigate(`/flight-results?${params.toString()}`);
  };

  const popularDestinations = [
    {
      id: 1,
      name: 'İstanbul',
      country: 'Türkiyə',
      image: istanbulImage,
      rating: 4.8,
      info: 'Növbəti uçuş 15 Yanvar',
      code: 'IST'
    },
    {
      id: 2,
      name: 'Dubai',
      country: 'BƏƏ',
      image: dubaiImage,
      rating: 4.9,
      info: 'Gündəlik 2 uçuş',
      code: 'DXB'
    },
    {
      id: 3,
      name: 'Paris',
      country: 'Fransa',
      image: parisImage,
      rating: 4.7,
      info: 'Həftədə 5 uçuş',
      code: 'CDG'
    },
    {
      id: 4,
      name: 'London',
      country: 'Böyük Britaniya',
      image: londonImage,
      rating: 4.6,
      info: 'Növbəti uçuş 12 Yanvar',
      code: 'LHR'
    },
  ];

  const handleDestinationClick = (destination) => {
    // Navigate to flight results with pre-filled destination
    const params = new URLSearchParams({ origin: 'Bakı', destination: destination.name });
    navigate(`/flight-results?${params.toString()}`);
  };

  return (
    <div className="flights-page">
      {/* Hero Section with Video */}
      <section className="flights-hero">
        {heroVideo && (
          <video
            className="flights-hero-video"
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
          />
        )}
        <div className="flights-hero-overlay">
          <div className="flights-hero-content">
            <p className="flights-hero-kicker">AE Hotel Uçuşlar</p>
            <h1 className="flights-hero-title">{t('flights.title')}</h1>
            <p className="flights-hero-subtitle">Ən sərfəli biletlər — 630+ istiqamət, bir axtarış</p>

            {/* Search Form */}
            <div className="flights-search-card">
              {/* Trip Type Tabs */}
              <div className="trip-type-tabs">
                <button 
                  className={`trip-tab ${tripType === 'one-way' ? 'active' : ''}`}
                  onClick={() => setTripType('one-way')}
                >
                  Tək tərəfli
                </button>
                <button 
                  className={`trip-tab ${tripType === 'round-trip' ? 'active' : ''}`}
                  onClick={() => setTripType('round-trip')}
                >
                  Gediş-Gəliş
                </button>

                <div className="trip-selects">
                  <Select 
                    name="flightClass" 
                    value={formData.flightClass}
                    onChange={handleChange}
                    className="trip-select"
                  >
                    <option value="economy">Ekonom</option>
                    <option value="business">Biznes</option>
                    <option value="first">Birinci sinif</option>
                  </Select>

                  <Select 
                    name="travelers" 
                    value={formData.travelers}
                    onChange={handleChange}
                    className="trip-select"
                  >
                    <option value="1">1 Sərnişin</option>
                    <option value="2">2 Sərnişin</option>
                    <option value="3">3 Sərnişin</option>
                    <option value="4">4 Sərnişin</option>
                    <option value="5">5+ Sərnişin</option>
                  </Select>
                </div>
              </div>

              {/* Search Inputs */}
              <form onSubmit={handleSubmit} className="flights-search-form">
                <div className={`flight-inputs-row ${tripType === 'round-trip' ? 'with-return' : ''}`}>
                  <div className="flight-input-group">
                    <label className="flight-label">
                      <FaPlane className="flight-icon" />
                      Haradan
                    </label>
                    <Combobox inputMode label="Haradan" className="flight-input"
                      value={formData.from} placeholder="Şəhər və ya hava limanı"
                      inputProps={{ name: 'from', required: true }}
                      options={locations.map((item) => ({
                        value: item.city, label: item.city,
                        description: item.country,
                        searchText: [item.city, item.country].join(' '),
                      }))}
                      onInputChange={(value) => setFormData((previous) => ({ ...previous, from: value }))}
                      onChange={(value) => setFormData((previous) => ({ ...previous, from: value }))} />
                  </div>

                  <button 
                    type="button" 
                    className="swap-button"
                    onClick={handleSwapLocations}
                    title="Yerləri dəyiş"
                  >
                    <FaExchangeAlt />
                  </button>

                  <div className="flight-input-group">
                    <label className="flight-label">
                      <FaPlane className="flight-icon rotated" />
                      Hara
                    </label>
                    <Combobox inputMode label="Hara" className="flight-input"
                      value={formData.to} placeholder="Şəhər və ya hava limanı"
                      inputProps={{ name: 'to', required: true }}
                      options={locations.map((item) => ({
                        value: item.city, label: item.city,
                        description: item.country,
                        searchText: [item.city, item.country].join(' '),
                      }))}
                      onInputChange={(value) => setFormData((previous) => ({ ...previous, to: value }))}
                      onChange={(value) => setFormData((previous) => ({ ...previous, to: value }))} />
                  </div>

                  <div className="flight-input-group">
                    <label className="flight-label">
                      <FaCalendarAlt className="flight-icon" />
                      Gediş tarixi
                    </label>
                    <input
                      type="date"
                      name="departure"
                      value={formData.departure}
                      onChange={handleChange}
                      className="flight-input"
                      required
                    />
                  </div>

                  {tripType === 'round-trip' && (
                    <div className="flight-input-group">
                      <label className="flight-label">
                        <FaCalendarAlt className="flight-icon" />
                        Gəliş tarixi
                      </label>
                      <input
                        type="date"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleChange}
                        className="flight-input"
                      />
                    </div>
                  )}

                  <button type="submit" className="flight-search-button">
                    Bilet Tap
                    <FaPlane />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="special-offers-section">
        <div className="container">
          <div className="flight-offers-head">
            <h2 className="section-title">{t('flights.offers')}</h2>
            <p className="flight-offers-sub">{t('flights.offerSub')}</p>
          </div>
          <div className="flight-offers-grid">
            {specialOffers.map((offer) => (
              <article key={offer.id} className="flight-offer">
                <div className="flight-offer-top">
                  <span className="flight-offer-badge">{t('flights.offerBadge')}</span>
                  <FaPlane className="flight-offer-mark" />
                </div>
                <h3 className="flight-offer-airline">{offer.airline}</h3>
                <p className="flight-offer-amount">
                  <strong>{offer.amount}</strong>
                  <span>{offer.label}</span>
                </p>
                <p className="flight-offer-route">{offer.route}</p>
                <p className="flight-offer-type">{offer.type}</p>
                <div className="flight-offer-footer">
                  <span className="flight-offer-code">{offer.code}</span>
                  <button
                    type="button"
                    className="flight-offer-btn"
                    onClick={() => handleOfferClick(offer)}
                  >
                    {t('flights.offerUse')}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="popular-destinations-section">
        <div className="container">
          <h2 className="section-title">{t('flights.popular')}</h2>
          <div className="destinations-grid">
            {popularDestinations.map(destination => (
              <div 
                key={destination.id} 
                className="destination-card"
                onClick={() => handleDestinationClick(destination)}
                style={{ cursor: 'pointer' }}
              >
                <div className="flight-dest-photo">
                  <img src={destination.image} alt={destination.name} />
                  <div className="destination-rating">
                    {destination.rating} ⭐
                  </div>
                </div>
                <div className="destination-content">
                  <h3 className="destination-name">{destination.name}</h3>
                  <p className="destination-country">{destination.country}</p>
                  <p className="destination-info">{destination.info}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-section">
        <div className="container">
          <div className="why-grid">
            <div className="why-item">
              <div className="why-icon"><FaGlobeAmericas /></div>
              <h3>Geniş Seçim</h3>
              <p>630+ istiqamət ilə işləyirik</p>
            </div>
            <div className="why-item">
              <div className="why-icon"><FaMapMarkerAlt /></div>
              <h3>İstiqaməti Seçin</h3>
              <p>Ən sərfəli marşrutlar</p>
            </div>
            <div className="why-item">
              <div className="why-icon"><FaLock /></div>
              <h3>Asan Rezervasiya</h3>
              <p>Sürətli və təhlükəsiz bilet alışı</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">{t('flights.cta')} ✈️</h2>
          <p className="cta-text">
            Dünyanın ən gözəl yerlərini kəşf edin və unudulmaz səyahətlər yaşayın
          </p>
          <button className="cta-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Uçuş Rezerv Et
          </button>
        </div>
      </section>
    </div>
  );
};

export default Flights;
