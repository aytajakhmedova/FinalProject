import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHotel, FaPlane, FaCar, FaTaxi, FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { IoNotifications } from 'react-icons/io5';
import { MdKeyboardArrowDown, MdDarkMode, MdLightMode } from 'react-icons/md';
import logo from '../../assets/images/logo.png';
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
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    if (authStatus === 'true' && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const menus = [
    {
      name: 'Kəşf et',
      items: [
        { label: 'Otellər', href: '/hotels', isRoute: true },
        { label: 'Təyinatlar', href: '#destinations' },
        { label: 'Turlar', href: '#tours' },
      ],
    },
    {
      name: 'Səhifələr',
      items: [
        { label: 'Haqqımızda', href: '#about' },
        { label: 'Rəylər', href: '#reviews' },
        { label: 'Qalereya', href: '#gallery' },
      ],
    },
  ];

  const navItems = [
    { icon: <FaHotel />, text: 'Otel', type: 'hotel' },
    { icon: <FaPlane />, text: 'Uçuş', type: 'flight' },
    { icon: <FaCar />, text: 'Tur', type: 'tour' },
    { icon: <FaTaxi />, text: 'Taksi', type: 'taxi' },
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
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-left">
          <Link className="logo" to="/">
            <img src={logo} alt="OtelBurada" className="logo-image" />
          </Link>

          <nav className="main-nav">
            {menus.map((item) => (
              <div
                key={item.name}
                className="nav-item"
                onMouseEnter={() => setOpenMenu(item.name)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <span>{item.name}</span>
                <MdKeyboardArrowDown className={`dropdown-arrow ${openMenu === item.name ? 'open' : ''}`} />
                {openMenu === item.name && (
                  <div className="dropdown-panel">
                    {item.items.map((link) => (
                      <button key={link.href} onClick={() => go(link.href, link.isRoute)}>
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
                  onServiceChange(item.type);
                  go('#search');
                }}
              >
                <span className="icon">{item.icon}</span>
                <span className="text">{item.text}</span>
              </button>
            ))}
          </div>

          <div className="user-actions">
            <select
              className="currency-select"
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              aria-label="Valyuta"
            >
              <option value="AZN">₼ AZN</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
            </select>

            <button className="theme-toggle-btn" onClick={toggleDarkMode} aria-label="Tema">
              {darkMode ? <MdLightMode /> : <MdDarkMode />}
            </button>

            <div className="note-wrap">
              <button className="notification-btn" onClick={() => setNotesOpen((v) => !v)}>
                <IoNotifications />
                {favoriteCount > 0 && <span className="badge">{favoriteCount}</span>}
              </button>
              {notesOpen && (
                <div className="notes-panel">
                  <p>Yay endirimi — otellərdə 20%-dək</p>
                  <p>Seçilmiş otellər: {favoriteCount}</p>
                  <p>7/24 dəstək aktivdir</p>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div 
                className="user-profile" 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                title={user?.name || 'Hesab'}
              >
                <div className="avatar-fallback">{getUserInitials()}</div>
                {userMenuOpen && (
                  <div className="user-menu-dropdown">
                    <div className="user-menu-header">
                      <div className="user-menu-avatar">{getUserInitials()}</div>
                      <div className="user-menu-info">
                        <span className="user-menu-name">{user?.name}</span>
                        <span className="user-menu-email">{user?.email}</span>
                      </div>
                    </div>
                    <div className="user-menu-divider"></div>
                    <Link to="/profile" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>
                      <FaUser />
                      <span>Profil</span>
                    </Link>
                    <div className="user-menu-divider"></div>
                    <button className="user-menu-item logout" onClick={handleLogout}>
                      <FaSignOutAlt />
                      <span>Çıxış</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="login-btn">
                Daxil ol
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
  );
};

export default Header;
