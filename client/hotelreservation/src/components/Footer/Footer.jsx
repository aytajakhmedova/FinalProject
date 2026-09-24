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
              OtelBurada-da lüks sadəcə bir təyinat deyil—bu, bir hissdır, bir təcrübədir və həyat tərzidiir.
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
            <h3 className="footer-heading">Useful Links</h3>
            <ul className="footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Rooms</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          {/* Working Hours */}
          <div className="footer-col">
            <h3 className="footer-heading">Working Hours</h3>
            <ul className="footer-hours">
              <li>
                <span>Mon to Fri</span>
                <span>08:00 - 11:00</span>
              </li>
              <li>
                <span>Saturday</span>
                <span>08:00 - 11:30</span>
              </li>
              <li>
                <span>Sunday</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="footer-col">
            <h3 className="footer-heading">Contact Us</h3>
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
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
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
