import React from 'react';
import '../Hotels/AdminHotels.css';

const AdminUsers = () => {
  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">İstifadəçilər</h1>
        <p className="page-subtitle">İstifadəçiləri idarə edin</p>
      </div>

      <div className="coming-soon-card">
        <div className="coming-soon-icon">👥</div>
        <h2>Tezliklə</h2>
        <p>İstifadəçilər idarəetməsi backend hazır olduqdan sonra əlavə ediləcək</p>
      </div>
    </div>
  );
};

export default AdminUsers;
