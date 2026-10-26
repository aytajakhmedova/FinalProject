import React, { useEffect, useMemo, useState } from 'react';
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
  FaMapMarkedAlt,
  FaPercentage
} from 'react-icons/fa';
import './AdminLayout.css';
import { useLanguage } from '../../context/LanguageContext';
import { clearAuthSession, getAuthUser, hasRole, isAdminSession } from '../../api/auth';

const ALL_MENU = [
  { path: '/admin', icon: <FaHome />, label: 'Dashboard', exact: true, roles: ['SuperAdmin', 'Admin', 'HotelManager', 'Receptionist'] },
  { path: '/admin/oteller', icon: <FaHotel />, labelKey: 'admin.hotels', roles: ['SuperAdmin', 'Admin', 'HotelManager'] },
  { path: '/admin/hotels', icon: <FaBed />, labelKey: 'admin.rooms', roles: ['SuperAdmin', 'Admin', 'HotelManager'] },
  { path: '/admin/rezervasiyalar', icon: <FaCalendarCheck />, labelKey: 'admin.bookings', roles: ['SuperAdmin', 'Admin', 'HotelManager', 'Receptionist'] },
  { path: '/admin/teqvim', icon: <FaCalendarAlt />, labelKey: 'admin.occupancy', roles: ['SuperAdmin', 'Admin', 'HotelManager', 'Receptionist'] },
  { path: '/admin/ucuslar', icon: <FaPlane />, label: 'Uçuşlar', roles: ['SuperAdmin', 'Admin'] },
  { path: '/admin/turlar', icon: <FaMapMarkedAlt />, label: 'Turlar', roles: ['SuperAdmin', 'Admin'] },
  { path: '/admin/paketler', icon: <FaPercentage />, label: 'Paketlər və Endirimlər', roles: ['SuperAdmin', 'Admin'] },
  { path: '/admin/users', icon: <FaUsers />, labelKey: 'admin.users', roles: ['SuperAdmin', 'Admin'] },
  { path: '/admin/analytics', icon: <FaChartBar />, labelKey: 'admin.analytics', roles: ['SuperAdmin', 'Admin'] },
  { path: '/admin/settings', icon: <FaCog />, labelKey: 'admin.settings', roles: ['SuperAdmin', 'Admin'] },
];

const ROLE_LABELS = {
  SuperAdmin: 'Super Admin',
  Admin: 'Admin',
  HotelManager: 'Hotel Manager',
  Receptionist: 'Receptionist',
};

const AdminLayout = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = isAdminSession();
  const user = getAuthUser();
  const roleName = Array.isArray(user?.roles) ? (ROLE_LABELS[user.roles[0]] || user.roles[0]) : 'Admin';

  const menuItems = useMemo(
    () => ALL_MENU.filter((item) => hasRole(...item.roles)),
    [user]
  );

  useEffect(() => {
    if (isAdmin) return;
    const next = `${location.pathname}${location.search}`;
    navigate(`/login?next=${encodeURIComponent(next)}`, { replace: true });
  }, [isAdmin, location.pathname, location.search, navigate]);

  useEffect(() => {
    if (!isAdmin || menuItems.length === 0) return;
    const aliases = {
      '/admin/bookings': '/admin/rezervasiyalar',
      '/admin/occupancy': '/admin/teqvim',
      '/admin/rooms': '/admin/hotels',
      '/admin/flights': '/admin/ucuslar',
      '/admin/tours': '/admin/turlar',
    };
    const path = aliases[location.pathname] || location.pathname;
    const allowed = menuItems.some((item) =>
      item.exact ? path === item.path : path.startsWith(item.path)
    );
    if (!allowed) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, location.pathname, menuItems, navigate]);

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
              {sidebarOpen && <span className="nav-label">{item.labelKey ? t(item.labelKey) : item.label}</span>}
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

      <div className={`admin-main ${sidebarOpen ? '' : 'expanded'}`}>
        <header className="admin-topbar">
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <FaBars />
          </button>
          
          <div className="topbar-right">
            <div className="admin-user">
              <div className="admin-avatar">{(user?.name || 'A').charAt(0).toUpperCase()}</div>
              <div className="admin-user-info">
                <span className="admin-user-name">{user?.name || user?.email || 'Admin'}</span>
                <span className="admin-user-role">{roleName}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>

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
