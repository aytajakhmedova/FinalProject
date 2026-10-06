import React from 'react';
import { FaHotel, FaCalendarCheck, FaUsers, FaMoneyBillWave, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  // Mock data
  const stats = [
    {
      icon: <FaHotel />,
      label: 'Cəmi Otellər',
      value: '24',
      change: '+3',
      changeType: 'positive',
      color: '#8B5A3C',
    },
    {
      icon: <FaCalendarCheck />,
      label: 'Aktiv Rezervasiyalar',
      value: '156',
      change: '+12',
      changeType: 'positive',
      color: '#22c55e',
    },
    {
      icon: <FaUsers />,
      label: 'Qeydiyyatlı İstifadəçilər',
      value: '1,284',
      change: '+48',
      changeType: 'positive',
      color: '#f59e0b',
    },
    {
      icon: <FaMoneyBillWave />,
      label: 'Bu Ayın Gəliri',
      value: '₼45,290',
      change: '-5%',
      changeType: 'negative',
      color: '#ef4444',
    },
  ];

  const recentBookings = [
    { id: 1, guest: 'Leyla Əliyeva', hotel: 'Seaside Resort', checkIn: '2024-10-15', status: 'confirmed' },
    { id: 2, guest: 'Rəşad Məmmədov', hotel: 'Mountain Lodge', checkIn: '2024-10-18', status: 'pending' },
    { id: 3, guest: 'Aysel Həsənova', hotel: 'City Hotel', checkIn: '2024-10-20', status: 'confirmed' },
    { id: 4, guest: 'Cavid Quliyev', hotel: 'Beach Paradise', checkIn: '2024-10-22', status: 'confirmed' },
    { id: 5, guest: 'Nigar Əhmədova', hotel: 'Luxury Suite', checkIn: '2024-10-25', status: 'pending' },
  ];

  const statusColors = {
    confirmed: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', label: 'Təsdiqlənib' },
    pending: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', label: 'Gözləyir' },
    cancelled: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', label: 'Ləğv edilib' },
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Xoş gəlmisiniz, Admin!</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn-secondary">İxrac et</button>
          <button className="btn-primary">Yeni Otel</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <span className="stat-label">{stat.label}</span>
              <div className="stat-value-row">
                <span className="stat-value">{stat.value}</span>
                <span className={`stat-change ${stat.changeType}`}>
                  {stat.changeType === 'positive' ? <FaArrowUp /> : <FaArrowDown />}
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Son Rezervasiyalar</h2>
          <a href="/admin/bookings" className="section-link">Hamısını gör →</a>
        </div>

        <div className="bookings-table-card">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Qonaq</th>
                <th>Otel</th>
                <th>Giriş Tarixi</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(booking => (
                <tr key={booking.id}>
                  <td>#{booking.id}</td>
                  <td className="guest-cell">
                    <div className="guest-avatar">
                      {booking.guest.charAt(0)}
                    </div>
                    <span>{booking.guest}</span>
                  </td>
                  <td>{booking.hotel}</td>
                  <td>{new Date(booking.checkIn).toLocaleDateString('az-AZ')}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{
                        background: statusColors[booking.status].bg,
                        color: statusColors[booking.status].text,
                      }}
                    >
                      {statusColors[booking.status].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
