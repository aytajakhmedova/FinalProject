import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiGlobe, FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { getAllCountries, createCountry, updateCountry, deleteCountry } from '../../../api/client';
import { newestFirst } from '../../../utils/newestFirst';
import './AdminCountries.css';

const AdminCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [formData, setFormData] = useState({ name: '', isoCode: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timeout);
  }, [toast]);

  const loadCountries = async () => {
    try {
      setLoading(true);
      const data = await getAllCountries();
      // Filter out Maldives
      const filteredData = data.filter(country => {
        const name = country.name?.toLowerCase() || '';
        return !name.includes('maldiv') && !name.includes('maldives');
      });
      setCountries(newestFirst(filteredData));
      setError('');
    } catch (err) {
      setError(err.message || 'Ölkələr yüklənmədi');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (country = null) => {
    if (country) {
      setEditingCountry(country);
      setFormData({ name: country.name, isoCode: country.isoCode || '' });
    } else {
      setEditingCountry(null);
      setFormData({ name: '', isoCode: '' });
    }
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCountry(null);
    setFormData({ name: '', isoCode: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Ölkə adı daxil edilməlidir');
      return;
    }

    setSaving(true);
    try {
      if (editingCountry) {
        await updateCountry(editingCountry.id, formData);
        setToast({ type: 'success', message: 'Ölkə uğurla yeniləndi' });
      } else {
        await createCountry(formData);
        setToast({ type: 'success', message: 'Ölkə uğurla yaradıldı' });
      }
      await loadCountries();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Əməliyyat uğursuz oldu');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`"${name}" ölkəsini silmək istədiyinizdən əminsiniz?`)) {
      return;
    }

    console.log('Deleting country:', { id, name }); // Debug

    try {
      await deleteCountry(id);
      setToast({ type: 'success', message: 'Ölkə uğurla silindi' });
      await loadCountries();
    } catch (err) {
      console.error('Delete error:', err); // Debug
      setToast({ type: 'error', message: err.message || 'Ölkə silinmədi' });
    }
  };

  if (loading) {
    return (
      <div className="um-page">
        <div className="um-loading">Yüklənir...</div>
      </div>
    );
  }

  return (
    <div className="um-page">
      <div className="um-heading">
        <h1>Ölkələr</h1>
        <p>Database-də olan bütün ölkələr</p>
      </div>

      {error && <div className="um-alert um-error"><FiAlertCircle /> {error}</div>}

      <div className="um-directory">
        <div className="um-toolbar">
          <h2>{countries.length} ölkə</h2>
          <button className="um-btn um-primary" onClick={() => handleOpenModal()}>
            <FiPlus /> Yeni Ölkə
          </button>
        </div>

        <table className="um-table">
          <thead>
            <tr>
              <th>Ölkə</th>
              <th>ISO Kodu</th>
              <th>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {countries.length === 0 ? (
              <tr>
                <td colSpan="3">
                  <div className="um-empty">
                    <FiGlobe />
                    <p>Heç bir ölkə tapılmadı</p>
                  </div>
                </td>
              </tr>
            ) : (
              countries.map((country) => (
                <tr key={country.id}>
                  <td>
                    <div className="country-name">
                      {country.isoCode && (
                        <span className="country-flag" role="img" aria-label={country.name}>
                          {String.fromCodePoint(...country.isoCode.toUpperCase().split('').map(c => 127397 + c.charCodeAt()))}
                        </span>
                      )}
                      <strong>{country.name}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="um-property">{country.isoCode || '—'}</span>
                  </td>
                  <td>
                    <div className="um-actions">
                      <button
                        className="um-icon-btn"
                        onClick={() => handleOpenModal(country)}
                        title="Redaktə et"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="um-icon-btn um-danger"
                        onClick={() => handleDelete(country.id, country.name)}
                        title="Sil"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <dialog open className="um-dialog">
          <div className="um-dialog-head">
            <h2>{editingCountry ? 'Ölkəni Redaktə Et' : 'Yeni Ölkə Yarat'}</h2>
            <button className="um-icon-btn" onClick={handleCloseModal}>
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="um-form-group">
              <label>Ölkə Adı *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Məsələn: Azərbaycan"
                required
                disabled={saving}
              />
            </div>

            <div className="um-form-group">
              <label>ISO Kodu (2 hərf)</label>
              <input
                type="text"
                value={formData.isoCode}
                onChange={(e) => setFormData({ ...formData, isoCode: e.target.value.toUpperCase().slice(0, 2) })}
                placeholder="Məsələn: AZ"
                maxLength="2"
                disabled={saving}
              />
              <small>İki hərfli ISO 3166-1 alpha-2 kodu (bayraq göstərmək üçün)</small>
            </div>

            {error && <div className="um-alert um-error"><FiAlertCircle /> {error}</div>}

            <div className="um-dialog-actions">
              <button type="button" className="um-btn" onClick={handleCloseModal} disabled={saving}>
                Ləğv et
              </button>
              <button type="submit" className="um-btn um-primary" disabled={saving}>
                {saving ? 'Saxlanılır...' : editingCountry ? 'Yenilə' : 'Yarat'}
              </button>
            </div>
          </form>
        </dialog>
      )}

      {toast && (
        <div className={`um-toast ${toast.type === 'error' ? 'um-error' : 'um-success'}`}>
          {toast.type === 'error' ? <FiAlertCircle /> : <FiCheckCircle />}
          <span>{toast.message}</span>
          <button className="um-icon-btn" onClick={() => setToast(null)}>
            <FiX />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminCountries;
