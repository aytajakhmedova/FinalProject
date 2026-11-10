import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiLogIn, FiMail as FaEnvelope, FiLock as FaLock } from 'react-icons/fi';
import AuthBrand, { AuthSocialOptions } from './AuthBrand';
import { useLanguage } from '../../context/LanguageContext';
import { getPostLoginPath, getSafeAdminPath, loginRequest, saveAuthSession } from '../../api/auth';
import './Auth.css';
import './LuxuryAuth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    
    if (!formData.email) {
      newErrors.email = t('auth.emailReq');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.emailBad');
    }

    if (!formData.password) {
      newErrors.password = t('auth.passReq');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.passShort');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const auth = await loginRequest(formData.email, formData.password);
      saveAuthSession(auth, { rememberMe: formData.rememberMe });
      
      // Clean up any pending booking data (not used anywhere)
      localStorage.removeItem('pendingBooking');
      
      if (location.state?.hotelCheckout) {
        navigate('/booking', { state: location.state.hotelCheckout, replace: true });
        return;
      }
      const nextPath = getSafeAdminPath(new URLSearchParams(location.search).get('next'));
      const roles = Array.isArray(auth.roles) ? auth.roles : [];
      if (nextPath && !roles.some((role) => ['Admin', 'SuperAdmin', 'HotelManager', 'Receptionist'].includes(role))) {
        setErrors({ form: 'Rezervasiyalar və admin səhifələri üçün admin hesabı lazımdır.' });
        return;
      }
      navigate(nextPath || getPostLoginPath(roles), { replace: true });
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page auth-luxury">
      <AuthBrand />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">{t('auth.welcome')}</h1>
            <p className="auth-subtitle">{t('auth.loginSub')}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
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
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'login-email-error' : undefined}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="emailiniz@example.com"
                  className="form-input"
                />
              </div>
              {errors.email && <span id="login-email-error" className="error-message">{errors.email}</span>}
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
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'login-password-error' : undefined}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showPassword ? 'Şifrəni gizlət' : 'Şifrəni göstər'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {errors.password && <span id="login-password-error" className="error-message">{errors.password}</span>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <span>{t('auth.remember')}</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                {t('auth.forgot')}
              </Link>
            </div>

            {errors.form && <span className="error-message" role="alert">{errors.form}</span>}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  {t('auth.loggingIn')}
                </span>
              ) : (
                <><FiLogIn aria-hidden="true" />{t('auth.login')}</>
              )}
            </button>
          </form>
          <AuthSocialOptions />

          {/* Register Link */}
          <div className="auth-footer">
            <p>
              {t('auth.noAccount')} {' '}
              <Link to="/register" className="auth-link">
                {t('auth.registerLink')}
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
    </div>
  );
};

export default Login;
