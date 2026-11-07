import { useEffect, useState } from 'react';
import HolidaySection from '../../components/HolidaySection/HolidaySection';
import { getHotels, resolveImage } from '../../api/client';
import { useSiteContent } from '../../context/SiteContentContext';
import '../contentPages.css';

const storyTexts = [
  {
    title: 'Otel, uçuş və tur bir yerdə',
    text: 'Qalmağı, uçuşu və transferi ayrı-ayrı axtarmağa ehtiyac qalmır. Hamısı bir bronun içindədir.',
  },
  {
    title: 'Şəhər və dəniz mənzərəsi',
    text: 'Bakıdan Dubaya qədər hovuz, suit və gecə işıqları olan otelləri bir kolleksiyada toplayırıq.',
  },
  {
    title: 'Səyahət boyu dəstək',
    text: 'Girişdən çıxışa qədər Azərbaycan dilində yazın. Sualınız gecə də cavabsız qalmır.',
  },
];

const About = () => {
  const { content } = useSiteContent();
  const settings = content?.settings;
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

  // The three story pictures are the ones configured for the site in the admin panel.
  const storyImages = [settings?.advantagesImageUrl, settings?.heroFloatImage1Url, settings?.heroFloatImage2Url]
    .map(resolveImage);
  const stories = storyTexts.map((item, index) => ({ ...item, image: storyImages[index] }));

  const countryCount = new Set(hotels.map((hotel) => hotel.country).filter(Boolean)).size;
  const rated = hotels.filter((hotel) => Number(hotel.rating) > 0);
  const averageRating = rated.length
    ? (rated.reduce((sum, hotel) => sum + Number(hotel.rating), 0) / rated.length).toFixed(1)
    : settings?.advantagesRating;

  return (
    <>
      <HolidaySection />
      <section className="fill-wrap">
        <p className="fill-kicker">AE Hotel</p>
        <h2 className="fill-title">Bir ünvan, tam səyahət</h2>
        <p className="fill-lead">
          AE Hotel otel tapmaqdan başlayır, amma bununla bitmir. Uçuş, tur və transferi eyni səbətdə
          saxlayırıq ki, tətil planı bir neçə sayta səpələnməsin.
        </p>
        <div className="stat-row">
          {hotels.length > 0 && <article className="stat-card"><strong>{hotels.length}</strong><span>otel kolleksiyada</span></article>}
          {countryCount > 0 && <article className="stat-card"><strong>{countryCount}</strong><span>ölkə istiqaməti</span></article>}
          {settings?.heroSupportBadge && <article className="stat-card"><strong>{settings.heroSupportBadge}</strong><span>canlı dəstək</span></article>}
          {averageRating && <article className="stat-card"><strong>{averageRating}</strong><span>orta qonaq reytinqi</span></article>}
        </div>
        <div className="story-grid">
          {stories.map((item) => (
            <article className="story-card" key={item.title}>
              {item.image && <img src={item.image} alt={item.title} />}
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default About;
