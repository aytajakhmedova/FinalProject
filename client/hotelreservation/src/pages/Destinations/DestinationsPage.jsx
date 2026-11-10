import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBed, FaRegMoon, FaArrowRight, FaPlane } from 'react-icons/fa';
import Destinations from '../../components/Destinations/Destinations';
import { IMAGE_PLACEHOLDER, getHotels } from '../../api/client';
import { countryImages } from '../../data/travelData';
import '../contentPages.css';
import './DestinationsPage.css';

const DestinationsPage = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    let active = true;
    getHotels()
      .then((items) => {
        if (active) setHotels(items);
      })
      .catch(() => {
        if (active) setHotels([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const images = useMemo(() => countryImages(hotels), [hotels]);

  // One card per country that has hotels, with the real hotel count and starting price.
  const countries = useMemo(() => {
    const grouped = new Map();
    hotels.forEach((hotel) => {
      if (!hotel.country) return;
      const entry = grouped.get(hotel.country) || { country: hotel.country, count: 0, from: Infinity };
      entry.count += 1;
      entry.from = Math.min(entry.from, Number(hotel.pricePerNight) || Infinity);
      grouped.set(hotel.country, entry);
    });
    return [...grouped.values()];
  }, [hotels]);

  return (
    <>
      <Destinations />
      {countries.length > 0 && (
        <section id="country-discovery">
          <svg className="discovery-waves" viewBox="0 0 1600 800" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="discovery-gold"><stop stopColor="#a8662c" stopOpacity=".2" /><stop offset=".17" stopColor="#ffd28a" /><stop offset=".48" stopColor="#a66a30" stopOpacity=".3" /><stop offset=".8" stopColor="#ffd48c" /><stop offset="1" stopColor="#b57a39" /></linearGradient>
              <linearGradient id="discovery-silk" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#c48a44" stopOpacity=".3" /><stop offset="1" stopColor="#4c2c18" stopOpacity="0" /></linearGradient>
              <filter id="discovery-glow"><feGaussianBlur stdDeviation="7" /></filter>
            </defs>
            <path d="M-70 610 Q240 335 550 560 T1220 570 T1670 450 L1670 850 H-70Z" fill="url(#discovery-silk)" />
            <path d="M-70 610 Q240 335 550 560 T1220 570 T1670 450" fill="none" stroke="url(#discovery-gold)" strokeWidth="12" filter="url(#discovery-glow)" />
            <path d="M-70 610 Q240 335 550 560 T1220 570 T1670 450" fill="none" stroke="url(#discovery-gold)" strokeWidth="2" />
            <path d="M-40 650 Q250 460 570 625 T1250 650 T1660 500" fill="none" stroke="url(#discovery-gold)" strokeOpacity=".2" />
            <path d="M150 350 Q185 440 340 470 M1250 370 Q1410 350 1500 260" fill="none" stroke="#b47a3a" strokeOpacity=".6" strokeWidth="2" strokeDasharray="8 9" />
          </svg>
          <FaMapMarkerAlt className="discovery-pin" aria-hidden="true" />
          <FaPlane className="discovery-plane" aria-hidden="true" />
          <div className="discovery-container">
          <p className="fill-kicker">İstiqamətlər</p>
          <h2 className="fill-title">Haradan <em>başlamaq</em> olar</h2>
          <p className="fill-lead">
            Mövsüm cədvəlində qiymət aralığını görün, sonra ölkəni seçib otel siyahısına keçin.
          </p>
          <div className="country-grid">
            {countries.map((item) => (
              <article className="country-card" key={item.country}>
                <img src={images[item.country] || IMAGE_PLACEHOLDER} alt={item.country} />
                <div className="country-card-info">
                  <h3><FaMapMarkerAlt aria-hidden="true" />{item.country}</h3>
                  <p className="country-card-meta">
                    <span><FaBed aria-hidden="true" />{item.count} otel</span>
                    {Number.isFinite(item.from) && <span><FaRegMoon aria-hidden="true" />gecəlik ₼{Math.round(item.from)}-dən</span>}
                  </p>
                  <Link to={`/hotels?country=${encodeURIComponent(item.country)}`}>Otellərə bax <FaArrowRight aria-hidden="true" /></Link>
                </div>
              </article>
            ))}
          </div>
          </div>
        </section>
      )}
    </>
  );
};

export default DestinationsPage;
