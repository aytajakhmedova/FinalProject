import React, { useState } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showModal, setShowModal] = useState(false);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="image-gallery-component">
        <div className="gallery-main-image" onClick={() => setShowModal(true)}>
          <img src={images[selectedImage]} alt={title} />
        </div>
        <div className="gallery-thumbnails-grid">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`gallery-thumbnail ${selectedImage === idx ? 'active' : ''}`}
              onClick={() => setSelectedImage(idx)}
            >
              <img src={img} alt={`${title} ${idx + 1}`} />
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="gallery-modal" onClick={() => setShowModal(false)}>
          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="gallery-close" onClick={() => setShowModal(false)}>
              ✕
            </button>
            <img src={images[selectedImage]} alt={title} />
            <div className="gallery-nav">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={selectedImage === idx ? 'active' : ''}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
