import { Link } from 'react-router-dom';
import ImageGallery from '../../components/ImageGallery/ImageGallery';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { resolveImage } from '../../api/client';
import { GALLERY_EXTRAS } from '../../data/localMedia';
import '../contentPages.css';

const Gallery = () => {
  const { t } = useLanguage();
  const { content, loading, error } = useSiteContent();
  const seen = new Set();
  const photos = [...(content?.slides || []).map((slide) => ({
    src: resolveImage(slide.imageUrl),
    caption: slide.title || slide.description,
  })), ...GALLERY_EXTRAS.map((item) => ({ src: item.src, caption: item.alt }))].filter((photo) => {
    if (!photo.src || seen.has(photo.src)) return false;
    seen.add(photo.src);
    return true;
  });

  return (
    <>
      <ImageGallery />
      <section className="fill-wrap">
        <p className="fill-kicker">{t('gallery.kicker')}</p>
        <h2 className="fill-title">{t('gallery.title')}</h2>
        {loading && <p className="fill-lead">{t('common.loading')}</p>}
        {error && photos.length === 0 && <p className="fill-lead">{error}</p>}
        {photos.length > 0 && (
          <>
            <p className="fill-lead">{t('gallery.lead')}</p>
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
          <Link to="/hotels">{t('footer.hotels')} →</Link>
        </p>
      </section>
    </>
  );
};

export default Gallery;
