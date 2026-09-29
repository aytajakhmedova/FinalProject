import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaCheckCircle, FaHourglass, FaTimesCircle, FaClipboardList } from 'react-icons/fa';
import { MOCK_RESERVATIONS, getDashboardStats } from '../../data/reservationsData';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const stats = getDashboardStats();

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: { text: 'Təsdiqlənib', className: 'badge-confirmed', icon: <FaCheckCircle /> },
      upcoming: { text: 'Gələcək', className: 'badge-upcoming', icon: <FaHourglass /> },
      'checked-in': { text: 'Qeydiyyatdan keçib', className: 'badge-checked-in', icon: <FaCheckCircle /> },
      completed: { text: 'Tamamlanıb', className: 'badge-completed', icon: <FaCheckCircle /> },
      cancelled: { text: 'Ləğv edilib', className: 'badge-cancelled', icon: <FaTimesCircle /> },
    };
    return badges[status] || badges.confirmed;
  };

  const filteredReservations = activeTab === 'all' 
    ? MOCK_RESERVATIONS 
    : MOCK_RESERVATIONS.filter(res => {
        if (activeTab === 'upcoming') return res.status === 'confirmed' || res.status === 'upcoming';
        if (activeTab === 'completed') return res.status === 'completed' || res.status === 'checked-in';
        if (activeTab === 'cancelled') return res.status === 'cancelled';
        return true;
      });

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1 className="dashboard-title">Xoş gəlmisiniz!</h1>
            <p className="dashboard-subtitle">Rezervasiyalarınızı idarə edin və səyahətlərinizi izləyin</p>
          </div>
          <div className="user-profile-summary">
            <div className="user-avatar">
              <span>A</span>
            </div>
            <div className="user-info">
              <h3>Aynur Məmmədova</h3>
              <p>aynur@example.com</p>
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
              <div className="stat-label">Gələcək Qalma</div>
            </div>
          </div>

          <div className="stat-card stat-completed">
            <div className="stat-icon">
              <FaCheckCircle />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Tamamlanmış Qalma</div>
            </div>
          </div>

          <div className="stat-card stat-total">
            <div className="stat-icon">
              <FaClipboardList />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Cəmi Rezervasiya</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Hamısı ({MOCK_RESERVATIONS.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Gələcək ({stats.upcoming})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Tamamlanmış ({stats.completed})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Ləğv edilmiş ({stats.cancelled})
          </button>
        </div>

        {/* Reservations List */}
        <div className="reservations-section">
          <h2 className="section-title">
            {activeTab === 'all' && 'Bütün Rezervasiyalar'}
            {activeTab === 'upcoming' && 'Gələcək Rezervasiyalar'}
            {activeTab === 'completed' && 'Tamamlanmış Rezervasiyalar'}
            {activeTab === 'cancelled' && 'Ləğv Edilmiş Rezervasiyalar'}
          </h2>

          {filteredReservations.length > 0 ? (
            <div className="reservations-grid">
              {filteredReservations.map(reservation => {
                const badge = getStatusBadge(reservation.status);
                return (
                  <div key={reservation.id} className="reservation-card">
                    <div className="reservation-image">
                      <img src={reservation.hotelImage} alt={reservation.hotelName} />
                      <div className={`reservation-status-badge ${badge.className}`}>
                        {badge.icon}
                        <span>{badge.text}</span>
                      </div>
                    </div>

                    <div className="reservation-content">
                      <div className="reservation-header">
                        <h3 className="reservation-hotel-name">{reservation.hotelName}</h3>
                        <div className="reservation-id">#{reservation.id}</div>
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
                            <span className="detail-label">Giriş</span>
                            <span className="detail-value">{reservation.checkIn}</span>
                          </div>
                        </div>

                        <div className="detail-item">
                          <FaCalendarAlt className="detail-icon" />
                          <div className="detail-text">
                            <span className="detail-label">Çıxış</span>
                            <span className="detail-value">{reservation.checkOut}</span>
                          </div>
                        </div>

                        <div className="detail-item">
                          <FaUsers className="detail-icon" />
                          <div className="detail-text">
                            <span className="detail-label">Qonaqlar</span>
                            <span className="detail-value">{reservation.guests} nəfər</span>
                          </div>
                        </div>
                      </div>

                      <div className="reservation-footer">
                        <div className="reservation-price">
                          <span className="price-label">{reservation.nights} gecə</span>
                          <span className="price-amount">₼{reservation.totalPrice}</span>
                        </div>
                        <Link 
                          to={`/reservations/${reservation.id}`} 
                          className="btn-view-reservation"
                        >
                          Ətraflı bax
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-reservations">
              <FaClipboardList />
              <h3>Rezervasiya tapılmadı</h3>
              <p>Bu kateqoriyada rezervasiyanız yoxdur</p>
              <Link to="/hotels" className="btn-browse-hotels">
                Otelləri Kəşf Et
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
