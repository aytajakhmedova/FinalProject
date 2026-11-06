import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiFilter, FiX, FiAlertCircle, FiCheckCircle, FiChevronDown } from 'react-icons/fi';
import { getAllCities, getAllCountries, createCity, updateCity, deleteCity } from '../../../api/client';
import './AdminCities.css';

const AdminCities = () => {
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [formData, setFormData] = useState({ name: '', countryId: '' });
  const [filterCountry, setFilterCountry] = useState('');
  const [saving, setSaving] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timeout);
  }, [toast]);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Loading cities and countries...'); // Debug
      const [citiesData, countriesData] = await Promise.all([
        getAllCities(),
        getAllCountries()
      ]);
      console.log('Cities loaded:', citiesData.length); // Debug
      console.log('Countries loaded:', countriesData.length); // Debug
      setCities(citiesData);
      setCountries(countriesData);
      setError('');
    } catch (err) {
      console.error('Load error:', err); // Debug
      setError(err.message || 'Məlumatlar yüklənmədi');
    } finally {
      setLoading(false);
    }
  };

  const getCountryName = (countryId) => {
    const country = countries.find(c => c.id === countryId);
    return country?.name || 'Naməlum';
  };

  const getCountryFlag = (countryId) => {
    const country = countries.find(c => c.id === countryId);
    if (country?.isoCode) {
      return String.fromCodePoint(...country.isoCode.toUpperCase().split('').map(c => 127397 + c.charCodeAt()));
    }
    return null;
  };

  const handleOpenModal = (city = null) => {
    if (city) {
      setEditingCity(city);
      setFormData({ name: city.name, countryId: city.countryId });
    } else {
      setEditingCity(null);
      setFormData({ name: '', countryId: filterCountry || (countries[0]?.id || '') });
    }
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCity(null);
    setFormData({ name: '', countryId: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Şəhər adı daxil edilməlidir');
      return;
    }

    if (!formData.countryId) {
      setError('Ölkə seçilməlidir');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        countryId: Number(formData.countryId)
      };

      if (editingCity) {
        await updateCity(editingCity.id, payload);
        setToast({ type: 'success', message: 'Şəhər uğurla yeniləndi' });
      } else {
        await createCity(payload);
        setToast({ type: 'success', message: 'Şəhər uğurla yaradıldı' });
      }
      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Əməliyyat uğursuz oldu');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`"${name}" şəhərini silmək istədiyinizdən əminsiniz?`)) {
      return;
    }

    console.log('Deleting city:', { id, name }); // Debug

    try {
      await deleteCity(id);
      setToast({ type: 'success', message: 'Şəhər uğurla silindi' });
      await loadData();
    } catch (err) {
      console.error('Delete error:', err); // Debug
      setToast({ type: 'error', message: err.message || 'Şəhər silinmədi' });
    }
  };

  const filteredCities = filterCountry
    ? cities.filter(city => city.countryId === Number(filterCountry))
    : cities;

  const selectedCountry = countries.find(c => c.id === Number(filterCountry));

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
        <h1>Şəhərlər</h1>
        <p>Database-də olan bütün şəhərlər</p>
      </div>

      {error && <div className="um-alert um-error"><FiAlertCircle /> {error}</div>}

      <div className="um-directory">
        <div className="um-toolbar">
          <h2>{filteredCities.length} şəhər</h2>
          <div className="um-controls">
            <div className="um-picker-wrapper">
              <button
                className={`um-picker ${selectedCountry ? 'um-blue' : ''}`}
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                aria-expanded={showFilterMenu}
              >
                <FiFilter />
                <span>{selectedCountry ? selectedCountry.name : 'Bütün ölkələr'}</span>
                <FiChevronDown />
              </button>
              {showFilterMenu && (
                <div className="um-options" style={{ display: 'block' }}>
                  <div className="um-choices">
                    <button
                      onClick={() => { setFilterCountry(''); setShowFilterMenu(false); }}
                      aria-pressed={!filterCountry}
                    >
                      <span>Bütün ölkələr</span>
                    </button>
                    {countries.map(country => (
                      <button
                        key={country.id}
                        onClick={() => { setFilterCountry(country.id); setShowFilterMenu(false); }}
                        aria-pressed={filterCountry === country.id}
                      >
                        {country.isoCode && (
                          <span role="img" aria-label={country.name}>
                            {String.fromCodePoint(...country.isoCode.toUpperCase().split('').map(c => 127397 + c.charCodeAt()))}
                          </span>
                        )}
                        <span>{country.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button className="um-btn um-primary" onClick={() => handleOpenModal()}>
              <FiPlus /> Yeni Şəhər
            </button>
          </div>
        </div>

        <table className="um-table">
          <thead>
            <tr>
              <th>Şəhər</th>
              <th>Ölkə</th>
              <th>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.length === 0 ? (
              <tr>
                <td colSpan="3">
                  <div className="um-empty">
                    <FiMapPin />
                    <p>Heç bir şəhər tapılmadı</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCities.map((city) => (
                <tr key={city.id}>
                  <td>
                    <strong>{city.name}</strong>
                  </td>
                  <td>
                    <div className="country-badge">
                      {getCountryFlag(city.countryId) && (
                        <span className="country-flag">
                          {getCountryFlag(city.countryId)}
                        </span>
                      )}
                      <span className="um-property">{getCountryName(city.countryId)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="um-actions">
                      <button
                        className="um-icon-btn"
                        onClick={() => handleOpenModal(city)}
                        title="Redaktə et"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="um-icon-btn um-danger"
                        onClick={() => handleDelete(city.id, city.name)}
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
            <h2>{editingCity ? 'Şəhəri Redaktə Et' : 'Yeni Şəhər Yarat'}</h2>
            <button className="um-icon-btn" onClick={handleCloseModal}>
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="um-form-group">
              <label>Ölkə *</label>
              <select
                value={formData.countryId}
                onChange={(e) => setFormData({ ...formData, countryId: e.target.value })}
                required
                disabled={saving}
              >
                <option value="">Ölkə seçin</option>
                {countries.map(country => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="um-form-group">
              <label>Şəhər Adı *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Məsələn: Bakı"
                required
                disabled={saving}
              />
            </div>

            {error && <div className="um-alert um-error"><FiAlertCircle /> {error}</div>}

            <div className="um-dialog-actions">
              <button type="button" className="um-btn" onClick={handleCloseModal} disabled={saving}>
                Ləğv et
              </button>
              <button type="submit" className="um-btn um-primary" disabled={saving}>
                {saving ? 'Saxlanılır...' : editingCity ? 'Yenilə' : 'Yarat'}
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

export default AdminCities;
