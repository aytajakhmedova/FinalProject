import React from 'react';
import '../Hotels/AdminHotels.css';

const AdminBookings = () => {
  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Rezervasiyalar</h1>
        <p className="page-subtitle">Rezervasiyaları idarə edin</p>
      </div>

      <div className="coming-soon-card">
        <div className="coming-soon-icon">📅</div>
        <h2>Tezliklə</h2>
        <p>Rezervasiyalar idarəetməsi backend hazır olduqdan sonra əlavə ediləcək</p>
      </div>
    </div>
  );
};

export default AdminBookings;
