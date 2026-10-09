import React from 'react';
import hotelimg1 from '../../assets/images/hotelimg1.jfif';
import hotelimg2 from '../../assets/images/hotelimg2.jfif';
import hotelimg3 from '../../assets/images/hotelimg3.jfif';
import hotelimg4 from '../../assets/images/hotelimg4.jfif';
import hotelimg5 from '../../assets/images/hotelimg5.jfif';
import hotelimg6 from '../../assets/images/hotelimg6.jfif';
import hotelimg7 from '../../assets/images/hotelimg7.jfif';
import './ImageGallery.css';

const ImageGallery = () => {
  const images = [
    hotelimg1,
    hotelimg2,
    hotelimg4,
    hotelimg6,
    hotelimg3,
    hotelimg5,
    hotelimg7
  ];

  return (
    <section className="image-gallery-section" id="gallery">
      <h2 className="gallery-title">AE Hotel dünyası</h2>
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
