import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHotel, FaPlane, FaCar, FaTaxi, FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { IoNotifications } from 'react-icons/io5';
import { MdKeyboardArrowDown, MdDarkMode, MdLightMode } from 'react-icons/md';
import logo from '../../assets/images/AE_HOTEL_transparent_logo.png';
import LanguageSwitch from '../LanguageSwitch/LanguageSwitch';
import { useLanguage } from '../../context/LanguageContext';
import './Header.css';

const Header = ({
  darkMode,
  toggleDarkMode,
  currency,
  onCurrencyChange,
  onServiceChange,
  favoriteCount,
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
      const authStatus = localStorage.getItem('isAuthenticated');
      const userData = localStorage.getItem('user');
      if (authStatus === 'true' && userData) {
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
      items: [
        { label: t('nav.hotels'), href: '/hotels', isRoute: true },
        { label: t('nav.destinations'), href: '/destinations', isRoute: true },
        { label: t('nav.tours'), href: '/tours', isRoute: true },
      ],
    },
    {
      id: 'pages',
      name: t('nav.pages'),
      items: [
        { label: t('nav.about'), href: '/about', isRoute: true },
        { label: t('nav.reviews'), href: '/reviews', isRoute: true },
        { label: t('nav.gallery'), href: '/gallery', isRoute: true },
      ],
    },
  ];

  const navItems = [
    { icon: <FaHotel />, text: t('nav.hotel'), type: 'hotel', route: '/hotels' },
    { icon: <FaPlane />, text: t('nav.flight'), type: 'flight', route: '/flights' },
    { icon: <FaCar />, text: t('nav.tour'), type: 'tour', route: '/tours' },
    { icon: <FaTaxi />, text: t('nav.taxi'), type: 'taxi', route: '#' },
  ];

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
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
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
            <img src={logo} alt="AE Hotel" className="logo-image" />
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
                  if (item.route && item.route !== '#') {
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
            <LanguageSwitch />
            <select
              className="currency-select"
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              aria-label={t('nav.currency')}
            >
              <option value="AZN">₼ AZN</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
            </select>

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
