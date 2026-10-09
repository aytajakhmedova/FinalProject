import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { getYoutubeId } from '../../data/travelData';
import './HotelVideoModal.css';

const HotelVideoModal = ({ hotel, onClose }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!hotel?.video) return null;
  const id = getYoutubeId(hotel.video);
  const localSrc = id ? '' : hotel.video;

  return (
    <div className="video-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="video-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${hotel.title} video turu`}
      >
        <div className="video-modal-head">
          <div>
            <p>Video tur</p>
            <h3>{hotel.title}</h3>
          </div>
          <button className="video-close" onClick={onClose} aria-label="Bağla">
            <FaTimes />
          </button>
        </div>
        <div className="video-frame">
          {localSrc ? (
            <video
              key={localSrc}
              src={localSrc}
              controls
              autoPlay
              playsInline
              aria-label={`${hotel.title} video turu`}
            />
          ) : id ? (
            <iframe
              src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
              title={`${hotel.title} video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <p className="video-fallback">Video tapılmadı</p>
          )}
        </div>
        {id && (
          <a className="video-open-yt" href={hotel.video} target="_blank" rel="noreferrer">
            YouTube-da aç
          </a>
        )}
      </div>
    </div>
  );
};

export default HotelVideoModal;
