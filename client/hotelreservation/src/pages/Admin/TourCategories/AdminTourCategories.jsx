import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiAlertCircle, FiCheckCircle, FiTag } from 'react-icons/fi';
import {
  getTourCategoryList, createTourCategory, updateTourCategory, deleteTourCategory,
} from '../../../api/client';
import { newestFirst } from '../../../utils/newestFirst';
import '../Countries/AdminCountries.css';

const AdminTourCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setCategories(newestFirst(await getTourCategoryList()));
      setError('');
    } catch (err) {
      setError(err.message || 'Kateqoriyalar yüklənmədi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timeout);
  }, [toast]);

  const openModal = (category = null) => {
    setEditing(category);
    setName(category ? category.name : '');
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
    const payload = { name: name.trim() };
    if (!payload.name) {
      setError('Kateqoriyanın adı daxil edilməlidir');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateTourCategory(editing.id, payload);
        setToast({ type: 'success', message: 'Kateqoriya yeniləndi' });
      } else {
        await createTourCategory(payload);
        setToast({ type: 'success', message: 'Kateqoriya əlavə olundu' });
      }
      await load();
      closeModal();
    } catch (err) {
      setError(err.message || 'Əməliyyat uğursuz oldu');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`"${category.name}" kateqoriyasını silmək istəyirsiniz?`)) return;
    try {
      await deleteTourCategory(category.id);
      setToast({ type: 'success', message: 'Kateqoriya silindi' });
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
        <h1>Tur kateqoriyaları</h1>
        <p>Tur yaradarkən seçilən və turlar səhifəsində filtr kimi göstərilən kateqoriyalar</p>
      </div>

      {error && !showModal && <div className="um-alert um-error"><FiAlertCircle /> {error}</div>}

      <div className="um-directory">
        <div className="um-toolbar">
          <h2>{categories.length} kateqoriya</h2>
          <button className="um-btn um-primary" onClick={() => openModal()}>
            <FiPlus /> Yeni kateqoriya
          </button>
        </div>

        <table className="um-table">
          <thead>
            <tr>
              <th>Ad</th>
              <th>Tur sayı</th>
              <th>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="3">
                  <div className="um-empty">
                    <FiTag />
                    <p>Heç bir kateqoriya yoxdur</p>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td><strong>{category.name}</strong></td>
                  <td>{category.tourCount}</td>
                  <td>
                    <div className="um-actions">
                      <button className="um-icon-btn" onClick={() => openModal(category)} title="Redaktə et">
                        <FiEdit2 />
                      </button>
                      <button
                        className="um-icon-btn um-danger"
                        onClick={() => handleDelete(category)}
                        title={category.tourCount > 0 ? 'Turu olan kateqoriya silinə bilməz' : 'Sil'}
                        disabled={category.tourCount > 0}
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
            <h2>{editing ? 'Kateqoriyanı redaktə et' : 'Yeni kateqoriya'}</h2>
            <button className="um-icon-btn" onClick={closeModal}><FiX /></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="um-form-group">
              <label>Ad *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Məsələn: Sahil"
                maxLength={100}
                required
                disabled={saving}
              />
              {editing && editing.tourCount > 0 && (
                <small>Ad dəyişsə, bu kateqoriyadakı {editing.tourCount} turda da yenilənəcək.</small>
              )}
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

export default AdminTourCategories;
