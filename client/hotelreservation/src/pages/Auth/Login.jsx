import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
      newErrors.email = 'Email tələb olunur';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Düzgün email daxil edin';
    }

    if (!formData.password) {
      newErrors.password = 'Şifrə tələb olunur';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifrə ən azı 6 simvoldan ibarət olmalıdır';
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
      // Mock successful login
      const mockUser = {
        id: 1,
        name: 'Aynur Məmmədova',
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

      // Redirect
      const from = location.state?.from || '/dashboard';
      navigate(from, { replace: true });
    }, 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Xoş gəlmisiniz</h1>
            <p className="auth-subtitle">Hesabınıza daxil olun</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
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
                Şifrə
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
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
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
                <span>Məni xatırla</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Şifrəni unutmusunuz?
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
                  Daxil olunur...
                </span>
              ) : (
                'Daxil ol'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="auth-footer">
            <p>
              Hesabınız yoxdur? {' '}
              <Link to="/register" className="auth-link">
                Qeydiyyatdan keçin
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
