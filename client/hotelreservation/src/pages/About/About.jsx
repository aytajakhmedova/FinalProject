import HolidaySection from '../../components/HolidaySection/HolidaySection';
import { MEDIA } from '../../data/localMedia';
import '../contentPages.css';

const stories = [
  {
    image: MEDIA.aeHotel,
    title: 'Otel, uçuş və tur bir yerdə',
    text: 'Qalmağı, uçuşu və transferi ayrı-ayrı axtarmağa ehtiyac qalmır. Hamısı bir bronun içindədir.',
  },
  {
    image: MEDIA.hotelDining,
    title: 'Şəhər və dəniz mənzərəsi',
    text: 'Bakıdan Dubaya qədər hovuz, suit və gecə işıqları olan otelləri bir kolleksiyada toplayırıq.',
  },
  {
    image: MEDIA.tourBalloons,
    title: 'Səyahət boyu dəstək',
    text: 'Girişdən çıxışa qədər Azərbaycan dilində yazın. Sualınız gecə də cavabsız qalmır.',
  },
];

const About = () => {
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
          <article className="stat-card"><strong>8</strong><span>otel kolleksiyada</span></article>
          <article className="stat-card"><strong>5</strong><span>ölkə istiqaməti</span></article>
          <article className="stat-card"><strong>7/24</strong><span>canlı dəstək</span></article>
          <article className="stat-card"><strong>4.8</strong><span>orta qonaq reytinqi</span></article>
        </div>
        <div className="story-grid">
          {stories.map((item) => (
            <article className="story-card" key={item.title}>
              <img src={item.image} alt={item.title} />
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
