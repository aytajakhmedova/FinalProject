import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaBed, FaExpand } from 'react-icons/fa';
import './RoomCard.css';

const RoomCard = ({ room, hotelId }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Yalnız ilk 3 şəkili göstər
  const displayImages = room.images.slice(0, 3);

  return (
    <>
      <div className="room-card">
        <div 
          className="room-card-image" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Şəkilə klik edildi!', { showModal, displayImages });
            setShowModal(true);
          }}
          style={{ cursor: 'pointer' }}
        >
          <img src={room.images[0]} alt={room.name} />
          {!room.available && (
            <div className="room-unavailable-badge">Mövcud deyil</div>
          )}
          {room.images.length > 1 && (
            <div className="room-image-count">
              📷 {Math.min(room.images.length, 3)} şəkil
            </div>
          )}
        </div>

        <div className="room-card-content">
          <div className="room-card-header">
            <h3 className="room-card-title">{room.name}</h3>
            <p className="room-card-description">{room.description}</p>
          </div>

          <div className="room-features">
            <div className="room-feature">
              <FaUsers />
              <span>{room.capacity} nəfər</span>
            </div>
            <div className="room-feature">
              <FaBed />
              <span>{room.bedType}</span>
            </div>
            <div className="room-feature">
              <FaExpand />
              <span>{room.size}</span>
            </div>
          </div>

          <div className="room-amenities-list">
            {room.amenities.slice(0, 4).map((amenity, idx) => (
              <span key={idx} className="room-amenity-chip">{amenity}</span>
            ))}
            {room.amenities.length > 4 && (
              <span className="room-amenity-chip">+{room.amenities.length - 4} daha</span>
            )}
          </div>

          <div className="room-card-footer">
            <div className="room-price-section">
              <span className="room-price-label">Gecəlik qiymət</span>
              <span className="room-price-amount">₼{room.pricePerNight}</span>
            </div>
            <div className="room-actions">
              <Link 
                to={`/rooms/${room.id}?hotel=${hotelId}`} 
                className="btn-room-detail"
              >
                Ətraflı
              </Link>
              {room.available ? (
                <Link 
                  to={`/rooms/${room.id}?hotel=${hotelId}#book`} 
                  className="btn-room-book"
                >
                  Rezervasiya et
                </Link>
              ) : (
                <button className="btn-room-book" disabled>
                  Mövcud deyil
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showModal && (
        <div 
          className="room-gallery-modal" 
          onClick={() => {
            console.log('Modal background-a klik edildi');
            setShowModal(false);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="room-modal-content" onClick={(e) => {
            console.log('Modal content-ə klik edildi');
            e.stopPropagation();
          }}>
            <button 
              className="room-modal-close" 
              onClick={() => {
                console.log('Close düyməsinə klik edildi');
                setShowModal(false);
              }}
            >
              ✕
            </button>
            
            <div className="room-modal-main-image">
              <img src={displayImages[selectedImage]} alt={room.name} />
            </div>

            <div className="room-modal-thumbnails">
              {displayImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`room-modal-thumb ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => {
                    console.log('Thumbnail klik edildi:', idx);
                    setSelectedImage(idx);
                  }}
                >
                  <img src={img} alt={`${room.name} ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomCard;
