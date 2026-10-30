import React, { useState, useEffect, useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaCheckCircle, FaHourglass, FaTimesCircle, FaClipboardList } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { getAuthToken } from '../../api/auth';
import { deleteBooking, getHotels, getMyBookings, getMyReviews } from '../../api/client';
import { printBookingReceipt } from '../../utils/printReceipt';
import './Dashboard.css';

const bookingTypeOf = (reservation) => (reservation.bookingType || 'hotel').toLowerCase();

const bookingTitle = (reservation) => {
  const type = bookingTypeOf(reservation);
  if (type === 'flight') return reservation.itemName || reservation.flightNumber || reservation.hotelName;
  if (type === 'tour') return reservation.tourName || reservation.itemName || reservation.hotelName;
  return reservation.hotelName || reservation.itemName;
};

const bookingSubtitle = (reservation) => {
  const type = bookingTypeOf(reservation);
  if (type === 'flight') return reservation.flightNumber || reservation.itemName;
  if (type === 'tour') return reservation.tourName || reservation.itemName;
  return reservation.roomType || reservation.roomName || reservation.itemName;
};

const typeLabel = (reservation, t) => {
  const type = bookingTypeOf(reservation);
  if (type === 'flight') return t('nav.flight');
  if (type === 'tour') return t('nav.tour');
  return t('nav.hotel');
};

const statsFrom = (bookings) => ({
  upcoming: bookings.filter((b) => b.status === 'confirmed' || b.status === 'checked-in').length,
  completed: bookings.filter((b) => b.status === 'checked-out').length,
  cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  total: bookings.length,
});

