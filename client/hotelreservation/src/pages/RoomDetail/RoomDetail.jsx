import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FaUsers, FaBed, FaExpand, FaCheck, FaArrowLeft } from 'react-icons/fa';
import BookingCard from '../../components/common/BookingCard/BookingCard';
import { getHotelById, getRoomById } from '../../data/hotelsData';
import './RoomDetail.css';

const RoomDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hotelId = searchParams.get('hotel');
  
  const [selectedImage, setSelectedImage] = useState(0);

  const hotel = getHotelById(hotelId);
  const room = hotel?.rooms.find(r => r.id === parseInt(id));

  if (!hotel || !room) {
    return (
      <div className="hotel-not-found">
        <h2>Otaq tapılmadı</h2>
        <Link to="/hotels" className="back-link">Otellərə qayıt</Link>
      </div>
    );
  }

  return (
    <div className="room-detail-page">
      <div className="room-detail-container">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> Geri
        </button>

        {/* Room Gallery */}
        <div className="room-gallery">
          <div className="room-main-image">
            <img src={room.images[selectedImage]} alt={room.name} />
          </div>
          <div className="room-thumbnails">
            {room.images.map((img, idx) => (
              <div 
                key={idx}
                className={`room-thumbnail ${selectedImage === idx ? 'active' : ''}`}
                onClick={() => setSelectedImage(idx)}
              >
                <img src={img} alt={`${room.name} ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Room Content */}
        <div className="room-detail-content">
          {/* Main Content */}
          <div className="room-main-content">
            {/* Header */}
            <div className="room-detail-header">
              <h1 className="room-title">{room.name}</h1>
              <p className="room-subtitle">{hotel.title}</p>
            </div>

            {/* Info Cards */}
            <div className="room-info-cards">
              <div className="room-info-card">
                <div className="room-info-icon">
                  <FaUsers />
                </div>
                <div className="room-info-text">
                  <span className="room-info-label">Tutum</span>
                  <span className="room-info-value">{room.capacity} nəfər</span>
                </div>
              </div>

              <div className="room-info-card">
                <div className="room-info-icon">
                  <FaBed />
                </div>
                <div className="room-info-text">
                  <span className="room-info-label">Yataq</span>
                  <span className="room-info-value">{room.bedType}</span>
                </div>
              </div>

              <div className="room-info-card">
                <div className="room-info-icon">
                  <FaExpand />
                </div>
                <div className="room-info-text">
                  <span className="room-info-label">Sahə</span>
                  <span className="room-info-value">{room.size}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <section className="room-section">
              <h2 className="room-section-title">Otaq Haqqında</h2>
              <p className="room-description-text">{room.description}</p>
            </section>

            {/* Amenities */}
            <section className="room-section">
              <h2 className="room-section-title">Otaq İmkanları</h2>
              <div className="room-amenities-grid">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="room-amenity-item">
                    <FaCheck className="room-amenity-icon" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Booking Sidebar */}
          <aside className="room-booking-sidebar" id="book">
            {room.available ? (
              <div className="availability-notice">
                ✓ Mövcuddur
              </div>
            ) : (
              <div className="availability-notice unavailable-notice">
                ✕ Mövcud deyil
              </div>
            )}
            
            <BookingCard hotel={{...hotel, pricePerNight: room.pricePerNight}} />

            {/* Link to Hotel */}
            <div className="hotel-link-card">
              <div className="hotel-link-title">Bu otaq yerləşir:</div>
              <div className="hotel-link-name">{hotel.title}</div>
              <Link to={`/hotels/${hotel.id}`} className="btn-view-hotel">
                Oteli göstər
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
