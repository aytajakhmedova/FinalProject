import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUsers, FaHotel, FaBed, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import { formatDate, calculateNights, getMinCheckInDate, getMinCheckOutDate } from '../../data/roomsData';
import './ReservationDetail.css';

const ReservationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [reservation, setReservation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Edit form state
  const [editCheckIn, setEditCheckIn] = useState('');
  const [editCheckOut, setEditCheckOut] = useState('');
  const [editGuests, setEditGuests] = useState(2);

  useEffect(() => {
    // Load reservation from localStorage
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const found = bookings.find(b => b.id.toString() === id);
    
    if (found) {
      setReservation(found);
      setEditCheckIn(found.checkIn);
      setEditCheckOut(found.checkOut);
      setEditGuests(found.guests);
    }
  }, [id]);

  if (!reservation) {
    return (
      <div className="reservation-detail-page">
        <div className="reservation-container">
          <div className="no-reservation">
            <FaExclamationTriangle />
            <h2>Rezervasiya tapılmadı</h2>
            <Link to="/dashboard" className="btn-back-dashboard">
              Dashboard-a qayıt
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const canEdit = reservation.status === 'confirmed';
  const canCancel = reservation.status === 'confirmed';

  const handleSaveEdit = () => {
    // Recalculate price
    const nights = calculateNights(editCheckIn, editCheckOut);
    const basePrice = reservation.room.pricePerNight || reservation.priceBreakdown.basePrice / reservation.nights;
    const newBasePrice = basePrice * nights;
    const extraGuests = Math.max(0, editGuests - 2);
    const extraGuestFee = extraGuests * 50 * nights;
    const subtotal = newBasePrice + extraGuestFee;
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    const updatedReservation = {
      ...reservation,
      checkIn: editCheckIn,
      checkOut: editCheckOut,
      guests: editGuests,
      nights,
      priceBreakdown: {
        nights,
        basePrice: newBasePrice,
        extraGuestFee,
        subtotal,
        taxRate: 0.18,
        tax: Math.round(tax * 100) / 100,
        total: Math.round(total * 100) / 100
      }
    };

    // Update localStorage
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const index = bookings.findIndex(b => b.id === reservation.id);
    if (index !== -1) {
      bookings[index] = updatedReservation;
      localStorage.setItem('userBookings', JSON.stringify(bookings));
      setReservation(updatedReservation);
      setIsEditing(false);
      alert('Rezervasiya uğurla yeniləndi!');
    }
  };

  const handleCancelBooking = () => {
    const updatedReservation = {
      ...reservation,
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    };

    // Update localStorage
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const index = bookings.findIndex(b => b.id === reservation.id);
    if (index !== -1) {
      bookings[index] = updatedReservation;
      localStorage.setItem('userBookings', JSON.stringify(bookings));
      setReservation(updatedReservation);
      setShowCancelModal(false);
      alert('Rezervasiya ləğv edildi');
    }
  };

  const getStatusBadge = () => {
    const badges = {
      confirmed: { text: 'Təsdiqlənib', className: 'status-confirmed', icon: <FaCheckCircle /> },
      'checked-in': { text: 'Qeydiyyatdan keçib', className: 'status-checked-in', icon: <FaCheckCircle /> },
      'checked-out': { text: 'Çıxış edilib', className: 'status-checked-out', icon: <FaCheckCircle /> },
      cancelled: { text: 'Ləğv edilib', className: 'status-cancelled', icon: <FaTimesCircle /> }
    };
    return badges[reservation.status] || badges.confirmed;
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="reservation-detail-page">
      <div className="reservation-container">
        {/* Header */}
        <div className="reservation-header">
          <button onClick={() => navigate('/dashboard')} className="back-button">
            <FaArrowLeft /> Dashboard
          </button>
          <h1 className="page-title">Rezervasiya Detalları</h1>
        </div>

        {/* Status Banner */}
        <div className={`status-banner ${statusBadge.className}`}>
          {statusBadge.icon}
          <span>{statusBadge.text}</span>
        </div>

        <div className="reservation-content">
          {/* Main Info Card */}
          <div className="reservation-info-section">
            <div className="info-card">
              <div className="card-header">
                <h2>Rezervasiya Məlumatları</h2>
                <div className="confirmation-number">#{reservation.id}</div>
              </div>

              <div className="hotel-room-info">
                <div className="info-row">
                  <FaHotel className="info-icon" />
                  <div>
                    <span className="info-label">Otel</span>
                    <strong>{reservation.hotel.name}</strong>
                  </div>
                </div>

                <div className="info-row">
                  <FaBed className="info-icon" />
                  <div>
                    <span className="info-label">Otaq</span>
                    <strong>{reservation.room.name}</strong>
                  </div>
                </div>
              </div>

              {isEditing ? (
                <>
                  <div className="edit-section">
                    <h3>Rezervasiyanı Redaktə Et</h3>
                    
                    <div className="edit-form">
                      <div className="form-group">
                        <label>Giriş tarixi</label>
                        <input
                          type="date"
                          value={editCheckIn}
                          min={getMinCheckInDate()}
                          onChange={(e) => setEditCheckIn(e.target.value)}
                          className="edit-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Çıxış tarixi</label>
                        <input
                          type="date"
                          value={editCheckOut}
                          min={getMinCheckOutDate(editCheckIn)}
                          onChange={(e) => setEditCheckOut(e.target.value)}
                          className="edit-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Qonaq sayı</label>
                        <select
                          value={editGuests}
                          onChange={(e) => setEditGuests(parseInt(e.target.value))}
                          className="edit-select"
                        >
                          {[...Array(8)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1} nəfər
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="edit-actions">
                      <button onClick={handleSaveEdit} className="btn-save">
                        <FaCheckCircle /> Yadda saxla
                      </button>
                      <button onClick={() => setIsEditing(false)} className="btn-cancel-edit">
                        Ləğv et
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="booking-dates">
                    <div className="date-item">
                      <FaCalendarAlt />
                      <div>
                        <span className="date-label">Giriş</span>
                        <strong>{formatDate(reservation.checkIn)}</strong>
                      </div>
                    </div>

                    <div className="date-item">
                      <FaCalendarAlt />
                      <div>
                        <span className="date-label">Çıxış</span>
                        <strong>{formatDate(reservation.checkOut)}</strong>
                      </div>
                    </div>

                    <div className="date-item">
                      <FaUsers />
                      <div>
                        <span className="date-label">Qonaqlar</span>
                        <strong>{reservation.guests} nəfər</strong>
                      </div>
                    </div>
                  </div>

                  <div className="booking-nights">
                    <span className="nights-count">{reservation.nights} gecə qalma</span>
                  </div>
                </>
              )}
            </div>

            {/* Guest Info */}
            <div className="info-card">
              <h3>Qonaq Məlumatları</h3>
              <div className="guest-info">
                <div className="guest-detail">
                  <span className="guest-label">Ad Soyad</span>
                  <strong>{reservation.guestName}</strong>
                </div>
                <div className="guest-detail">
                  <span className="guest-label">Email</span>
                  <strong>{reservation.guestEmail}</strong>
                </div>
                <div className="guest-detail">
                  <span className="guest-label">Telefon</span>
                  <strong>{reservation.guestPhone}</strong>
                </div>
              </div>

              {reservation.specialRequests && (
                <div className="special-requests">
                  <h4>Xüsusi İstəklər</h4>
                  <p>{reservation.specialRequests}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!isEditing && (
              <div className="action-buttons">
                {canEdit && (
                  <button onClick={() => setIsEditing(true)} className="btn-edit">
                    <FaEdit /> Redaktə Et
                  </button>
                )}
                {canCancel && (
                  <button onClick={() => setShowCancelModal(true)} className="btn-cancel-booking">
                    <FaTrash /> Rezervasiyanı Ləğv Et
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Price Summary Sidebar */}
          <aside className="price-summary-sidebar">
            <div className="summary-card">
              <h3>Qiymət Xülasəsi</h3>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>{reservation.nights} gecə</span>
                  <span>₼{reservation.priceBreakdown.basePrice}</span>
                </div>

                {reservation.priceBreakdown.extraGuestFee > 0 && (
                  <div className="summary-row">
                    <span>Əlavə qonaq</span>
                    <span>₼{reservation.priceBreakdown.extraGuestFee}</span>
                  </div>
                )}

                <div className="summary-row">
                  <span>Ara cəm</span>
                  <span>₼{reservation.priceBreakdown.subtotal}</span>
                </div>

                <div className="summary-row">
                  <span>Vergi (18%)</span>
                  <span>₼{reservation.priceBreakdown.tax}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row summary-total">
                  <span>Yekun</span>
                  <strong>₼{reservation.priceBreakdown.total}</strong>
                </div>
              </div>
            </div>

            <div className="booking-info-card">
              <h4>Rezervasiya Tarixi</h4>
              <p>{new Date(reservation.bookingDate).toLocaleDateString('az-AZ')}</p>
            </div>
          </aside>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <FaExclamationTriangle className="modal-icon warning" />
              <h3>Rezervasiyanı ləğv et?</h3>
            </div>
            <div className="modal-body">
              <p>Bu rezervasiyanı ləğv etmək istədiyinizdən əminsiniz?</p>
              <p className="warning-text">Bu əməliyyat geri qaytarıla bilməz.</p>
            </div>
            <div className="modal-actions">
              <button onClick={handleCancelBooking} className="btn-confirm-cancel">
                Bəli, ləğv et
              </button>
              <button onClick={() => setShowCancelModal(false)} className="btn-keep">
                Xeyr, saxla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationDetail;
