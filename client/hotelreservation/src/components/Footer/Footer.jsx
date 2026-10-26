import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaMapMarkerAlt, FaEnvelope, FaPhone, FaArrowUp } from 'react-icons/fa';
import { useSiteContent } from '../../context/SiteContentContext';
import { useLanguage } from '../../context/LanguageContext';
import { resolveImage } from '../../api/client';
import { menuLabel } from '../../i18n/menuLabel';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();
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
        {loading && !content && <p className="footer-description">{t('common.loading')}</p>}
        {settings && (
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-logo">
              {logo ? <img src={logo} alt={settings.siteName} /> : <span>{settings.siteName}</span>}
            </div>
            <p className="footer-description">{t('footer.desc')}</p>
            <div className="footer-social">
              {settings.linkedInUrl && <a href={settings.linkedInUrl} className="social-icon" target="_blank" rel="noreferrer"><FaLinkedin /></a>}
              {settings.twitterUrl && <a href={settings.twitterUrl} className="social-icon" target="_blank" rel="noreferrer"><FaTwitter /></a>}
              {settings.instagramUrl && <a href={settings.instagramUrl} className="social-icon" target="_blank" rel="noreferrer"><FaInstagram /></a>}
              {settings.facebookUrl && <a href={settings.facebookUrl} className="social-icon" target="_blank" rel="noreferrer"><FaFacebook /></a>}
            </div>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">{t('footer.links')}</h3>
            <ul className="footer-links">
              {links.map((item) => (
                <li key={item.id}>
                  {item.isRoute ? (
                    <Link to={item.url}>{menuLabel(item, t)}</Link>
                  ) : (
                    <a href={item.url}>{menuLabel(item, t)}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>

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

          <div className="footer-col">
            <h3 className="footer-heading">{t('footer.contact')}</h3>
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
            {settings?.privacyUrl && <a href={settings.privacyUrl}>{t('footer.privacy')}</a>}
            {settings?.termsUrl && <a href={settings.termsUrl}>{t('footer.terms')}</a>}
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
