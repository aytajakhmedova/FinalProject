import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { resolveImage } from '../../api/client';
import { GALLERY_EXTRAS } from '../../data/localMedia';
import './ImageGallery.css';

const ImageGallery = () => {
  const { t } = useLanguage();
  const { content, loading, error } = useSiteContent();
  const title = t('gallery.title');
  const seen = new Set();
  const images = [...(content?.slides || []).map((slide) => ({
    src: resolveImage(slide.imageUrl),
    alt: slide.title || slide.description,
  })), ...GALLERY_EXTRAS].filter((item) => {
    if (!item.src || seen.has(item.src)) return false;
    seen.add(item.src);
    return true;
  });

  if (error && images.length === 0) {
    return (
      <section className="image-gallery-section" id="gallery">
        <h2 className="gallery-title">{error}</h2>
      </section>
    );
  }

  if (loading && images.length === 0) {
    return (
      <section className="image-gallery-section" id="gallery">
        <h2 className="gallery-title">{t('common.loading')}</h2>
      </section>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="image-gallery-section" id="gallery">
      <h2 className="gallery-title">{title}</h2>
      <div className="gallery-slider">
        <div className="gallery-track">
          {[...images, ...images, ...images].map((img, index) => (
            <div key={`${img.src}-${index}`} className="gallery-item">
              <img src={img.src} alt={img.alt || `Gallery ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;
