import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaBed, FaExpand } from 'react-icons/fa';
import './RoomCard.css';

const RoomCard = ({ room, hotelId }) => {
  return (
    <div className="room-card">
      <div className="room-card-image">
        <img src={room.images[0]} alt={room.name} />
        {!room.available && (
          <div className="room-unavailable-badge">Mövcud deyil</div>
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
  );
};

export default RoomCard;
