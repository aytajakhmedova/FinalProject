import React from 'react';
import './AdminHotels.css';

const AdminHotels = () => {
  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Otellər</h1>
        <p className="page-subtitle">Otelləri idarə edin</p>
      </div>

      <div className="coming-soon-card">
        <div className="coming-soon-icon">🏨</div>
        <h2>Tezliklə</h2>
        <p>Otellər idarəetməsi backend hazır olduqdan sonra əlavə ediləcək</p>
      </div>
    </div>
  );
};

export default AdminHotels;
