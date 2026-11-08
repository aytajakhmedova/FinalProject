import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActiveDiscounts } from '../../api/client';
import './Offers.css';

const COMBO_TITLES = {
  hotel_flight: 'Otel + uçuş',
  hotel_tour: 'Otel + tur',
  hotel_flight_tour: 'Otel + uçuş + tur',
  coupon: 'Kupon kodu',
};

const valueOf = (item) => {
  const parts = [];
  if (Number(item.percent) > 0) parts.push(`${Number(item.percent)}%`);
  if (Number(item.amount) > 0) parts.push(`₼${Number(item.amount)}`);
  return parts.join(' + ') || '—';
};

const dateOf = (value) => new Date(value).toLocaleDateString('az-AZ');

const Offers = () => {
  const [items, setItems] = useState(null);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    let active = true;
    getActiveDiscounts()
      .then((data) => active && setItems(Array.isArray(data) ? data : []))
      .catch(() => active && setItems([]));
    return () => { active = false; };
  }, []);

  const copy = (code) => {
    try { navigator.clipboard?.writeText(code); } catch { /* ignore */ }
    setCopied(code);
    setTimeout(() => setCopied(''), 1800);
  };

  const packages = (items || []).filter((item) => item.combo !== 'coupon');
  const coupons = (items || []).filter((item) => item.combo === 'coupon' && item.code);

  return (
    <section className="offers-page">
      <header className="offers-head">
        <h1>Təkliflər və endirimlər</h1>
        <p>Rezervasiya zamanı bu endirimlərdən istifadə edin.</p>
      </header>

      {items === null && <p className="offers-note">Yüklənir...</p>}
      {items && items.length === 0 && <p className="offers-note">Hazırda aktiv təklif yoxdur.</p>}

      {packages.length > 0 && (
        <>
          <h2>Paket endirimləri</h2>
          <p className="offers-hint">Otel rezervasiyası ilə birlikdə seçəndə endirim avtomatik tətbiq olunur.</p>
          <div className="offers-grid">
            {packages.map((item) => (
              <article key={item.id} className="offer-card">
                <span className="offer-tag">{COMBO_TITLES[item.combo] || item.combo}</span>
                <strong className="offer-value">{valueOf(item)}</strong>
                <h3>{item.name}</h3>
                {item.endsAt && <small>{dateOf(item.endsAt)} tarixinədək</small>}
              </article>
            ))}
          </div>
          <Link to="/hotels" className="offer-cta">Otel seç və endirimdən yararlan</Link>
        </>
      )}

      {coupons.length > 0 && (
        <>
          <h2>Kupon kodları</h2>
          <p className="offers-hint">Ödəniş səhifəsində kupon xanasına yazın.</p>
          <div className="offers-grid">
            {coupons.map((item) => (
              <article key={item.id} className="offer-card coupon">
                <span className="offer-tag">Kupon</span>
                <strong className="offer-value">{valueOf(item)}</strong>
                <h3>{item.name}</h3>
                <button type="button" className="offer-code" onClick={() => copy(item.code)}>
                  {copied === item.code ? 'Kopyalandı' : item.code}
                </button>
                {item.endsAt && <small>{dateOf(item.endsAt)} tarixinədək</small>}
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default Offers;
