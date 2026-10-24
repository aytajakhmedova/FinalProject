import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitch from '../../components/LanguageSwitch/LanguageSwitch';
import { forgotPasswordRequest, resetPasswordRequest } from '../../api/auth';
import './Auth.css';

const ForgotPassword = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const token = (searchParams.get('token') || '').trim();
  const isReset = Boolean(token);

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [sentMessage, setSentMessage] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleRequest = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!email.trim()) nextErrors.email = t('auth.emailReq');
    else if (!/\S+@\S+\.\S+/.test(email)) nextErrors.email = t('auth.emailBad');
    setErrors(nextErrors);
    setSentMessage('');
    if (Object.keys(nextErrors).length) return;

    setIsLoading(true);
    try {
      const data = await forgotPasswordRequest(email.trim());
      if (!data?.message) {
        setErrors({ form: t('auth.forgotNoConfirm') });
        return;
      }
      setSentMessage(data.message);
    } catch (error) {
      setErrors({ form: error.message || t('auth.forgotNoConfirm') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!email.trim()) nextErrors.email = t('auth.emailReq');
    else if (!/\S+@\S+\.\S+/.test(email)) nextErrors.email = t('auth.emailBad');
    if (!token) nextErrors.form = t('auth.tokenMissing');
    if (!password) nextErrors.password = t('auth.passReq');
    else if (password.length < 6) nextErrors.password = t('auth.passShort');
    if (password !== confirmPassword) nextErrors.confirmPassword = t('auth.passMismatch');
    setErrors(nextErrors);
    setResetMessage('');
    if (Object.keys(nextErrors).length) return;

    setIsLoading(true);
    try {
      const data = await resetPasswordRequest({
        email: email.trim(),
        token,
        newPassword: password,
      });
      if (!data?.message) {
        setErrors({ form: t('auth.resetNoConfirm') });
        return;
      }
      setResetMessage(data.message);
    } catch (error) {
      setErrors({ form: error.message || t('auth.resetNoConfirm') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-lang">
              <LanguageSwitch />
            </div>
            <h1 className="auth-title">{isReset ? t('auth.resetTitle') : t('auth.forgotTitle')}</h1>
            <p className="auth-subtitle">{isReset ? t('auth.resetSub') : t('auth.forgotSub')}</p>
          </div>

          {isReset ? (
            <form onSubmit={handleReset} className="auth-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">{t('auth.email')}</label>
                <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="emailiniz@example.com"
                    className="form-input"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">{t('auth.newPassword')}</label>
                <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="form-input"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">{t('auth.passRepeat')}</label>
                <div className={`input-wrapper ${errors.confirmPassword ? 'error' : ''}`}>
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="••••••••"
                    className="form-input"
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              {errors.form && <span className="error-message">{errors.form}</span>}
              {resetMessage && <p className="form-success">{resetMessage}</p>}

              <button type="submit" className="auth-submit-btn" disabled={isLoading || Boolean(resetMessage)}>
                {isLoading ? t('auth.savingPassword') : t('auth.savePassword')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRequest} className="auth-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">{t('auth.email')}</label>
                <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="emailiniz@example.com"
                    className="form-input"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {errors.form && <span className="error-message">{errors.form}</span>}
              {sentMessage && (
                <p className="form-success">
                  {sentMessage}
                  <span className="form-success-note">{t('auth.forgotPending')}</span>
                </p>
              )}

              <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                {isLoading ? t('auth.sending') : t('auth.sendLink')}
              </button>
            </form>
          )}

          <div className="auth-footer">
            <p>
              <Link to="/login" className="auth-link">{t('auth.backLogin')}</Link>
            </p>
          </div>
        </div>

        <div className="auth-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
