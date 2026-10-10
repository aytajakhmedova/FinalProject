import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitch from '../../components/LanguageSwitch/LanguageSwitch';
import './Auth.css';

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

    // Mock authentication
    setTimeout(() => {
      // Mock successful login - use actual entered email
      const mockUser = {
        id: Date.now(), // unique ID
        name: formData.email.split('@')[0], // use email username as name temporarily
        email: formData.email,
        phone: '+994 50 123 45 67',
      };

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('isAuthenticated', 'true');
      
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      setIsLoading(false);

      const pendingRaw = localStorage.getItem('pendingBooking');
      if (pendingRaw) {
        try {
          const pending = JSON.parse(pendingRaw);
          localStorage.removeItem('pendingBooking');
          const params = new URLSearchParams();
          if (pending.hotelId) params.set('hotel', pending.hotelId);
          if (pending.checkIn) params.set('checkIn', pending.checkIn);
          if (pending.checkOut) params.set('checkOut', pending.checkOut);
          if (pending.guests) params.set('guests', pending.guests);
          if (pending.roomId) {
            navigate(`/rooms/${pending.roomId}?${params.toString()}`, { replace: true });
            return;
          }
        } catch {
          localStorage.removeItem('pendingBooking');
        }
      }

      const from = location.state?.from || '/dashboard';
      navigate(from, { replace: true });
    }, 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-lang">
              <LanguageSwitch />
            </div>
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
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="emailiniz@example.com"
                  className="form-input"
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
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
                t('auth.login')
              )}
            </button>
          </form>

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
