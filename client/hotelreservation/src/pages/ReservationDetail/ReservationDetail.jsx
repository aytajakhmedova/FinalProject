import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams, Navigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUsers, FaHotel, FaBed, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import { getAuthToken } from '../../api/auth';
import { deleteBooking, emailBookingReceipt, getBooking, updateBookingDetails } from '../../api/client';
import { printBookingReceipt } from '../../utils/printReceipt';
import './ReservationDetail.css';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(String(dateString).slice(0, 10));
  if (Number.isNaN(date.getTime())) return String(dateString);
  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
    'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr',
  ];
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
};

const dateInputValue = (value) => (value ? String(value).slice(0, 10) : '');

const ReservationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [saving, setSaving] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [isEditing, setIsEditing] = useState(searchParams.get('edit') === '1');
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Edit form state
  const [editCheckIn, setEditCheckIn] = useState('');
  const [editCheckOut, setEditCheckOut] = useState('');
  const [editGuests, setEditGuests] = useState(2);

  useEffect(() => {
    if (!getAuthToken()) return undefined;
    let cancelled = false;
    setLoading(true);
    setLoadError('');
    getBooking(id)
      .then((found) => {
        if (cancelled) return;
        setReservation(found);
        setEditCheckIn(dateInputValue(found.checkIn));
        setEditCheckOut(dateInputValue(found.checkOut));
        setEditGuests(found.guests || 1);
      })
      .catch((error) => {
        if (!cancelled) {
          setReservation(null);
          setLoadError(error.message || 'Rezervasiya yüklənmədi');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!getAuthToken()) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="reservation-detail-page">
        <div className="reservation-container">
          <div className="no-reservation">
            <h2>Rezervasiya yüklənir...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="reservation-detail-page">
        <div className="reservation-container">
          <div className="no-reservation">
            <FaExclamationTriangle />
            <h2>{loadError || 'Rezervasiya tapılmadı'}</h2>
            <Link to="/dashboard" className="btn-back-dashboard">
              Dashboard-a qayıt
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const bookingType = (reservation.bookingType || 'hotel').toLowerCase();
  const canEdit = bookingType === 'hotel' && reservation.status === 'confirmed';
  const canCancel = reservation.status === 'confirmed';

  const handleSaveEdit = async () => {
    if (!editCheckIn || !editCheckOut || editCheckOut <= editCheckIn) {
      setActionError('Çıxış tarixi girişdən sonra olmalıdır');
      return;
    }

    setSaving(true);
    setActionError('');
    try {
      const updatedReservation = await updateBookingDetails(reservation.id, {
        checkIn: editCheckIn,
        checkOut: editCheckOut,
        guests: editGuests,
        specialRequests: reservation.specialRequests || '',
      });
      setReservation(updatedReservation);
      setEditCheckIn(dateInputValue(updatedReservation.checkIn));
      setEditCheckOut(dateInputValue(updatedReservation.checkOut));
      setEditGuests(updatedReservation.guests || 1);
      setIsEditing(false);
    } catch (error) {
      setActionError(error.message || 'Rezervasiya yenilənmədi');
    } finally {
      setSaving(false);
    }
  };

  const handleEmailReceipt = async () => {
    setEmailing(true);
    setActionError('');
    setEmailMessage('');
    try {
      const updated = await emailBookingReceipt(reservation.id);
      setReservation(updated);
      setEmailMessage(`PDF ${updated.guestEmail} ünvanına göndərildi.`);
    } catch (error) {
      setActionError(error.message || 'PDF emailə göndərilmədi');
    } finally {
      setEmailing(false);
    }
  };

  const handleCancelBooking = async () => {
    setSaving(true);
    setActionError('');
    try {
      await deleteBooking(reservation.id);
      setReservation({ ...reservation, status: 'cancelled' });
      setShowCancelModal(false);
    } catch (error) {
      setActionError(error.message || 'Rezervasiya ləğv edilmədi');
    } finally {
      setSaving(false);
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
                <div className="confirmation-number">#{reservation.code || reservation.confirmationNumber || reservation.id}</div>
              </div>

              <div className="hotel-room-info">
                <div className="info-row">
                  <FaHotel className="info-icon" />
                  <div>
                    <span className="info-label">Otel</span>
                    <strong>{reservation.hotel?.name || reservation.hotelName}</strong>
                  </div>
                </div>

                <div className="info-row">
                  <FaBed className="info-icon" />
                  <div>
                    <span className="info-label">Otaq</span>
                    <strong>{reservation.room?.name || reservation.roomName || reservation.roomType}</strong>
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
                          onChange={(e) => setEditCheckIn(e.target.value)}
                          className="edit-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Çıxış tarixi</label>
                        <input
                          type="date"
                          value={editCheckOut}
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

                    {actionError && <p className="warning-text">{actionError}</p>}
                    <div className="edit-actions">
                      <button onClick={handleSaveEdit} className="btn-save" disabled={saving}>
                        <FaCheckCircle /> {saving ? 'Yenilənir...' : 'Yadda saxla'}
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
                <button type="button" className="btn-edit" onClick={() => printBookingReceipt(reservation)}>
                  PDF / sənəd
                </button>
                <button type="button" className="btn-edit" onClick={handleEmailReceipt} disabled={emailing}>
                  {emailing ? 'Göndərilir...' : 'PDF-i emailə göndər'}
                </button>
                {emailMessage && <p className="warning-text">{emailMessage}</p>}
                {actionError && <p className="warning-text">{actionError}</p>}
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
                  <span>{reservation.nights > 0 ? `${reservation.nights} gecə` : 'Məbləğ'}</span>
                  <span>₼{reservation.totalPrice}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row">
                  <span>Ödəniş</span>
                  <span>{reservation.paymentMethod || '—'} · {reservation.paymentStatus || '—'}</span>
                </div>
                {[20, 30, 40].includes(Number(reservation.depositPercent)) && (
                  <>
                    <div className="summary-row">
                      <span>Kartla avans ({reservation.depositPercent}%)</span>
                      <span>₼{reservation.depositAmount}</span>
                    </div>
                    <div className="summary-row">
                      <span>Oteldə qalıq</span>
                      <span>₼{reservation.remainingAmount}</span>
                    </div>
                  </>
                )}
                <div className="summary-row summary-total">
                  <span>Yekun</span>
                  <strong>₼{reservation.totalPrice}</strong>
                </div>
              </div>
            </div>

            <div className="booking-info-card">
              <h4>Rezervasiya Tarixi</h4>
              <p>{reservation.createdAt ? new Date(reservation.createdAt).toLocaleDateString('az-AZ') : '—'}</p>
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
              <p className="warning-text">Yalnız check-in tarixindən əvvəl ləğv etmək olar. Bu əməliyyat geri qaytarıla bilməz.</p>
              {actionError && <p className="warning-text">{actionError}</p>}
            </div>
            <div className="modal-actions">
              <button onClick={handleCancelBooking} className="btn-confirm-cancel" disabled={saving}>
                {saving ? 'Ləğv edilir...' : 'Bəli, ləğv et'}
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
