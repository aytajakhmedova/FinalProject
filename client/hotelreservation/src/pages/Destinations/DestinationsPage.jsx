import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Destinations from '../../components/Destinations/Destinations';
import { IMAGE_PLACEHOLDER, getHotels } from '../../api/client';
import { countryImages } from '../../data/travelData';
import '../contentPages.css';

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
        <section className="fill-wrap">
          <p className="fill-kicker">İstiqamətlər</p>
          <h2 className="fill-title">Haradan başlamaq olar</h2>
          <p className="fill-lead">
            Mövsüm cədvəlində qiymət aralığını görün, sonra ölkəni seçib otel siyahısına keçin.
          </p>
          <div className="country-grid">
            {countries.map((item) => (
              <article className="country-card" key={item.country}>
                <img src={images[item.country] || IMAGE_PLACEHOLDER} alt={item.country} />
                <div>
                  <h3>{item.country}</h3>
                  <p>
                    {item.count} otel
                    {Number.isFinite(item.from) ? ` · gecəlik ₼${Math.round(item.from)}-dən` : ''}
                  </p>
                  <Link to={`/hotels?country=${encodeURIComponent(item.country)}`}>Otellərə bax</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default DestinationsPage;
