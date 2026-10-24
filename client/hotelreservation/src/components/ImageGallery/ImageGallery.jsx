import React from 'react';
import { useSiteContent } from '../../context/SiteContentContext';
import { resolveImage } from '../../api/client';
import './ImageGallery.css';

const ImageGallery = () => {
  const { content, loading, error } = useSiteContent();
  const title = content?.settings?.galleryTitle;
  const images = (content?.slides || []).map((slide) => ({
    src: resolveImage(slide.imageUrl),
    alt: slide.title || slide.description,
  })).filter((item) => item.src);

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
        <h2 className="gallery-title">Yüklənir...</h2>
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
