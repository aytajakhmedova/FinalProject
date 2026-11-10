import { useEffect, useState } from 'react';
import { FaSuitcase, FaUsers, FaRegCalendarAlt, FaRegStar, FaMapMarkerAlt, FaArrowRight, FaPlane, FaGlobeEurope } from 'react-icons/fa';
import HolidaySection from '../../components/HolidaySection/HolidaySection';
import HotelVideoModal from '../../components/HotelVideoModal/HotelVideoModal';
import { getHotels, resolveImage } from '../../api/client';
import { useSiteContent } from '../../context/SiteContentContext';
import '../contentPages.css';
import './About.css';

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
  const [videoOpen, setVideoOpen] = useState(false);
  const video = resolveImage(settings?.heroVideoUrl);

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
      <div className="about-intro">
        <svg className="about-waves" viewBox="0 0 1600 850" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="about-gold"><stop stopColor="#ffd38a" /><stop offset=".3" stopColor="#a56a31" stopOpacity=".3" /><stop offset=".6" stopColor="#a66a31" stopOpacity=".1" /><stop offset=".83" stopColor="#ffcf7f" /><stop offset="1" stopColor="#ad6727" /></linearGradient>
            <linearGradient id="about-silk" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#b8732c" stopOpacity=".35" /><stop offset="1" stopColor="#3e2515" stopOpacity="0" /></linearGradient>
            <filter id="about-glow"><feGaussianBlur stdDeviation="7" /></filter>
          </defs>
          <path d="M-60 510 Q60 420 250 615 T770 780 T1290 715 T1670 745 L1670 900 H-60Z" fill="url(#about-silk)" />
          <path d="M-60 510 Q60 420 250 615 T770 780 T1290 715 T1670 745" fill="none" stroke="url(#about-gold)" strokeWidth="13" filter="url(#about-glow)" />
          <path d="M-60 510 Q60 420 250 615 T770 780 T1290 715 T1670 745" fill="none" stroke="url(#about-gold)" strokeWidth="2" />
          <path d="M-60 580 Q80 470 280 660 T800 830 T1330 775 T1670 815" fill="none" stroke="url(#about-gold)" strokeOpacity=".2" />
        </svg>
        <HolidaySection aboutPage reviewCount={hotels.reduce((sum, hotel) => sum + (Number(hotel.reviews) || 0), 0)} onPlayVideo={video ? () => setVideoOpen(true) : undefined} />
      </div>
      {videoOpen && <HotelVideoModal hotel={{ title: 'AE Hotel', video }} onClose={() => setVideoOpen(false)} />}
      <section className="about-story-section" id="about-story">
        <svg className="about-story-waves" viewBox="0 0 1600 800" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="story-gold"><stop stopColor="#ffe2a6" /><stop offset=".25" stopColor="#ac702c" stopOpacity=".3" /><stop offset=".55" stopColor="#ffd282" /><stop offset=".78" stopColor="#996024" stopOpacity=".3" /><stop offset="1" stopColor="#ffcf7b" /></linearGradient>
            <linearGradient id="story-silk" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ae6b26" stopOpacity=".4" /><stop offset="1" stopColor="#3f240e" stopOpacity="0" /></linearGradient>
            <filter id="story-glow"><feGaussianBlur stdDeviation="6" /></filter>
          </defs>
          <path d="M-60 190 Q70 325 340 290 T960 315 T1660 490 L1660 540 Q1300 455 960 365 T340 340 T-60 280Z" fill="url(#story-silk)" />
          <path d="M-60 660 Q280 430 610 540 T1190 640 T1660 730 L1660 850 H-60Z" fill="url(#story-silk)" />
          <g fill="none" stroke="url(#story-gold)" strokeWidth="12" filter="url(#story-glow)"><path d="M-60 215 Q150 355 440 300 T1030 360 T1660 495" /><path d="M-60 660 Q280 430 610 540 T1190 640 T1660 730" /></g>
          <g fill="none" stroke="url(#story-gold)" strokeWidth="1.6"><path d="M-60 215 Q150 355 440 300 T1030 360 T1660 495" /><path d="M-60 660 Q280 430 610 540 T1190 640 T1660 730" /><path d="M-40 755 Q220 850 520 790 T1140 810 T1680 680" /></g>
          <path d="M-40 325 Q220 245 500 355 T1080 410 T1660 555 M-40 735 Q280 500 620 625 T1160 720 T1660 800" fill="none" stroke="url(#story-gold)" strokeOpacity=".25" />
          <path d="M935 200 C1050 65 1255 10 1220 135 S1350 125 1400 70" fill="none" stroke="#b37a39" strokeOpacity=".55" strokeWidth="2" strokeDasharray="12 8" />
        </svg>
        <div className="about-story-globe" aria-hidden="true"><FaGlobeEurope /></div>
        <FaPlane className="about-story-plane" aria-hidden="true" />
        <div className="about-story-container">
        <div className="about-story-heading">
        <p className="fill-kicker">AE Hotel</p>
        <h2 className="fill-title">Bir ünvan, <em>tam səyahət</em></h2>
        <p className="fill-lead">
          AE Hotel otel tapmaqdan başlayır, amma bununla bitmir. Uçuş, tur və transferi eyni səbətdə
          saxlayırıq ki, tətil planı bir neçə sayta səpələnməsin.
        </p>
        <div className="stat-row">
          {hotels.length > 0 && <article className="stat-card"><FaSuitcase aria-hidden="true" /><div><strong>{hotels.length}</strong><span>otel kolleksiyada</span></div></article>}
          {countryCount > 0 && <article className="stat-card"><FaUsers aria-hidden="true" /><div><strong>{countryCount}</strong><span>ölkə istiqaməti</span></div></article>}
          {settings?.heroSupportBadge && <article className="stat-card"><FaRegCalendarAlt aria-hidden="true" /><div><strong>{settings.heroSupportBadge}</strong><span>canlı dəstək</span></div></article>}
          {averageRating && <article className="stat-card"><FaRegStar aria-hidden="true" /><div><strong>{averageRating}</strong><span>orta qonaq reytinqi</span></div></article>}
        </div>
        </div>
        <div className="story-grid">
          {stories.map((item) => (
            <article className="story-card" key={item.title}>
              {item.image && <img src={item.image} alt={item.title} />}
              <div className="about-story-card-copy">
                <h3><FaMapMarkerAlt aria-hidden="true" />{item.title}</h3>
                <p>{item.text}</p>
                <span className="about-story-arrow" aria-hidden="true"><FaArrowRight /></span>
              </div>
            </article>
          ))}
        </div>
        </div>
      </section>
    </>
  );
};

export default About;
