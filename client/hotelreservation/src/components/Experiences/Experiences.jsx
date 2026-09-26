import { FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { EXPERIENCES, formatPrice } from '../../data/travelData';
import './Experiences.css';

const Experiences = ({ currency, onBook }) => {
  return (
    <section className="experiences-section" id="tours">
      <div className="experiences-container">
        <div className="experiences-intro">
          <p className="eyebrow">Səyahət təcrübələri</p>
          <h2>Oteldən əlavə — tur, safari və spa</h2>
          <p>Məkanı bron etdikdən sonra eyni gündə macəra və wellness paketlərini də əlavə edin.</p>
        </div>
        <div className="experiences-grid">
          {EXPERIENCES.map((item, i) => (
            <article
              key={item.id}
              className="xp-card"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="xp-media">
                <img src={item.image} alt={item.title} />
                <span>{item.category}</span>
              </div>
              <div className="xp-body">
                <h3>{item.title}</h3>
                <p>
                  <FaMapMarkerAlt /> {item.location}
                  <FaClock /> {item.duration}
                </p>
                <div className="xp-footer">
                  <strong>{formatPrice(item.price, currency)}</strong>
                  <button onClick={() => onBook(item)}>Əlavə et</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
