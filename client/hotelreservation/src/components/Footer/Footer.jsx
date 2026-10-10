import React from 'react';
import { FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaMapMarkerAlt, FaEnvelope, FaPhone, FaArrowUp } from 'react-icons/fa';
import logo from '../../assets/images/AE_HOTEL_transparent_logo.png';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();
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
              <img src={logo} alt="AE Hotel" />
            </div>
            <p className="footer-description">
              {t('footer.desc')}
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
            <h3 className="footer-heading">{t('footer.links')}</h3>
            <ul className="footer-links">
              <li><a href="#top">{t('footer.home')}</a></li>
              <li><a href="#about">{t('footer.about')}</a></li>
              <li><a href="#results">{t('footer.hotels')}</a></li>
              <li><a href="#tours">{t('footer.tours')}</a></li>
            </ul>
          </div>

          {/* Working Hours */}
          <div className="footer-col">
            <h3 className="footer-heading">{t('footer.hours')}</h3>
            <ul className="footer-hours">
              <li>
                <span>{t('footer.monFri')}</span>
                <span>{t('footer.allDay')}</span>
              </li>
              <li>
                <span>{t('footer.sat')}</span>
                <span>{t('footer.allDay')}</span>
              </li>
              <li>
                <span>{t('footer.sun')}</span>
                <span>{t('footer.allDay')}</span>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="footer-col">
            <h3 className="footer-heading">{t('footer.contact')}</h3>
            <ul className="footer-contact">
              <li>
                <FaMapMarkerAlt className="contact-icon" />
                <span>UK, 1212, 192/8 New Elephant Road London</span>
              </li>
              <li>
                <FaEnvelope className="contact-icon" />
                <span>info@aehotel.com</span>
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
          <p>&copy; 2026 AE Hotel. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">{t('footer.privacy')}</a>
            <a href="#">{t('footer.terms')}</a>
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
