import { useRef, useState } from 'react';
import { FaCamera, FaExpandAlt, FaImage, FaPlay, FaTimes } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { resolveImage } from '../../api/client';
import './Gallery.css';

const photos = [
  { file: 'hotelimg1.jfif', caption: 'Gecə şəhər mənzərəsi' },
  { file: 'hotelimg3.jfif', caption: 'Sahil yataq otağı' },
  { file: 'hotelimg2.jfif', caption: 'Otel girişi' },
  { file: 'hotelimg6.jfif', caption: 'Dam hovuzu' },
  { file: 'hotelimg7.jfif', caption: 'Şəhər süiti' },
  { file: 'hotelimg4.jfif', caption: 'Fəvvarə və işıqlar' },
  { file: 'hotelimg5.jfif', caption: 'Dənizə baxan otaq' },
];

const Gallery = () => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(photos[0]);
  const dialogRef = useRef(null);
  const gridRef = useRef(null);
  const openPhoto = (photo) => {
    setSelected(photo);
    dialogRef.current.showModal();
  };
  const explore = () => {
    gridRef.current.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    gridRef.current.querySelector('button')?.focus({ preventScroll: true });
  };

  return (
    <section className="hotel-gallery" aria-labelledby="hotel-gallery-title">
      <div className="hotel-gallery-hero">
        <svg className="hotel-gallery-waves" viewBox="0 0 1440 340" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="gallery-wave-gold"><stop stopColor="#b3752f" stopOpacity="0" /><stop offset=".3" stopColor="#e2a24e" stopOpacity=".7" /><stop offset="1" stopColor="#ae712b" stopOpacity="0" /></linearGradient></defs>
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d={`M -100 ${105 + i * 8} C 90 ${140 + i * 4}, 95 ${370 - i * 5}, 340 ${315 + i * 3} S 650 ${230 + i * 5}, 820 340`} fill="none" stroke="url(#gallery-wave-gold)" strokeWidth={i === 0 ? 2 : .6} />
          ))}
        </svg>
        <div className="hotel-gallery-container hotel-gallery-intro">
          <p className="hotel-gallery-kicker">AE HOTEL COLLECTION</p>
          <h1 id="hotel-gallery-title">{t('gallery.title')}</h1>
          <div className="hotel-gallery-ornament" aria-hidden="true"><span /><FaCamera /><span /></div>
          <p className="hotel-gallery-lead">Lüks otellərimizin unudulmaz anlarını kəşf edin.<br />Hər kadrda rahatlıq, zəriflik və səyahət ilhamı var.</p>
          <button className="hotel-gallery-explore" onClick={explore}><FaPlay aria-hidden="true" />Qalereyanı kəşf et</button>
        </div>
      </div>
      <div className="hotel-gallery-container hotel-gallery-grid" ref={gridRef}>
        {photos.map((photo, index) => (
          <button className="hotel-gallery-card" key={photo.file} onClick={() => openPhoto(photo)} aria-label={`${photo.caption} — böyüt`}>
            <img src={resolveImage(photo.file)} alt={photo.caption} loading={index < 3 ? 'eager' : 'lazy'} />
            <span className="hotel-gallery-caption"><FaImage aria-hidden="true" />{photo.caption}</span>
            <span className="hotel-gallery-expand" aria-hidden="true"><FaExpandAlt /></span>
          </button>
        ))}
      </div>
      <dialog className="hotel-gallery-lightbox" ref={dialogRef} aria-labelledby="hotel-gallery-photo-caption" onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current.close();
      }}>
        <button className="hotel-gallery-close" aria-label="Bağla" onClick={() => dialogRef.current.close()} autoFocus><FaTimes /></button>
        <figure><img src={resolveImage(selected.file)} alt={selected.caption} /><figcaption id="hotel-gallery-photo-caption">{selected.caption}</figcaption></figure>
      </dialog>
    </section>
  );
};
export default Gallery;
