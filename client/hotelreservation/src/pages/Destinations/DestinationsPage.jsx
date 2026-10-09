import { Link } from 'react-router-dom';
import Destinations from '../../components/Destinations/Destinations';
import { DESTINATIONS } from '../../data/travelData';
import '../contentPages.css';

const notes = {
  Azərbaycan: 'Bakı, Qəbələ və Şəki — şəhər, dağ və spa bir ölkədə.',
  Türkiyə: 'İstanbulun boğazı və Antalyanın sahili.',
  İtaliya: 'Roma və tarixi mərkəzlərdə butik qalmalar.',
  İspaniya: 'Şəhər otelləri və dəniz kənarı istirahət.',
  Yunanıstan: 'Adalar, sakit sahil və yüngül yay qiymətləri.',
};

const DestinationsPage = () => {
  return (
    <>
      <Destinations />
      <section className="fill-wrap">
        <p className="fill-kicker">İstiqamətlər</p>
        <h2 className="fill-title">Haradan başlamaq olar</h2>
        <p className="fill-lead">
          Mövsüm cədvəlində qiymət aralığını görün, sonra ölkəni seçib otel siyahısına keçin.
        </p>
        <div className="country-grid">
          {DESTINATIONS.map((item) => (
            <article className="country-card" key={item.country}>
              <img src={item.image} alt={item.country} />
              <div>
                <h3>{item.country}</h3>
                <p>{notes[item.country]}</p>
                <Link to="/hotels">Otellərə bax</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default DestinationsPage;
