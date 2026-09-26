import React from 'react';
import hoteltheme1 from '../../assets/images/hotelthme1.jpg';
import hoteltheme2 from '../../assets/images/hotelthme2.jpg';
import hoteltheme3 from '../../assets/images/hotelthme3.jpg';
import hoteltheme4 from '../../assets/images/hotelthme4.jpg';
import hoteltheme5 from '../../assets/images/hotelthme5.jpg';
import hoteltheme6 from '../../assets/images/hotelthme6.jpg';
import hoteltheme7 from '../../assets/images/hotelthme7.png';
import hoteltheme8 from '../../assets/images/hotelthme8.jpg';
import hoteltheme9 from '../../assets/images/hotelthme9.jpg';
import hoteltheme10 from '../../assets/images/hotelthme10.jpg';
import './ImageGallery.css';

const ImageGallery = () => {
  const images = [
    hoteltheme1,
    hoteltheme2,
    hoteltheme3,
    hoteltheme4,
    hoteltheme5,
    hoteltheme6,
    hoteltheme7,
    hoteltheme8,
    hoteltheme9,
    hoteltheme10
  ];

  return (
    <section className="image-gallery-section" id="gallery">
      <h2 className="gallery-title">OtelBurada dünyası</h2>
      <div className="gallery-slider">
        <div className="gallery-track">
          {/* 3 dəfə təkrarlayırıq ki, sonsuz smooth loop olsun */}
          {[...images, ...images, ...images].map((img, index) => (
            <div key={index} className="gallery-item">
              <img src={img} alt={`Gallery ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;
