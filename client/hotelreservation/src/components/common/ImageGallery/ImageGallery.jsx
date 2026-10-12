import React, { useCallback, useEffect, useRef, useState } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ images, title }) => {
  const slides = images || [];
  const count = slides.length;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [outgoing, setOutgoing] = useState(null);
  const [direction, setDirection] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [paused, setPaused] = useState(false);
  const [didSlide, setDidSlide] = useState(false);
  const currentRef = useRef(0);

  currentRef.current = currentSlide;

  const goTo = useCallback((index, dir = 1) => {
    if (!count) return;
    const next = (index + count) % count;
    if (next === currentRef.current) return;
    setOutgoing(currentRef.current);
    setDirection(dir);
    setDidSlide(true);
    setCurrentSlide(next);
  }, [count]);

  const nextSlide = () => goTo(currentSlide + 1, 1);
  const prevSlide = () => goTo(currentSlide - 1, -1);

  useEffect(() => {
    if (outgoing === null) return undefined;
    const timer = setTimeout(() => setOutgoing(null), 720);
    return () => clearTimeout(timer);
  }, [outgoing, currentSlide]);

  useEffect(() => {
    if (paused || count < 2) return undefined;
    const interval = setInterval(() => {
      goTo(currentRef.current + 1, 1);
    }, 4500);
    return () => clearInterval(interval);
  }, [paused, count, goTo]);

  if (!count) return null;

  const prevIndex = (currentSlide - 1 + count) % count;
  const nextIndex = (currentSlide + 1) % count;
  const dirClass = direction > 0 ? 'dir-next' : 'dir-prev';

  return (
    <>
      <div
        className="image-gallery-component"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className={`gallery-stage ${count < 2 ? 'single' : ''}`}>
          {count > 1 && (
            <button type="button" className="gallery-peek" onClick={prevSlide} aria-label="Əvvəlki şəkil">
              <img key={prevIndex} src={slides[prevIndex]} alt="" className="peek-img" />
            </button>
          )}

          <div className="gallery-main">
            <div className="gallery-viewport">
              {outgoing !== null && (
                <img
                  key={`out-${outgoing}`}
                  src={slides[outgoing]}
                  alt=""
                  className={`gallery-layer is-out ${dirClass}`}
                />
              )}
              <img
                key={`in-${currentSlide}`}
                src={slides[currentSlide]}
                alt={`${title || 'Qalereya'} ${currentSlide + 1}`}
                className={`gallery-layer is-in ${didSlide ? dirClass : 'is-static'}`}
              />
            </div>

            <button
              type="button"
              className="gallery-main-open"
              onClick={() => setShowModal(true)}
              aria-label="Şəkli böyüt"
            />

            {count > 1 && (
              <>
                <button
                  type="button"
                  className="carousel-btn prev"
                  onClick={prevSlide}
                  aria-label="Əvvəlki"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="carousel-btn next"
                  onClick={nextSlide}
                  aria-label="Növbəti"
                >
                  ›
                </button>
                <div className={`gallery-progress ${paused ? 'is-paused' : ''}`} key={currentSlide} />
                <span className="gallery-counter">
                  {currentSlide + 1} / {count}
                </span>
              </>
            )}
          </div>

          {count > 1 && (
            <button type="button" className="gallery-peek" onClick={nextSlide} aria-label="Növbəti şəkil">
              <img key={nextIndex} src={slides[nextIndex]} alt="" className="peek-img" />
            </button>
          )}
        </div>

        {count > 1 && (
          <div className="gallery-thumbs">
            {slides.map((img, idx) => (
              <button
                type="button"
                key={`${img}-${idx}`}
                className={currentSlide === idx ? 'active' : ''}
                onClick={() => goTo(idx, idx > currentSlide ? 1 : -1)}
                aria-label={`Şəkil ${idx + 1}`}
              >
                <img src={img} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="gallery-modal" onClick={() => setShowModal(false)}>
          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="gallery-close" onClick={() => setShowModal(false)}>
              ✕
            </button>
            <img src={slides[currentSlide]} alt={title} />
            {count > 1 && (
              <div className="gallery-nav">
                {slides.map((_, idx) => (
                  <button
                    type="button"
                    key={idx}
                    className={currentSlide === idx ? 'active' : ''}
                    onClick={() => goTo(idx, idx > currentSlide ? 1 : -1)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
