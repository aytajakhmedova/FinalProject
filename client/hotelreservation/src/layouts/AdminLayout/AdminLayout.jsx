import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaHotel, 
  FaCalendarCheck, 
  FaUsers, 
  FaCog, 
  FaBars, 
  FaTimes,
  FaSignOutAlt,
  FaChartBar
} from 'react-icons/fa';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/admin', icon: <FaHome />, label: 'Dashboard', exact: true },
    { path: '/admin/hotels', icon: <FaHotel />, label: 'Otellər' },
    { path: '/admin/bookings', icon: <FaCalendarCheck />, label: 'Rezervasiyalar' },
    { path: '/admin/users', icon: <FaUsers />, label: 'İstifadəçilər' },
    { path: '/admin/analytics', icon: <FaChartBar />, label: 'Analitika' },
    { path: '/admin/settings', icon: <FaCog />, label: 'Parametrlər' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'collapsed'} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FaHotel className="logo-icon" />
            {sidebarOpen && <span className="logo-text">OtelBurada Admin</span>}
          </div>
          <button 
            className="sidebar-toggle desktop-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon"><FaSignOutAlt /></span>
            {sidebarOpen && <span className="nav-label">Çıxış</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`admin-main ${sidebarOpen ? '' : 'expanded'}`}>
        {/* Top Bar */}
        <header className="admin-topbar">
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <FaBars />
          </button>
          
          <div className="topbar-right">
            <div className="admin-user">
              <div className="admin-avatar">A</div>
              <div className="admin-user-info">
                <span className="admin-user-name">Admin</span>
                <span className="admin-user-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
