import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCheck, FaCopy, FaGift, FaPlane, FaShuttleVan, FaTag, FaTicketAlt } from 'react-icons/fa';
import { getActiveDiscounts, resolveImage } from '../../api/client';
import logo from '../../assets/images/AE_HOTEL_transparent_logo.png';
import './Offers.css';

const COMBOS = {
  hotel_flight: { title: 'Otel + uçuş', image: 'hotelimg5.jfif', icon: FaPlane },
  hotel_tour: { title: 'Otel + tur', image: 'cappadocia-balloon.jfif', icon: FaShuttleVan },
  hotel_flight_tour: { title: 'Otel + uçuş + tur', image: 'dubai.jpg', icon: FaPlane },
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
  const [error, setError] = useState('');
  const [copyError, setCopyError] = useState('');
  const copyTimer = useRef(null);

  useEffect(() => {
    let active = true;
    getActiveDiscounts()
      .then((data) => active && setItems(Array.isArray(data) ? data : []))
      .catch(() => { if (active) { setItems([]); setError('Təklifləri yükləmək mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.'); } });
    return () => { active = false; clearTimeout(copyTimer.current); };
  }, []);

  const copy = async (code) => {
    clearTimeout(copyTimer.current);
    setCopied('');
    setCopyError('');
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      copyTimer.current = setTimeout(() => setCopied(''), 1800);
    } catch {
      setCopyError('Kodu kopyalamaq mümkün olmadı. Kupon kodunu seçib əl ilə kopyalayın.');
    }
  };
  const packages = (items || []).filter((item) => item.combo !== 'coupon');
  const coupons = (items || []).filter((item) => item.combo === 'coupon' && item.code);

  return (
    <section className="offers-page" aria-labelledby="offers-title">
      <svg className="offers-waves" viewBox="0 0 1600 1000" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="offers-wave-gold"><stop stopColor="#b27535" stopOpacity=".6" /><stop offset=".35" stopColor="#e8ad66" stopOpacity=".45" /><stop offset=".7" stopColor="#995b24" stopOpacity=".05" /><stop offset="1" stopColor="#c7853c" stopOpacity=".25" /></linearGradient></defs>
        {Array.from({ length: 10 }, (_, index) => (
          <g key={index} fill="none" stroke="url(#offers-wave-gold)" strokeWidth=".8">
            <path d={`M -40 ${130 + index * 5} C 150 ${100 + index * 7}, 120 ${340 - index * 3}, 370 275 S 850 300, 950 310`} />
            <path d={`M -60 ${850 + index * 6} C 120 ${770 + index * 7}, 180 1040, 470 ${970 + index * 3} S 1100 ${1010 - index * 3}, 1350 830 S 1550 720, 1680 ${740 + index * 6}`} />
          </g>
        ))}
      </svg>
      <header className="offers-head">
        <div className="offers-container offers-intro">
          <p className="offers-eyebrow">AE HOTEL</p>
          <h1 id="offers-title">Təkliflər və endirimlər</h1>
          <div className="offers-ornament" aria-hidden="true"><span /><FaTag /><span /></div>
          <p className="offers-lead">Rezervasiya zamanı bu endirimlərdən istifadə edin<br />və səyahətinizi daha sərfəli edin.</p>
        </div>
        <div className="offers-plane" aria-hidden="true"><FaPlane /></div>
      </header>
      <div className="offers-container offers-content">
        {items === null && <p className="offers-note" role="status">Yüklənir...</p>}
        {error && <p className="offers-note" role="alert">{error}</p>}
        {items && items.length === 0 && !error && <p className="offers-note">Hazırda aktiv təklif yoxdur.</p>}
        {packages.length > 0 && (
          <section className="offers-packages" aria-labelledby="offers-packages-title">
            <div className="offers-section-heading"><FaGift aria-hidden="true" /><div><h2 id="offers-packages-title">Paket endirimləri</h2><p>Otel rezervasiyası ilə birlikdə seçəndə endirim avtomatik tətbiq olunur.</p></div></div>
            <div className="offers-grid">
              {packages.map((item) => {
                const combo = COMBOS[item.combo] || { title: item.name || item.combo, image: 'hotelimg5.jfif', icon: FaGift };
                const Icon = combo.icon;
                return (
                  <article key={item.id} className="offers-package-card" aria-label={item.name || combo.title}>
                    <img className="offers-package-image" src={resolveImage(combo.image)} alt="" />
                    <div className="offers-package-copy"><span className="offers-package-tag"><Icon aria-hidden="true" />{combo.title}</span><strong className="offers-package-value">{valueOf(item)}</strong><span className="offers-discount-label">endirim</span>{item.endsAt && <small>{dateOf(item.endsAt)} tarixinədək</small>}</div>
                  </article>
                );
              })}
            </div>
            <div className="offers-action"><Link to="/hotels" className="offers-select-hotel"><FaGift aria-hidden="true" />Otel seç və endirimdən yararlan<FaArrowRight aria-hidden="true" /></Link></div>
          </section>
        )}
        {coupons.length > 0 && (
          <section className="offers-coupons" aria-labelledby="offers-coupons-title">
            <div className="offers-section-heading"><FaTicketAlt aria-hidden="true" /><div><h2 id="offers-coupons-title">Kupon kodları</h2><p>Ödəniş səhifəsində kupon xanasına yazın.</p></div></div>
            <div className="offers-coupon-list">
              {coupons.map((item) => (
                <article key={item.id} className="offers-coupon-card">
                  <div className="offers-ticket-wrap"><strong className="offers-ticket">{item.code}</strong></div>
                  <div className="offers-coupon-copy"><h3>Kupon <strong>{valueOf(item)}</strong></h3><p>{item.name}</p>{item.endsAt && <small>{dateOf(item.endsAt)} tarixinədək</small>}</div>
                  <button type="button" className="offers-copy-code" onClick={() => copy(item.code)} aria-label={`${item.code} — kodu kopyala`}>{copied === item.code ? <FaCheck aria-hidden="true" /> : <FaCopy aria-hidden="true" />}<span>{copied === item.code ? 'Kopyalandı' : 'Kodu kopyala'}</span></button>
                </article>
              ))}
            </div>
            <p className="offers-copy-status" role="status">{copyError || (copied ? `${copied} kopyalandı` : '')}</p>
            <div className="offers-gift" aria-hidden="true"><span className="offers-gift-glow" /><span className="offers-gift-tail" /><div className="offers-gift-box"><div className="offers-gift-lid" /><span className="offers-gift-ribbon" /><img src={logo} alt="" /><span className="offers-gift-bow left" /><span className="offers-gift-bow right" /><span className="offers-gift-knot" /></div><span className="offers-spark one">✦</span><span className="offers-spark two">✦</span><span className="offers-spark three">✦</span></div>
          </section>
        )}
      </div>
    </section>
  );
};
export default Offers;
