import React, { useState } from 'react';
import './Destinations.css';

const Destinations = () => {
  const [activeTab, setActiveTab] = useState('Turkey');

  const destinations = [
    {
      country: 'Turkey',
      image: '/turkey.jpg',
      description: 'Fiyatlar, 2 yetişkin standart gecelik ortalama fiyat analizine göredir.',
      months: [
        { name: 'Şubat', priceRange: '₺2.380 - ₺11.300' },
        { name: 'Mart', priceRange: '₺2.395 - ₺11.610' },
        { name: 'Nisan', priceRange: '₺2.750 - ₺13.275' },
        { name: 'Mayıs', priceRange: '₺2.945 - ₺14.100' },
        { name: 'Haziran', priceRange: '₺3.235 - ₺15.900' },
        { name: 'Temmuz', priceRange: '₺3.160 - ₺15.750' }
      ]
    },
    {
      country: 'Italy',
      image: '/italy.jpg',
      description: 'Fiyatlar, 2 yetişkin standart gecelik ortalama fiyat analizine göredir.',
      months: [
        { name: 'Şubat', priceRange: '€180 - €850' },
        { name: 'Mart', priceRange: '€195 - €920' },
        { name: 'Nisan', priceRange: '€220 - €1.050' },
        { name: 'Mayıs', priceRange: '€250 - €1.180' },
        { name: 'Haziran', priceRange: '€280 - €1.320' },
        { name: 'Temmuz', priceRange: '€310 - €1.450' }
      ]
    },
    {
      country: 'Azerbaijan',
      image: '/azerbaijan.jpg',
      description: 'Fiyatlar, 2 yetişkin standart gecelik ortalama fiyat analizine göredir.',
      months: [
        { name: 'Şubat', priceRange: '₼150 - ₼750' },
        { name: 'Mart', priceRange: '₼165 - ₼820' },
        { name: 'Nisan', priceRange: '₼180 - ₼890' },
        { name: 'Mayıs', priceRange: '₼200 - ₼960' },
        { name: 'Haziran', priceRange: '₼220 - ₼1.050' },
        { name: 'Temmuz', priceRange: '₼240 - ₼1.120' }
      ]
    },
    {
      country: 'Spain',
      image: '/spain.jpg',
      description: 'Fiyatlar, 2 yetişkin standart gecelik ortalama fiyat analizine göredir.',
      months: [
        { name: 'Şubat', priceRange: '€170 - €820' },
        { name: 'Mart', priceRange: '€185 - €890' },
        { name: 'Nisan', priceRange: '€210 - €980' },
        { name: 'Mayıs', priceRange: '€240 - €1.120' },
        { name: 'Haziran', priceRange: '€270 - €1.260' },
        { name: 'Temmuz', priceRange: '€300 - €1.400' }
      ]
    },
    {
      country: 'Greece',
      image: '/greece.jpg',
      description: 'Fiyatlar, 2 yetişkin standart gecelik ortalama fiyat analizine göredir.',
      months: [
        { name: 'Şubat', priceRange: '€160 - €780' },
        { name: 'Mart', priceRange: '€175 - €850' },
        { name: 'Nisan', priceRange: '€200 - €920' },
        { name: 'Mayıs', priceRange: '€230 - €1.050' },
        { name: 'Haziran', priceRange: '€260 - €1.180' },
        { name: 'Temmuz', priceRange: '€290 - €1.320' }
      ]
    }
  ];

  const activeDestination = destinations.find(d => d.country === activeTab);

  return (
    <section className="destinations-section">
      <div className="destinations-container">
        <h2 className="destinations-title">
          Bir sonraki konaklamanızı rezerve etmək için ən iyi zamanı kəşfedin
        </h2>

        <div className="destinations-tabs">
          {destinations.map((dest) => (
            <button
              key={dest.country}
              className={`tab-btn ${activeTab === dest.country ? 'active' : ''}`}
              onClick={() => setActiveTab(dest.country)}
            >
              {dest.country}
            </button>
          ))}
        </div>

        <div className="destinations-content">
          <div className="destination-image">
            <img src={activeDestination.image} alt={activeDestination.country} />
          </div>

          <div className="destination-prices">
            {activeDestination.months.map((month, index) => (
              <div key={index} className="price-row">
                <span className="month-name">{month.name}</span>
                <span className="price-range">{month.priceRange}</span>
                <span className="arrow">›</span>
              </div>
            ))}
            <p className="price-note">{activeDestination.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Destinations;
