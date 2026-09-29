import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaMoon, FaSun, FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';
import logo from '../../../assets/images/logo.png';
import './Navbar.css';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="OtelBurada" />
        </Link>

        {/* Desktop Menu */}
        <ul className="navbar-menu">
          <li><NavLink to="/" className="nav-link">Ana Səhifə</NavLink></li>
          <li><NavLink to="/otaqlar" className="nav-link">Otaqlar</NavLink></li>
          <li><NavLink to="/haqqimizda" className="nav-link">Haqqımızda</NavLink></li>
          <li><NavLink to="/restoran" className="nav-link">Restoran</NavLink></li>
          <li><NavLink to="/spa" className="nav-link">SPA</NavLink></li>
          <li><NavLink to="/qalereya" className="nav-link">Qalereya</NavLink></li>
          <li><NavLink to="/elaqe" className="nav-link">Əlaqə</NavLink></li>
        </ul>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
          
          <Link to="/rezervasiya" className="btn-reserve">
            Rezervasiya Et
          </Link>

          <Link to="/hesab" className="user-icon">
            <FaUser />
          </Link>

          <button 
            className="menu-toggle" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${menuOpen ? 'mobile-menu-open' : ''}`}>
          <ul>
            <li><NavLink to="/" onClick={() => setMenuOpen(false)}>Ana Səhifə</NavLink></li>
            <li><NavLink to="/otaqlar" onClick={() => setMenuOpen(false)}>Otaqlar</NavLink></li>
            <li><NavLink to="/haqqimizda" onClick={() => setMenuOpen(false)}>Haqqımızda</NavLink></li>
            <li><NavLink to="/restoran" onClick={() => setMenuOpen(false)}>Restoran</NavLink></li>
            <li><NavLink to="/spa" onClick={() => setMenuOpen(false)}>SPA</NavLink></li>
            <li><NavLink to="/qalereya" onClick={() => setMenuOpen(false)}>Qalereya</NavLink></li>
            <li><NavLink to="/elaqe" onClick={() => setMenuOpen(false)}>Əlaqə</NavLink></li>
            <li><NavLink to="/rezervasiya" onClick={() => setMenuOpen(false)}>Rezervasiya Et</NavLink></li>
            <li><NavLink to="/hesab" onClick={() => setMenuOpen(false)}>Hesabım</NavLink></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
