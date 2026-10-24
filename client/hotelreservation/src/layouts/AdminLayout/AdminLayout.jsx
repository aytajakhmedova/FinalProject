import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaHotel, 
  FaBed,
  FaCalendarCheck, 
  FaUsers, 
  FaCog, 
  FaBars, 
  FaTimes,
  FaSignOutAlt,
  FaChartBar,
  FaCalendarAlt,
  FaPlane,
  FaMapMarkedAlt
} from 'react-icons/fa';
import './AdminLayout.css';
import { useLanguage } from '../../context/LanguageContext';
import { clearAuthSession, isAdminSession } from '../../api/auth';

const AdminLayout = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = isAdminSession();

  useEffect(() => {
    if (isAdmin) return;
    const next = `${location.pathname}${location.search}`;
    navigate(`/login?next=${encodeURIComponent(next)}`, { replace: true });
  }, [isAdmin, location.pathname, location.search, navigate]);

  const menuItems = [
    { path: '/admin', icon: <FaHome />, label: 'Dashboard', exact: true },
    { path: '/admin/oteller', icon: <FaHotel />, label: t('admin.hotels') },
    { path: '/admin/hotels', icon: <FaBed />, label: t('admin.rooms') },
    { path: '/admin/rezervasiyalar', icon: <FaCalendarCheck />, label: t('admin.bookings') },
    { path: '/admin/teqvim', icon: <FaCalendarAlt />, label: t('admin.occupancy') },
    { path: '/admin/ucuslar', icon: <FaPlane />, label: 'Uçuşlar' },
    { path: '/admin/turlar', icon: <FaMapMarkedAlt />, label: 'Turlar' },
    { path: '/admin/users', icon: <FaUsers />, label: t('admin.users') },
    { path: '/admin/analytics', icon: <FaChartBar />, label: t('admin.analytics') },
    { path: '/admin/settings', icon: <FaCog />, label: t('admin.settings') },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login');
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'collapsed'} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FaHotel className="logo-icon" />
            {sidebarOpen && <span className="logo-text">AE Hotel Admin</span>}
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
            {sidebarOpen && <span className="nav-label">{t('admin.logout')}</span>}
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
                <span className="admin-user-role">{t('admin.role')}</span>
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
