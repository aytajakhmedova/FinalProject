import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaCheckCircle, FaHourglass, FaTimesCircle, FaClipboardList } from 'react-icons/fa';
import { getAllBookings, getBookingStats, updateBooking } from '../../utils/bookingsStore';
import { hasReviewForBooking } from '../../utils/reviewsStore';
import { useLanguage } from '../../context/LanguageContext';
import { getHotels } from '../../data/hotelsData';
import './Dashboard.css';

const hotelImageFor = (reservation) => {
  const hotel = getHotels().find((item) => String(item.id) === String(reservation.hotelId));
  return hotel?.mainImage || reservation.hotelImage;
};

const Dashboard = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState(getAllBookings());
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const stats = getBookingStats(reservations);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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
    setShowCancelModal(true);
  };

  const confirmCancelReservation = () => {
    if (selectedReservation) {
      updateBooking(selectedReservation.id, {
        status: 'cancelled',
        cancelledDate: new Date().toISOString(),
      });
      setReservations(getAllBookings());
      setShowCancelModal(false);
      setSelectedReservation(null);
      alert(t('dash.cancelledAlert'));
    }
  };

  const canModifyReservation = (status) => status === 'confirmed';
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

          {filteredReservations.length > 0 ? (
            <div className="reservations-grid">
              {filteredReservations.map(reservation => {
                const badge = getStatusBadge(reservation.status);
                return (
                  <div key={reservation.id} className="reservation-card">
                    <div className="reservation-image">
                      <img src={hotelImageFor(reservation)} alt={reservation.hotelName} />
                      <div className={`reservation-status-badge ${badge.className}`}>
                        {badge.icon}
                        <span>{badge.text}</span>
                      </div>
                    </div>

                    <div className="reservation-content">
                      <div className="reservation-header">
                        <h3 className="reservation-hotel-name">{reservation.hotelName}</h3>
                        <div className="reservation-id">#{reservation.confirmationNumber || reservation.id}</div>
                      </div>

                      <div className="reservation-location">
                        <FaMapMarkerAlt />
                        <span>{reservation.location}</span>
                      </div>

                      <div className="reservation-room-type">
                        {reservation.roomType}
                      </div>

                      <div className="reservation-details">
                        <div className="detail-item">
                          <FaCalendarAlt className="detail-icon" />
                          <div className="detail-text">
                            <span className="detail-label">{t('dash.checkIn')}</span>
                            <span className="detail-value">{reservation.checkIn}</span>
                          </div>
                        </div>

                        <div className="detail-item">
                          <FaCalendarAlt className="detail-icon" />
                          <div className="detail-text">
                            <span className="detail-label">{t('dash.checkOut')}</span>
                            <span className="detail-value">{reservation.checkOut}</span>
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
                          <span className="price-label">{t('dash.nights', { count: reservation.nights })}</span>
                          <span className="price-amount">₼{reservation.totalPrice}</span>
                        </div>
                        <div className="reservation-actions">
                          <Link 
                            to={`/reservations/${reservation.id}`} 
                            className="btn-view-reservation"
                          >
                            {t('dash.details')}
                          </Link>
                          {canModifyReservation(reservation.status) && (
                            <Link
                              to={`/reservations/${reservation.id}?edit=1`}
                              className="btn-modify-reservation"
                            >
                              {t('dash.modify')}
                            </Link>
                          )}
                          {reservation.status === 'checked-out' && !hasReviewForBooking(reservation.id) && (
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
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t('dash.cancelTitle')}</h3>
            <p>{t('dash.cancelSure')}</p>
            {selectedReservation && (
              <div className="modal-reservation-info">
                <p><strong>{selectedReservation.hotelName}</strong></p>
                <p>{selectedReservation.checkIn} - {selectedReservation.checkOut}</p>
                <p className="modal-warning">
                  ⚠️ {t('dash.cancelWarn')}
                </p>
              </div>
            )}
            <div className="modal-actions">
              <button 
                className="btn-modal-cancel"
                onClick={() => setShowCancelModal(false)}
              >
                {t('dash.keep')}
              </button>
              <button 
                className="btn-modal-confirm"
                onClick={confirmCancelReservation}
              >
                {t('dash.confirmCancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
