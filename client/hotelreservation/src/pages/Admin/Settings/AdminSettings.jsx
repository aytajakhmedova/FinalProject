import React from 'react';
import '../Hotels/AdminHotels.css';

const AdminSettings = () => {
  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Parametrlər</h1>
        <p className="page-subtitle">Sistem parametrlərini dəyişdirin</p>
      </div>

      <div className="coming-soon-card">
        <div className="coming-soon-icon">⚙️</div>
        <h2>Tezliklə</h2>
        <p>Parametrlər bölməsi backend hazır olduqdan sonra əlavə ediləcək</p>
      </div>
    </div>
  );
};

export default AdminSettings;
