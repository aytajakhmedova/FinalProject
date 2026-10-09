import { Link } from 'react-router-dom';
import ImageGallery from '../../components/ImageGallery/ImageGallery';
import hotelimg1 from '../../assets/images/hotelimg1.jfif';
import hotelimg2 from '../../assets/images/hotelimg2.jfif';
import hotelimg3 from '../../assets/images/hotelimg3.jfif';
import hotelimg4 from '../../assets/images/hotelimg4.jfif';
import hotelimg5 from '../../assets/images/hotelimg5.jfif';
import hotelimg6 from '../../assets/images/hotelimg6.jfif';
import hotelimg7 from '../../assets/images/hotelimg7.jfif';
import '../contentPages.css';

const photos = [
  { src: hotelimg1, caption: 'Gecə şəhər mənzərəsi' },
  { src: hotelimg2, caption: 'Otel girişi' },
  { src: hotelimg3, caption: 'Dənizə baxan otaq' },
  { src: hotelimg4, caption: 'Fəvvarə və işıqlar' },
  { src: hotelimg5, caption: 'Sahil yataq otağı' },
  { src: hotelimg6, caption: 'Dam hovuzu' },
  { src: hotelimg7, caption: 'Şəhər suitı' },
];

const Gallery = () => {
  return (
    <>
      <ImageGallery />
      <section className="fill-wrap">
        <p className="fill-kicker">Kolleksiya</p>
        <h2 className="fill-title">Otel kadrları</h2>
        <p className="fill-lead">
          Lobbidən hovuza, gecə işıqlarından suitə qədər. Şəklə baxıb bəyəndiyiniz oteli siyahıdan seçə bilərsiniz.
        </p>
        <div className="gallery-grid">
          {photos.map((photo) => (
            <figure key={photo.caption}>
              <img src={photo.src} alt={photo.caption} />
              <figcaption>{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
        <p className="gallery-note">
          <Link to="/hotels">Otellərə keç →</Link>
        </p>
      </section>
    </>
  );
};

export default Gallery;
