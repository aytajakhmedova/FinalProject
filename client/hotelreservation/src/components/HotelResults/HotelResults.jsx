import { useMemo, useState } from 'react';
import { FaHeart, FaMapMarkerAlt, FaPlay, FaStar, FaWifi, FaRegHeart } from 'react-icons/fa';
import { formatPrice } from '../../data/travelData';
import './HotelResults.css';

const HotelResults = ({ hotels, query, currency, favorites, onToggleFavorite, onBook, onPlayVideo }) => {
  const [sort, setSort] = useState('rating');
  const [onlyFav, setOnlyFav] = useState(false);

  const list = useMemo(() => {
    let items = [...hotels];
    if (query?.location) {
      const q = query.location.toLowerCase();
      items = items.filter(
        (h) =>
          h.city.toLowerCase().includes(q) ||
          h.country.toLowerCase().includes(q) ||
          h.title.toLowerCase().includes(q)
      );
    }
    if (onlyFav) items = items.filter((h) => favorites.includes(h.id));
    if (sort === 'price-asc') items.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') items.sort((a, b) => b.price - a.price);
    if (sort === 'rating') items.sort((a, b) => b.rating - a.rating);
    return items;
  }, [hotels, query, sort, onlyFav, favorites]);

  const nights = useMemo(() => {
    if (!query?.checkIn || !query?.checkOut) return 1;
    const a = new Date(query.checkIn);
    const b = new Date(query.checkOut);
    const n = Math.max(1, Math.round((b - a) / 86400000));
    return n;
  }, [query]);

  return (
    <section className="hotel-results-section" id="results">
      <div className="results-head">
        <div>
          <p className="eyebrow">Axtarış nəticələri</p>
          <h2>
            {query?.location ? `${query.location} otelləri` : 'Mövcud otellər'}
            <span> {list.length} nəticə</span>
          </h2>
          {query?.checkIn && (
            <p className="results-meta">
              {query.checkIn} → {query.checkOut} · {nights} gecə · {query.guests?.adults} qonaq
            </p>
          )}
        </div>
        <div className="results-tools">
          <button
            className={`chip ${onlyFav ? 'on' : ''}`}
            onClick={() => setOnlyFav((v) => !v)}
          >
            <FaHeart /> Seçilmişlər
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="rating">Reytinq</option>
            <option value="price-asc">Ucuzdan bahaya</option>
            <option value="price-desc">Bahadan ucuza</option>
          </select>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="empty-results">
          Bu məkan üçün otel tapılmadı. Bakı, Qəbələ, İstanbul və ya Dubay yoxlayın.
        </div>
      ) : (
        <div className="results-grid">
          {list.map((hotel, i) => (
            <article className="result-card" key={hotel.id} style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="result-media">
                <img src={hotel.image} alt={hotel.title} />
                {hotel.video && (
                  <button
                    className="video-play-btn"
                    onClick={() => onPlayVideo(hotel)}
                    aria-label="Video turu izlə"
                  >
                    <FaPlay />
                  </button>
                )}
                <span className="result-tag">{hotel.tag}</span>
                <button
                  className={`fav-btn ${favorites.includes(hotel.id) ? 'active' : ''}`}
                  onClick={() => onToggleFavorite(hotel.id)}
                  aria-label="Seçilmişə əlavə et"
                >
                  {favorites.includes(hotel.id) ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>
              <div className="result-body">
                <div className="result-top">
                  <h3>{hotel.title}</h3>
                  <div className="rating-pill">
                    <FaStar /> {hotel.rating}
                  </div>
                </div>
                <p className="result-loc">
                  <FaMapMarkerAlt /> {hotel.city}, {hotel.country}
                </p>
                <p className="result-desc">{hotel.description}</p>
                <div className="amenity-row">
                  {hotel.amenities.slice(0, 3).map((a) => (
                    <span key={a}>
                      <FaWifi /> {a}
                    </span>
                  ))}
                </div>
                <div className="result-footer">
                  <div>
                    <strong>{formatPrice(hotel.price * nights, currency)}</strong>
                    <small> / {nights} gecə</small>
                  </div>
                  <div className="result-actions">
                    {hotel.video && (
                      <button className="ghost-btn" onClick={() => onPlayVideo(hotel)}>
                        Video
                      </button>
                    )}
                    <button onClick={() => onBook(hotel)}>Rezerv et</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default HotelResults;
