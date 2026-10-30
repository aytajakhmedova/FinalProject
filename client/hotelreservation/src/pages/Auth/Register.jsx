import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { registerRequest, saveAuthSession } from '../../api/auth';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [legalOpen, setLegalOpen] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = t('auth.nameReq');
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = t('auth.nameShort');
    }

    if (!formData.email) {
      newErrors.email = t('auth.emailReq');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.emailBad');
    }

    if (!formData.phone) {
      newErrors.phone = t('profile.phoneReq');
    } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = t('auth.phoneBad');
    }

    if (!formData.password) {
      newErrors.password = t('auth.passReq');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.passShort');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.passRepeatReq');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.passMismatch');
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = t('auth.terms');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    const parts = formData.fullName.trim().split(/\s+/);
    try {
      const auth = await registerRequest({
        email: formData.email,
        password: formData.password,
        name: parts[0],
        surname: parts.slice(1).join(' ') || parts[0],
        phone: formData.phone,
      });
      saveAuthSession(auth);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card register-card">
          <div className="auth-header">
            <h1 className="auth-title">{t('auth.register')}</h1>
            <p className="auth-subtitle">{t('auth.registerSub')}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                {t('auth.fullName')}
              </label>
              <div className={`input-wrapper ${errors.fullName ? 'error' : ''}`}>
                <FaUser className="input-icon" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={t('auth.fullNamePh')}
                  className="form-input"
                />
              </div>
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                {t('auth.email')}
              </label>
              <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="emailiniz@example.com"
                  className="form-input"
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                {t('auth.phone')}
              </label>
              <div className={`input-wrapper ${errors.phone ? 'error' : ''}`}>
                <FaPhone className="input-icon" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+994 50 123 45 67"
                  className="form-input"
                />
              </div>
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                {t('auth.password')}
              </label>
              <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                {t('auth.passRepeat')}
              </label>
              <div className={`input-wrapper ${errors.confirmPassword ? 'error' : ''}`}>
                <FaLock className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            {/* Terms & Conditions */}
            <div className="form-group">
              <label className="checkbox-label terms-label">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <span>
                  {t('legal.acceptPrefix')}<button type="button" className="terms-link" onClick={() => setLegalOpen('terms')}>{t('legal.termsTitle')}</button>
                  {' '}{t('legal.and')}{' '}
                  <button type="button" className="terms-link" onClick={() => setLegalOpen('privacy')}>{t('legal.privacyTitle')}</button>{t('legal.acceptSuffix')}
                </span>
              </label>
              {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
            </div>

            {errors.form && <span className="error-message">{errors.form}</span>}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  {t('auth.registering')}
                </span>
              ) : (
                t('auth.registerBtn')
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="auth-footer">
            <p>
              {t('auth.hasAccount')} {' '}
              <Link to="/login" className="auth-link">
                {t('auth.loginLink')}
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="auth-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>

      {legalOpen && (
        <div className="legal-overlay" onClick={() => setLegalOpen(null)}>
          <div
            className="legal-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="legal-toolbar">
              <button
                type="button"
                className={`legal-tab ${legalOpen === 'terms' ? 'active' : ''}`}
                onClick={() => setLegalOpen('terms')}
              >
                {t('legal.termsTitle')}
              </button>
              <button
                type="button"
                className={`legal-tab ${legalOpen === 'privacy' ? 'active' : ''}`}
                onClick={() => setLegalOpen('privacy')}
              >
                {t('legal.privacyTitle')}
              </button>
              <button type="button" className="legal-close" onClick={() => setLegalOpen(null)} aria-label={t('legal.close')}>
                ×
              </button>
            </div>
            <div className="legal-body">
              <h2 id="legal-title">
                {legalOpen === 'privacy' ? t('legal.privacyTitle') : t('legal.termsTitle')}
              </h2>
              {(legalOpen === 'privacy' ? t('legal.privacyBody') : t('legal.termsBody'))
                .split('\n\n')
                .map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