const Dashboard = () => {
  const { t } = useLanguage();
  const token = getAuthToken();
  const [activeTab, setActiveTab] = useState('all');
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [reviewedIds, setReviewedIds] = useState(() => new Set());
  const [hotelImages, setHotelImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [cancelError, setCancelError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const stats = statsFrom(reservations);

  const loadReservations = useCallback(async () => {
    if (!getAuthToken()) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      const bookings = await getMyBookings();
      setReservations(Array.isArray(bookings) ? bookings : []);
      try {
        const mine = await getMyReviews();
        setReviewedIds(new Set((Array.isArray(mine) ? mine : []).map((item) => String(item.bookingId))));
      } catch {
        setReviewedIds(new Set());
      }
      try {
        const hotels = await getHotels();
        const images = {};
        (hotels || []).forEach((hotel) => {
          if (hotel?.id != null && hotel.mainImage) images[String(hotel.id)] = hotel.mainImage;
        });
        setHotelImages(images);
      } catch {
        setHotelImages({});
      }
    } catch (err) {
      setReservations([]);
      setError(err.message || t('dash.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }
    loadReservations();
  }, [token, loadReservations]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const getUserInitials = () => {
    if (!user || !user.name) return 'A';
    return user.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: { text: t('status.confirmed'), className: 'badge-confirmed', icon: <FaCheckCircle /> },
      'checked-in': { text: t('status.checkedIn'), className: 'badge-checked-in', icon: <FaHourglass /> },
      'checked-out': { text: t('status.checkedOut'), className: 'badge-completed', icon: <FaCheckCircle /> },
      cancelled: { text: t('status.cancelled'), className: 'badge-cancelled', icon: <FaTimesCircle /> },
    };
    return badges[status] || badges.confirmed;
  };

  const filteredReservations = activeTab === 'all' 
    ? reservations 
    : reservations.filter(res => {
        if (activeTab === 'upcoming') return res.status === 'confirmed' || res.status === 'checked-in';
        if (activeTab === 'completed') return res.status === 'checked-out';
        if (activeTab === 'cancelled') return res.status === 'cancelled';
        return true;
      });

  const handleCancelReservation = (reservation) => {
    setSelectedReservation(reservation);
    setCancelError('');
    setShowCancelModal(true);
  };

  const confirmCancelReservation = async () => {
    if (!selectedReservation) return;

    setCancelling(true);
    setCancelError('');
    try {
      await deleteBooking(selectedReservation.id);
      await loadReservations();
      setShowCancelModal(false);
      setSelectedReservation(null);
    } catch (err) {
      setCancelError(err.message || t('dash.cancelError'));
    } finally {
      setCancelling(false);
    }
  };

  const canCancelReservation = (status) => status === 'confirmed';

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1 className="dashboard-title">
              {t('dash.welcome')}{user?.name ? `, ${user.name}` : ''}!
            </h1>
            <p className="dashboard-subtitle">{t('dash.subtitle')}</p>
          </div>
          <div className="user-profile-summary">
            <div className="user-avatar">
              <span>{getUserInitials()}</span>
            </div>
            <div className="user-info">
              <h3>{user?.name || t('dash.user')}</h3>
              <p>{user?.email || 'email@example.com'}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-stats">
          <div className="stat-card stat-upcoming">
            <div className="stat-icon">
              <FaCalendarAlt />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.upcoming}</div>
              <div className="stat-label">{t('dash.upcoming')}</div>
            </div>
          </div>

          <div className="stat-card stat-completed">
            <div className="stat-icon">
              <FaCheckCircle />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">{t('dash.completed')}</div>
            </div>
          </div>

          <div className="stat-card stat-total">
            <div className="stat-icon">
              <FaClipboardList />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">{t('dash.total')}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            {t('dash.all')} ({reservations.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            {t('dash.future')} ({stats.upcoming})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            {t('dash.done')} ({stats.completed})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            {t('dash.cancelled')} ({stats.cancelled})
          </button>
        </div>

        {/* Reservations List */}
        <div className="reservations-section">
          <h2 className="section-title">
            {activeTab === 'all' && t('dash.allTitle')}
            {activeTab === 'upcoming' && t('dash.futureTitle')}
            {activeTab === 'completed' && t('dash.doneTitle')}
            {activeTab === 'cancelled' && t('dash.cancelledTitle')}
          </h2>

          {loading ? (
            <div className="no-reservations">
              <FaClipboardList />
              <h3>{t('dash.loading')}</h3>
            </div>
          ) : error ? (
            <div className="no-reservations">
              <FaClipboardList />
              <h3>{t('dash.loadError')}</h3>
              <p>{error}</p>
              <button type="button" className="btn-browse-hotels" onClick={loadReservations}>
                {t('dash.retry')}
              </button>
            </div>
          ) : filteredReservations.length > 0 ? (
            <div className="reservations-grid">
              {filteredReservations.map(reservation => {
                const badge = getStatusBadge(reservation.status);
                const type = bookingTypeOf(reservation);
                const title = bookingTitle(reservation);
                const image = type === 'hotel' ? hotelImages[String(reservation.hotelId)] : '';
                const firstDateLabel = type === 'hotel' ? t('dash.checkIn') : t('dash.travelDate');
                const firstDate = reservation.checkIn || '—';
                const secondDate = reservation.checkOut || '—';
                return (
                  <div key={reservation.id} className="reservation-card">
                    <div className={`reservation-image${image ? '' : ' is-empty'}`}>
                      {image ? <img src={image} alt={title} /> : null}
                      <div className={`reservation-status-badge ${badge.className}`}>
                        {badge.icon}
                        <span>{badge.text}</span>
                      </div>
                    </div>

                    <div className="reservation-content">
                      <div className="reservation-header">
                        <h3 className="reservation-hotel-name">{title}</h3>
                        <div className="reservation-id">#{reservation.confirmationNumber || reservation.code || reservation.id}</div>
                      </div>

                      <div className="reservation-location">
                        <FaMapMarkerAlt />
                        <span>{reservation.location}</span>
                      </div>

                      <div className="reservation-room-type">
                        {typeLabel(reservation, t)} · {bookingSubtitle(reservation)}
                      </div>

                      <div className="reservation-details">
                        <div className="detail-item">
                          <FaCalendarAlt className="detail-icon" />
                          <div className="detail-text">
                            <span className="detail-label">{firstDateLabel}</span>
                            <span className="detail-value">{firstDate}</span>
                          </div>
                        </div>

                        <div className="detail-item">
                          <FaCalendarAlt className="detail-icon" />
                          <div className="detail-text">
                            <span className="detail-label">{t('dash.checkOut')}</span>
                            <span className="detail-value">{secondDate}</span>
                          </div>
                        </div>

                        <div className="detail-item">
                          <FaUsers className="detail-icon" />
                          <div className="detail-text">
                            <span className="detail-label">{t('dash.guests')}</span>
                            <span className="detail-value">{t('dash.people', { count: reservation.guests })}</span>
                          </div>
                        </div>
                      </div>

                      <div className="reservation-footer">
                        <div className="reservation-price">
                          <span className="price-label">
                            {reservation.nights > 0
                              ? t('dash.nights', { count: reservation.nights })
                              : typeLabel(reservation, t)}
                          </span>
                          <span className="price-amount">₼{reservation.totalPrice}</span>
                        </div>
                        <div className="reservation-actions">
                          <Link 
                            to={`/reservations/${reservation.id}`} 
                            className="btn-view-reservation"
                          >
                            {t('dash.details')}
                          </Link>
                          <button
                            type="button"
                            className="btn-modify-reservation"
                            onClick={() => printBookingReceipt(reservation)}
                          >
                            PDF
                          </button>
                          {reservation.status === 'checked-out' && type === 'hotel' && !reviewedIds.has(String(reservation.id)) && (
                            <Link
                              to={`/hotels/${reservation.hotelId}#reviews`}
                              className="btn-modify-reservation"
                            >
                              {t('dash.review')}
                            </Link>
                          )}
                          {canCancelReservation(reservation.status) && (
                            <button 
                              className="btn-cancel-reservation"
                              onClick={() => handleCancelReservation(reservation)}
                            >
                              {t('dash.cancel')}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-reservations">
              <FaClipboardList />
              <h3>{t('dash.emptyTitle')}</h3>
              <p>{t('dash.emptyText')}</p>
              <Link to="/hotels" className="btn-browse-hotels">
                {t('dash.browse')}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => !cancelling && setShowCancelModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t('dash.cancelTitle')}</h3>
            <p>{t('dash.cancelSure')}</p>
            {selectedReservation && (
              <div className="modal-reservation-info">
                <p><strong>{bookingTitle(selectedReservation)}</strong></p>
                <p>{selectedReservation.checkIn} - {selectedReservation.checkOut || selectedReservation.checkIn}</p>
                <p className="modal-warning">
                  ⚠️ {t('dash.cancelWarn')} Yalnız check-in tarixindən əvvəl.
                </p>
                {cancelError && <p className="modal-warning">{cancelError}</p>}
              </div>
            )}
            <div className="modal-actions">
              <button 
                className="btn-modal-cancel"
                disabled={cancelling}
                onClick={() => setShowCancelModal(false)}
              >
                {t('dash.keep')}
              </button>
              <button 
                className="btn-modal-confirm"
                disabled={cancelling}
                onClick={confirmCancelReservation}
              >
                {cancelling ? t('dash.loading') : t('dash.confirmCancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
