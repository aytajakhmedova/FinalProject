import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiAlertCircle, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
import {
  getSeasonalPrices, createSeasonalPrice, updateSeasonalPrice, deleteSeasonalPrice, getAllCountries,
} from '../../../api/client';
import { MONTH_NAMES, formatPriceRange, toAzn } from '../../../data/seasonalPrices';
import { newestFirst } from '../../../utils/newestFirst';
import '../Countries/AdminCountries.css';

const emptyForm = { country: '', month: 2, minPrice: '', maxPrice: '', currency: 'AZN' };

const AdminSeasonalPrices = () => {
  const [prices, setPrices] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getSeasonalPrices();
      // Filter out Maldives from seasonal prices
      const filteredData = data.filter(price => {
        const country = price.country?.toLowerCase() || '';
        return !country.includes('maldiv') && !country.includes('maldives');
      });
      setPrices(newestFirst(filteredData));
      setError('');
    } catch (err) {
      setError(err.message || 'Qiymətlər yüklənmədi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    getAllCountries().then(setCountries).catch(() => setCountries([]));
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timeout);
  }, [toast]);

  const openModal = (price = null) => {
    setEditing(price);
    setFormData(price
      ? {
        country: price.country,
        month: price.month,
        minPrice: Math.round(toAzn(price.minPrice, price.currency)),
        maxPrice: Math.round(toAzn(price.maxPrice, price.currency)),
        currency: 'AZN',
      }
      : emptyForm);
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const payload = {
      country: formData.country.trim(),
      month: Number(formData.month),
      minPrice: Number(formData.minPrice),
      maxPrice: Number(formData.maxPrice),
      currency: 'AZN',
    };
    if (!payload.country) {
      setError('Ölkə daxil edilməlidir');
      return;
    }
    if (payload.maxPrice < payload.minPrice) {
      setError('Maksimum qiymət minimumdan az ola bilməz');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateSeasonalPrice(editing.id, payload);
        setToast({ type: 'success', message: 'Qiymət aralığı yeniləndi' });
      } else {
        await createSeasonalPrice(payload);
        setToast({ type: 'success', message: 'Qiymət aralığı əlavə olundu' });
      }
      await load();
      closeModal();
    } catch (err) {
      setError(err.message || 'Əməliyyat uğursuz oldu');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (price) => {
    if (!window.confirm(`${price.country} — ${MONTH_NAMES[price.month - 1]} qiymət aralığını silmək istəyirsiniz?`)) return;
    try {
      await deleteSeasonalPrice(price.id);
      setToast({ type: 'success', message: 'Qiymət aralığı silindi' });
      await load();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Silinmədi' });
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
        <h1>Mövsüm qiymətləri</h1>
        <p>Ana səhifədəki "Növbəti səyahəti nə vaxt bron etmək daha sərfəlidir?" cədvəli</p>
      </div>

      {error && !showModal && <div className="um-alert um-error"><FiAlertCircle /> {error}</div>}

      <div className="um-directory">
        <div className="um-toolbar">
          <h2>{prices.length} qiymət aralığı</h2>
          <button className="um-btn um-primary" onClick={() => openModal()}>
            <FiPlus /> Yeni aralıq
          </button>
        </div>

        <table className="um-table">
          <thead>
            <tr>
              <th>Ölkə</th>
              <th>Ay</th>
              <th>Qiymət aralığı (gecəlik)</th>
              <th>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {prices.length === 0 ? (
              <tr>
                <td colSpan="4">
                  <div className="um-empty">
                    <FiTrendingUp />
                    <p>Heç bir qiymət aralığı yoxdur</p>
                  </div>
                </td>
              </tr>
            ) : (
              prices.map((price) => (
                <tr key={price.id}>
                  <td><strong>{price.country}</strong></td>
                  <td>{MONTH_NAMES[price.month - 1]}</td>
                  <td><span className="um-property">{formatPriceRange(price)}</span></td>
                  <td>
                    <div className="um-actions">
                      <button className="um-icon-btn" onClick={() => openModal(price)} title="Redaktə et">
                        <FiEdit2 />
                      </button>
                      <button className="um-icon-btn um-danger" onClick={() => handleDelete(price)} title="Sil">
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
            <h2>{editing ? 'Qiymət aralığını redaktə et' : 'Yeni qiymət aralığı'}</h2>
            <button className="um-icon-btn" onClick={closeModal}><FiX /></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="um-form-group">
              <label>Ölkə *</label>
              <input
                list="seasonal-countries"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Məsələn: Azərbaycan"
                maxLength={100}
                required
                disabled={saving}
              />
              <datalist id="seasonal-countries">
                {countries.map((country) => <option key={country.id} value={country.name} />)}
              </datalist>
            </div>

            <div className="um-form-group">
              <label>Ay *</label>
              <select
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                disabled={saving}
              >
                {MONTH_NAMES.map((name, index) => <option key={name} value={index + 1}>{name}</option>)}
              </select>
            </div>

            <div className="um-form-group">
              <label>Minimum qiymət (₼ AZN) *</label>
              <input
                type="number" min="0" step="1" required disabled={saving}
                value={formData.minPrice}
                onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
              />
            </div>

            <div className="um-form-group">
              <label>Maksimum qiymət (₼ AZN) *</label>
              <input
                type="number" min="0" step="1" required disabled={saving}
                value={formData.maxPrice}
                onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
              />
              <small>Ana səhifədə bu aralığa klik edən istifadəçi bu qiymətlər arasındakı otelləri görəcək.</small>
            </div>

            {error && <div className="um-alert um-error"><FiAlertCircle /> {error}</div>}

            <div className="um-dialog-actions">
              <button type="button" className="um-btn" onClick={closeModal} disabled={saving}>Ləğv et</button>
              <button type="submit" className="um-btn um-primary" disabled={saving}>
                {saving ? 'Saxlanılır...' : editing ? 'Yenilə' : 'Əlavə et'}
              </button>
            </div>
          </form>
        </dialog>
      )}

      {toast && (
        <div className={`um-toast ${toast.type === 'error' ? 'um-error' : 'um-success'}`}>
          {toast.type === 'error' ? <FiAlertCircle /> : <FiCheckCircle />}
          <span>{toast.message}</span>
          <button className="um-icon-btn" onClick={() => setToast(null)}><FiX /></button>
        </div>
      )}
    </div>
  );
};

export default AdminSeasonalPrices;
