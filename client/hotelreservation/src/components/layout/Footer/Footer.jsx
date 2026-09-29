import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowUp } from 'react-icons/fa';
import logo from '../../../assets/images/logo.png';
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-col">
            <div className="footer-logo">
              <img src={logo} alt="OtelBurada" />
            </div>
            <p className="footer-description">
              OtelBurada - Azərbaycanda və dünyada ən yaxşı otel rezervasiya platforması. 
              Lüks və rahatlığı bir arada yaşayın.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h3 className="footer-heading">Sürətli Keçidlər</h3>
            <ul className="footer-links">
              <li><Link to="/">Ana Səhifə</Link></li>
              <li><Link to="/otaqlar">Otaqlar</Link></li>
              <li><Link to="/haqqimizda">Haqqımızda</Link></li>
              <li><Link to="/restoran">Restoran</Link></li>
              <li><Link to="/spa">SPA</Link></li>
              <li><Link to="/qalereya">Qalereya</Link></li>
              <li><Link to="/elaqe">Əlaqə</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h3 className="footer-heading">Xidmətlər</h3>
            <ul className="footer-links">
              <li><Link to="/otaqlar">Otaq Rezervasiyası</Link></li>
              <li><Link to="/restoran">Restoran Rezervasiyası</Link></li>
              <li><Link to="/spa">SPA & Wellness</Link></li>
              <li><a href="#">Konfrans Zalları</a></li>
              <li><a href="#">Düğün Təşkilatı</a></li>
              <li><a href="#">Transfer Xidməti</a></li>
              <li><a href="#">Tur Paketləri</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-col">
            <h3 className="footer-heading">Əlaqə</h3>
            <ul className="footer-contact">
              <li>
                <FaMapMarkerAlt className="contact-icon" />
                <span>Bakı, Azərbaycan<br />Nəsimi rayonu, 28 May küçəsi</span>
              </li>
              <li>
                <FaPhone className="contact-icon" />
                <span>+994 12 345 67 89</span>
              </li>
              <li>
                <FaEnvelope className="contact-icon" />
                <span>info@otelburada.az</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>&copy; 2024 OtelBurada. Bütün hüquqlar qorunur.</p>
          <div className="footer-bottom-links">
            <a href="#">Məxfilik Siyasəti</a>
            <a href="#">İstifadə Şərtləri</a>
            <a href="#">Cookie Siyasəti</a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button 
        className="scroll-top-btn" 
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;
