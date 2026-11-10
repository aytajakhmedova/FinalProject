import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEdit, FaCamera, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { getAuthUser, clearAuthSession } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { t, locale } = useLanguage();
  const navigate = useNavigate();
  
  // Get user from JWT token, not localStorage directly
  const [user, setUser] = useState(() => {
    const authUser = getAuthUser();
    if (!authUser) {
      return null;
    }
    
    // User-specific profile data from localStorage
    const profileKey = authUser.email ? `userProfile_${authUser.email}` : 'userProfile_guest';
    const savedProfile = localStorage.getItem(profileKey);
    const profile = savedProfile ? JSON.parse(savedProfile) : {};
    
    return {
      id: authUser.id || Date.now(),
      name: profile.name || authUser.name || authUser.email?.split('@')[0] || 'İstifadəçi',
      email: authUser.email || 'email@example.com',
      phone: profile.phone || '',
      avatar: profile.avatar || null,
      memberSince: profile.memberSince || new Date().toISOString(),
      verified: true,
      roles: authUser.roles || []
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Sync with auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      const authUser = getAuthUser();
      if (!authUser) {
        setUser(null);
        navigate('/login');
      }
    };
    
    window.addEventListener('storage', handleAuthChange);
    return () => window.removeEventListener('storage', handleAuthChange);
  }, [navigate]);

  if (!user) {
    return null;
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEdit = () => {
    const newErrors = {};
    
    if (!editForm.name.trim()) {
      newErrors.name = t('profile.nameReq');
    }

    if (!editForm.email) {
      newErrors.email = t('auth.emailReq');
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      newErrors.email = t('auth.emailBad');
    }

    if (editForm.phone && !/^[\d\s\+\-\(\)]+$/.test(editForm.phone)) {
      newErrors.phone = 'Telefon nömrəsi düzgün deyil';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = t('profile.currentReq');
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = t('profile.newReq');
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = t('auth.passShort');
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = t('auth.passRepeatReq');
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = t('auth.passMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    
    if (!validateEdit()) return;

    // Save to localStorage (backend endpoint does not exist)
    const authUser = getAuthUser();
    const profileKey = authUser?.email ? `userProfile_${authUser.email}` : 'userProfile_guest';
    
    const updatedProfile = {
      name: editForm.name,
      phone: editForm.phone,
      avatar: user.avatar,
      memberSince: user.memberSince
    };
    
    const updatedUser = { ...user, ...editForm };
    setUser(updatedUser);
    localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
    
    setIsEditing(false);
    setSuccessMessage(t('profile.saved'));
    setWarningMessage('Qeyd: Email dəyişikliyi backend tərəfindən dəstəklənmir.');
    setTimeout(() => {
      setSuccessMessage('');
      setWarningMessage('');
    }, 5000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    // Backend endpoint does not exist
    setErrors({ currentPassword: 'Backend-də parol dəyişdirmə endpoint-i mövcud deyil. Bu funksiya hazırda işləmir.' });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors({ avatar: 'Yalnız şəkil faylları yükləyə bilərsiniz.' });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors({ avatar: 'Şəkil ölçüsü maksimum 2MB ola bilər.' });
      return;
    }

    // Save to localStorage (backend upload endpoint for profile avatar does not exist)
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedUser = { ...user, avatar: reader.result };
      setUser(updatedUser);
      
      const authUser = getAuthUser();
      const profileKey = authUser?.email ? `userProfile_${authUser.email}` : 'userProfile_guest';
      const profile = JSON.parse(localStorage.getItem(profileKey) || '{}');
      profile.avatar = reader.result;
      localStorage.setItem(profileKey, JSON.stringify(profile));
      
      setSuccessMessage(t('profile.avatarSaved'));
      setWarningMessage('Qeyd: Avatar yalnız bu brauzerdə saxlanılır.');
      setTimeout(() => {
        setSuccessMessage('');
        setWarningMessage('');
      }, 5000);
    };
    reader.readAsDataURL(file);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (!dateString || Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const memberSinceLabel = () => {
    const fromField = formatDate(user.memberSince);
    if (fromField) return fromField;
    if (typeof user.id === 'number' && user.id > 1e11) {
      return formatDate(user.id);
    }
    return t('profile.newMember');
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Success Message */}
        {successMessage && (
          <div className="success-banner">
            <FaCheckCircle />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Warning Message */}
        {warningMessage && (
          <div className="warning-banner">
            <FaExclamationTriangle />
            <span>{warningMessage}</span>
          </div>
        )}

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span className="avatar-placeholder">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
              <label className="avatar-upload-btn">
                <FaCamera />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{user.name}</h1>
              <p className="profile-email">{user.email}</p>
              {user.verified && (
                <div className="verified-badge">
                  <FaCheckCircle />
                  <span>{t('profile.verified')}</span>
                </div>
              )}
            </div>
          </div>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">{t('profile.memberSince')}</span>
              <span className="stat-value">{memberSinceLabel()}</span>
            </div>
          </div>
        </div>

        <div className="profile-content">
          {/* Personal Information */}
          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">{t('profile.personal')}</h2>
              {!isEditing && (
                <button 
                  className="btn-edit"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit />
                  {t('profile.edit')}
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('profile.name')}</label>
                    <div className={`input-wrapper ${errors.name ? 'error' : ''}`}>
                      <FaUser className="input-icon" />
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="form-input"
                        placeholder="Ad və Soyad"
                      />
                    </div>
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('profile.email')}</label>
                    <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                      <FaEnvelope className="input-icon" />
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="form-input"
                        placeholder="Email"
                        disabled
                        title="Email dəyişikliyi backend tərəfindən dəstəklənmir"
                      />
                    </div>
                    {errors.email && <span className="error-message">{errors.email}</span>}
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Email dəyişikliyi backend tərəfindən dəstəklənmir
                    </small>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('profile.phone')}</label>
                    <div className={`input-wrapper ${errors.phone ? 'error' : ''}`}>
                      <FaPhone className="input-icon" />
                      <input
                        type="tel"
                        name="phone"
                        value={editForm.phone}
                        onChange={(e) => {
                          // Only allow numbers, spaces, +, -, (, )
                          const value = e.target.value.replace(/[^0-9\s\+\-\(\)]/g, '');
                          handleEditChange({ target: { name: 'phone', value } });
                        }}
                        className="form-input"
                        placeholder="Telefon"
                        pattern="[\d\s\+\-\(\)]+"
                        title="Yalnız rəqəm, +, -, (, ), və boşluq qəbul edilir"
                      />
                    </div>
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save">
                    {t('profile.save')}
                  </button>
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                      });
                      setErrors({});
                    }}
                  >
                    {t('profile.cancel')}
                  </button>
                </div>
              </form>
            ) : (
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-icon">
                    <FaUser />
                  </div>
                  <div className="info-content">
                    <span className="info-label">{t('profile.name')}</span>
                    <span className="info-value">{user.name}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <FaEnvelope />
                  </div>
                  <div className="info-content">
                    <span className="info-label">{t('profile.email')}</span>
                    <span className="info-value">{user.email}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <FaPhone />
                  </div>
                  <div className="info-content">
                    <span className="info-label">{t('profile.phone')}</span>
                    <span className="info-value">{user.phone || 'Qeyd edilməyib'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Change Password */}
          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">{t('profile.security')}</h2>
              {!showPasswordForm && (
                <button 
                  className="btn-edit"
                  onClick={() => setShowPasswordForm(true)}
                >
                  <FaLock />
                  {t('profile.changePass')}
                </button>
              )}
            </div>

            {showPasswordForm ? (
              <form onSubmit={handleChangePassword} className="profile-form">
                <div className="warning-banner" style={{ marginBottom: '1rem' }}>
                  <FaExclamationTriangle />
                  <span>Backend-də parol dəyişdirmə endpoint-i mövcud deyil. Bu funksiya hazırda işləmir.</span>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('profile.currentPass')}</label>
                    <div className={`input-wrapper ${errors.currentPassword ? 'error' : ''}`}>
                      <FaLock className="input-icon" />
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="form-input"
                        placeholder="••••••••"
                        disabled
                      />
                    </div>
                    {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('profile.newPass')}</label>
                    <div className={`input-wrapper ${errors.newPassword ? 'error' : ''}`}>
                      <FaLock className="input-icon" />
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="form-input"
                        placeholder="••••••••"
                        disabled
                      />
                    </div>
                    {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('profile.confirmPass')}</label>
                    <div className={`input-wrapper ${errors.confirmPassword ? 'error' : ''}`}>
                      <FaLock className="input-icon" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="form-input"
                        placeholder="••••••••"
                        disabled
                      />
                    </div>
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                      setErrors({});
                    }}
                  >
                    {t('profile.cancel')}
                  </button>
                </div>
              </form>
            ) : (
              <div className="security-info">
                <div className="info-icon">
                  <FaLock />
                </div>
                <div className="info-content">
                  <span className="info-label">{t('profile.password')}</span>
                  <span className="info-value">••••••••</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
