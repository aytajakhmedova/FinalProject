import React from 'react';
import { FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaMapMarkerAlt, FaEnvelope, FaPhone, FaArrowUp } from 'react-icons/fa';
import logo from '../../assets/images/logo.png';
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Logo and Description */}
          <div className="footer-col">
            <div className="footer-logo">
              <img src={logo} alt="OtelBurada" />
            </div>
            <p className="footer-description">
              OtelBurada-da lüks sadəcə ünvan deyil — hiss, təcrübə və həyat tərzidir. Otel, uçuş, tur və taksi bir platformada.
            </p>
            <div className="footer-social">
              <a href="#" className="social-icon"><FaLinkedin /></a>
              <a href="#" className="social-icon"><FaTwitter /></a>
              <a href="#" className="social-icon"><FaInstagram /></a>
              <a href="#" className="social-icon"><FaFacebook /></a>
            </div>
          </div>

          {/* Useful Links */}
          <div className="footer-col">
            <h3 className="footer-heading">Keçidlər</h3>
            <ul className="footer-links">
              <li><a href="#top">Ana səhifə</a></li>
              <li><a href="#about">Haqqımızda</a></li>
              <li><a href="#results">Otellər</a></li>
              <li><a href="#tours">Turlar</a></li>
            </ul>
          </div>

          {/* Working Hours */}
          <div className="footer-col">
            <h3 className="footer-heading">Dəstək saatları</h3>
            <ul className="footer-hours">
              <li>
                <span>Bazar ertəsi – Cümə</span>
                <span>24 saat</span>
              </li>
              <li>
                <span>Şənbə</span>
                <span>24 saat</span>
              </li>
              <li>
                <span>Bazar</span>
                <span>24 saat</span>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="footer-col">
            <h3 className="footer-heading">Əlaqə</h3>
            <ul className="footer-contact">
              <li>
                <FaMapMarkerAlt className="contact-icon" />
                <span>UK, 1212, 192/8 New Elephant Road London</span>
              </li>
              <li>
                <FaEnvelope className="contact-icon" />
                <span>info@otelburada.com</span>
              </li>
              <li>
                <FaPhone className="contact-icon" />
                <span>(094) 542 - 4789</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; 2026 OtelBurada. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Məxfilik</a>
            <a href="#">Şərtlər</a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button className="scroll-top-btn" onClick={scrollToTop}>
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;
