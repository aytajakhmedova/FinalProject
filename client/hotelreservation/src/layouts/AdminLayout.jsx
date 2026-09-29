import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FaHome, FaBed, FaCalendar, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>OtelBurada Admin</h2>
        </div>
        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav-link">
            <FaHome /> İdarə Paneli
          </Link>
          <Link to="/admin/otaqlar" className="admin-nav-link">
            <FaBed /> Otaqlar
          </Link>
          <Link to="/admin/rezervasiyalar" className="admin-nav-link">
            <FaClipboardList /> Rezervasiyalar
          </Link>
          <Link to="/admin/teqvim" className="admin-nav-link">
            <FaCalendar /> Doluluk Təqvimi
          </Link>
          <Link to="/" className="admin-nav-link admin-logout">
            <FaSignOutAlt /> Sayta Qayıt
          </Link>
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
