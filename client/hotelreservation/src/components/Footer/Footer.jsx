import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaMapMarkerAlt, FaEnvelope, FaPhone, FaArrowUp } from 'react-icons/fa';
import { useSiteContent } from '../../context/SiteContentContext';
import { resolveImage } from '../../api/client';
import './Footer.css';

const Footer = () => {
  const { content, loading, error } = useSiteContent();
  const settings = content?.settings;
  const logo = resolveImage(settings?.logoUrl);
  const links = (content?.menus?.footer || []).filter((item) => item.url !== '/taxis');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {error && !content && <p className="footer-description">{error}</p>}
        {loading && !content && <p className="footer-description">Yüklənir...</p>}
        {settings && (
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-logo">
              {logo ? <img src={logo} alt={settings.siteName} /> : <span>{settings.siteName}</span>}
            </div>
            <p className="footer-description">{settings.footerDescription}</p>
            <div className="footer-social">
              {settings.linkedInUrl && <a href={settings.linkedInUrl} className="social-icon" target="_blank" rel="noreferrer"><FaLinkedin /></a>}
              {settings.twitterUrl && <a href={settings.twitterUrl} className="social-icon" target="_blank" rel="noreferrer"><FaTwitter /></a>}
              {settings.instagramUrl && <a href={settings.instagramUrl} className="social-icon" target="_blank" rel="noreferrer"><FaInstagram /></a>}
              {settings.facebookUrl && <a href={settings.facebookUrl} className="social-icon" target="_blank" rel="noreferrer"><FaFacebook /></a>}
            </div>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">{settings.footerLinksTitle}</h3>
            <ul className="footer-links">
              {links.map((item) => (
                <li key={item.id}>
                  {item.isRoute ? (
                    <Link to={item.url}>{item.label}</Link>
                  ) : (
                    <a href={item.url}>{item.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">{settings.footerHoursTitle}</h3>
            <ul className="footer-hours">
              <li>
                <span>{settings.hoursWeekdays}</span>
                <span>{settings.hoursValue}</span>
              </li>
              <li>
                <span>{settings.hoursSaturday}</span>
                <span>{settings.hoursValue}</span>
              </li>
              <li>
                <span>{settings.hoursSunday}</span>
                <span>{settings.hoursValue}</span>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">{settings.footerContactTitle}</h3>
            <ul className="footer-contact">
              {settings.contactAddress && (
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>{settings.contactAddress}</span>
                </li>
              )}
              {settings.contactEmail && (
                <li>
                  <FaEnvelope className="contact-icon" />
                  <span>{settings.contactEmail}</span>
                </li>
              )}
              {settings.contactPhone && (
                <li>
                  <FaPhone className="contact-icon" />
                  <span>{settings.contactPhone}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
        )}

        <div className="footer-bottom">
          <p>{settings?.copyrightText}</p>
          <div className="footer-bottom-links">
            {settings?.privacyUrl && <a href={settings.privacyUrl}>Məxfilik</a>}
            {settings?.termsUrl && <a href={settings.termsUrl}>Şərtlər</a>}
          </div>
        </div>
      </div>

      <button className="scroll-top-btn" onClick={scrollToTop}>
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;
