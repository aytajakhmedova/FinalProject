import { Link } from 'react-router-dom';
import ImageGallery from '../../components/ImageGallery/ImageGallery';
import { useSiteContent } from '../../context/SiteContentContext';
import { resolveImage } from '../../api/client';
import '../contentPages.css';

const Gallery = () => {
  const { content, loading, error } = useSiteContent();
  const photos = (content?.slides || []).map((slide) => ({
    src: resolveImage(slide.imageUrl),
    caption: slide.title || slide.description,
  })).filter((photo) => photo.src);

  return (
    <>
      <ImageGallery />
      <section className="fill-wrap">
        <p className="fill-kicker">Kolleksiya</p>
        <h2 className="fill-title">{content?.settings?.galleryTitle || 'Otel kadrları'}</h2>
        {loading && <p className="fill-lead">Yüklənir...</p>}
        {error && photos.length === 0 && <p className="fill-lead">{error}</p>}
        {photos.length > 0 && (
          <>
            <p className="fill-lead">
              Lobbidən hovuza, gecə işıqlarından suitə qədər. Şəklə baxıb bəyəndiyiniz oteli siyahıdan seçə bilərsiniz.
            </p>
            <div className="gallery-grid">
              {photos.map((photo) => (
                <figure key={photo.caption + photo.src}>
                  <img src={photo.src} alt={photo.caption} />
                  <figcaption>{photo.caption}</figcaption>
                </figure>
              ))}
            </div>
          </>
        )}
        <p className="gallery-note">
          <Link to="/hotels">Otellərə keç →</Link>
        </p>
      </section>
    </>
  );
};

export default Gallery;
