import { useState } from 'react';
import { DESTINATIONS } from '../../data/travelData';
import './Destinations.css';

const Destinations = ({ onPickCity }) => {
  const [activeTab, setActiveTab] = useState(DESTINATIONS[0].country);

  const activeDestination = DESTINATIONS.find((d) => d.country === activeTab);

  return (
    <section className="destinations-section" id="destinations">
      <div className="destinations-container">
        <p className="eyebrow center">Mövsüm qiymətləri</p>
        <h2 className="destinations-title">
          Növbəti səyahəti nə vaxt bron etmək daha sərfəlidir?
        </h2>

        <div className="destinations-tabs">
          {DESTINATIONS.map((dest) => (
            <button
              key={dest.country}
              className={`tab-btn ${activeTab === dest.country ? 'active' : ''}`}
              onClick={() => setActiveTab(dest.country)}
            >
              {dest.country}
            </button>
          ))}
        </div>

        <div className="destinations-content" key={activeTab}>
          <div className="destination-image">
            <img src={activeDestination.image} alt={activeDestination.country} />
          </div>

          <div className="destination-prices">
            {activeDestination.months.map((month) => (
              <button
                key={month.name}
                className="price-row"
                onClick={() => onPickCity?.(activeDestination.country)}
              >
                <span className="month-name">{month.name}</span>
                <span className="price-range">{month.priceRange}</span>
                <span className="arrow">›</span>
              </button>
            ))}
            <p className="price-note">{activeDestination.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Destinations;
