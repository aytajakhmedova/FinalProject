import Testimonials from '../../components/Testimonials/Testimonials';
import '../contentPages.css';

const extraReviews = [
  {
    name: 'Kamran Quliyev',
    place: 'Dubay',
    stars: '★★★★★',
    text: 'Sky bar və infinity hovuz gözlədiyimdən sakit idi. Otaq gecə mənzərəsi ilə açılır.',
  },
  {
    name: 'Aysel Məmmədova',
    place: 'Malta',
    stars: '★★★★★',
    text: 'Spa saatı və dənizə baxan səhər yeməyi tətilin ən yaxşı hissəsi oldu.',
  },
  {
    name: 'Elvin Hüseynli',
    place: 'Bakı',
    stars: '★★★★☆',
    text: 'Hava limanından transfer vaxtında gəldi. Suit təmiz idi, şəhər işıqları aydın görünürdü.',
  },
];

const ReviewsPage = () => {
  return (
    <>
      <Testimonials />
      <section className="fill-wrap">
        <div className="stat-row">
          <article className="stat-card"><strong>4.8</strong><span>orta qiymət</span></article>
          <article className="stat-card"><strong>6</strong><span>son qonaq rəyi</span></article>
          <article className="stat-card"><strong>92%</strong><span>yenidən seçərdi</span></article>
          <article className="stat-card"><strong>7/24</strong><span>dəstəyə yazmaq</span></article>
        </div>
        <p className="fill-kicker">Daha çox rəy</p>
        <h2 className="fill-title">Qonaqlar nəyi xatırlayır</h2>
        <div className="review-grid">
          {extraReviews.map((item) => (
            <article className="review-card" key={item.name}>
              <p className="stars">{item.stars}</p>
              <h3>{item.name}</h3>
              <p>{item.place}</p>
              <p className="review-text">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default ReviewsPage;
