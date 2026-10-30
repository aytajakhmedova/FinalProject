import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHotel, FaPlane, FaCar, FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { IoNotifications } from 'react-icons/io5';
import { MdKeyboardArrowDown, MdDarkMode, MdLightMode } from 'react-icons/md';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { clearAuthSession, getAuthToken } from '../../api/auth';
import { resolveImage } from '../../api/client';
import { menuLabel } from '../../i18n/menuLabel';
import './Header.css';

const QUICK_ICONS = {
  hotel: <FaHotel />,
  plane: <FaPlane />,
  car: <FaCar />,
};

const Header = ({
  darkMode,
  toggleDarkMode,
  onServiceChange,
  favoriteCount,
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { content } = useSiteContent();
  const settings = content?.settings;
  const logo = resolveImage(settings?.logoUrl);
  const siteName = settings?.siteName || 'AEHotel';
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const syncUser = () => {
      const token = getAuthToken();
      const userData = token ? localStorage.getItem('user') : null;
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    syncUser();
    window.addEventListener('user-updated', syncUser);
    window.addEventListener('storage', syncUser);
    return () => {
      window.removeEventListener('user-updated', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-profile')) {
        setUserMenuOpen(false);
      }
      if (notesOpen && !event.target.closest('.note-wrap')) {
        setNotesOpen(false);
      }
      if (openMenu && !event.target.closest('.nav-item')) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen, notesOpen, openMenu]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const menus = [
    {
      id: 'discover',
      name: t('nav.discover'),
      items: (content?.menus?.discover || []).filter((item) => item.url !== '/taxis').map((item) => ({
        label: menuLabel(item, t),
        href: item.url,
        isRoute: item.isRoute,
      })),
    },
    {
      id: 'pages',
      name: t('nav.pages'),
      items: (content?.menus?.pages || []).map((item) => ({
        label: menuLabel(item, t),
        href: item.url,
        isRoute: item.isRoute,
      })),
    },
  ].filter((menu) => menu.items.length > 0);

  const navItems = (content?.menus?.quick || []).filter((item) => item.url !== '/taxis' && item.iconKey !== 'taxi').map((item) => ({
    icon: QUICK_ICONS[item.iconKey] || <FaHotel />,
    text: menuLabel(item, t, { short: true }),
    type: item.iconKey || item.label,
    route: item.url,
    isRoute: item.isRoute,
  }));

  const go = (href, isRoute = false) => {
    setMobileOpen(false);
    setOpenMenu(null);
    setUserMenuOpen(false);
    if (isRoute) {
      navigate(href);
    } else {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    setIsAuthenticated(false);
    setUser(null);
    setUserMenuOpen(false);
    navigate('/');
  };

  const getUserInitials = () => {
    if (!user || !user.name) return 'A';
    return user.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-left">
          <Link className="logo" to="/">
            {logo ? (
              <img src={logo} alt={siteName} className="logo-image" />
            ) : (
              <span className="logo-text">{siteName}</span>
            )}
          </Link>

          <nav className="main-nav">
            {menus.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${openMenu === item.id ? 'open' : ''}`}
              >
                <button
                  type="button"
                  className="nav-trigger"
                  aria-expanded={openMenu === item.id}
                  onClick={() => setOpenMenu((current) => (current === item.id ? null : item.id))}
                >
                  <span>{item.name}</span>
                  <MdKeyboardArrowDown className={`dropdown-arrow ${openMenu === item.id ? 'open' : ''}`} />
                </button>
                {openMenu === item.id && (
                  <div className="dropdown-panel">
                    {item.items.map((link) => (
                      <button key={link.href} type="button" onClick={() => go(link.href, link.isRoute)}>
                        {link.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="header-right">
          <div className="quick-nav">
            {navItems.map((item) => (
              <button
                key={item.type}
                className="quick-nav-btn"
                onClick={() => {
                  if (item.isRoute && item.route && item.route !== '#') {
                    navigate(item.route);
                  } else if (item.route && item.route.startsWith('#')) {
                    onServiceChange(item.type);
                    go(item.route);
                  } else if (item.route) {
                    navigate(item.route);
                  } else {
                    onServiceChange(item.type);
                    go('#search');
                  }
                }}
              >
                <span className="icon">{item.icon}</span>
                <span className="text">{item.text}</span>
              </button>
            ))}
          </div>

          <div className="user-actions">
            <button className="theme-toggle-btn" onClick={toggleDarkMode} aria-label={t('nav.theme')}>
              {darkMode ? <MdLightMode /> : <MdDarkMode />}
            </button>

            <div className="note-wrap">
              <button className="notification-btn" onClick={() => setNotesOpen((v) => !v)}>
                <IoNotifications />
                {favoriteCount > 0 && <span className="badge">{favoriteCount}</span>}
              </button>
              {notesOpen && (
                <div className="notes-panel">
                  <p>{t('note.summer')}</p>
                  <p>{t('note.favorites', { count: favoriteCount })}</p>
                  <p>{t('note.support')}</p>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div 
                className="user-profile" 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                title={user?.name || t('nav.account')}
              >
                <div className="avatar-fallback">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name || 'Profil'} />
                  ) : (
                    getUserInitials()
                  )}
                </div>
                {userMenuOpen && (
                  <div className="user-menu-dropdown">
                    <div className="user-menu-header">
                      <div className="user-menu-avatar">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name || 'Profil'} />
                        ) : (
                          getUserInitials()
                        )}
                      </div>
                      <div className="user-menu-info">
                        <span className="user-menu-name">{user?.name}</span>
                        <span className="user-menu-email">{user?.email}</span>
                      </div>
                    </div>
                    <div className="user-menu-divider"></div>
                    <Link to="/profile" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>
                      <FaUser />
                      <span>{t('nav.profile')}</span>
                    </Link>
                    <div className="user-menu-divider"></div>
                    <button className="user-menu-item logout" onClick={handleLogout}>
                      <FaSignOutAlt />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="login-btn">
                {t('nav.login')}
              </Link>
            )}

            <button className="burger" onClick={() => setMobileOpen((v) => !v)}>
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-drawer">
          {menus.flatMap((m) => m.items).map((link) => (
            <button key={link.href} onClick={() => go(link.href, link.isRoute)}>
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
    <div className="header-spacer" aria-hidden="true" />
    </>
  );
};

export default Header;
