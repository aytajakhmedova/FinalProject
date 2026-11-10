import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiAlertCircle, FiCheckCircle, FiSend } from 'react-icons/fi';
import { getAirlines, createAirline, updateAirline, deleteAirline } from '../../../api/client';
import { newestFirst } from '../../../utils/newestFirst';
import '../Countries/AdminCountries.css';

const emptyForm = { name: '', code: '' };

const AdminAirlines = () => {
  const [airlines, setAirlines] = useState([]);
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
      setAirlines(newestFirst(await getAirlines()));
      setError('');
    } catch (err) {
      setError(err.message || 'Aviaşirkətlər yüklənmədi');
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

  const openModal = (airline = null) => {
    setEditing(airline);
    setFormData(airline ? { name: airline.name, code: airline.code } : emptyForm);
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
    const payload = { name: formData.name.trim(), code: formData.code.trim().toUpperCase() };
    if (!payload.name) {
      setError('Aviaşirkətin adı daxil edilməlidir');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateAirline(editing.id, payload);
        setToast({ type: 'success', message: 'Aviaşirkət yeniləndi' });
      } else {
        await createAirline(payload);
        setToast({ type: 'success', message: 'Aviaşirkət əlavə olundu' });
      }
      await load();
      closeModal();
    } catch (err) {
      setError(err.message || 'Əməliyyat uğursuz oldu');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (airline) => {
    if (!window.confirm(`"${airline.name}" aviaşirkətini silmək istəyirsiniz?`)) return;
    try {
      await deleteAirline(airline.id);
      setToast({ type: 'success', message: 'Aviaşirkət silindi' });
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
        <h1>Aviaşirkətlər</h1>
        <p>Uçuş yaradarkən seçilən və uçuş filtrində göstərilən aviaşirkətlər</p>
      </div>

      {error && !showModal && <div className="um-alert um-error"><FiAlertCircle /> {error}</div>}

      <div className="um-directory">
        <div className="um-toolbar">
          <h2>{airlines.length} aviaşirkət</h2>
          <button className="um-btn um-primary" onClick={() => openModal()}>
            <FiPlus /> Yeni aviaşirkət
          </button>
        </div>

        <table className="um-table">
          <thead>
            <tr>
              <th>Ad</th>
              <th>Kod</th>
              <th>Uçuş sayı</th>
              <th>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {airlines.length === 0 ? (
              <tr>
                <td colSpan="4">
                  <div className="um-empty">
                    <FiSend />
                    <p>Heç bir aviaşirkət yoxdur</p>
                  </div>
                </td>
              </tr>
            ) : (
              airlines.map((airline) => (
                <tr key={airline.id}>
                  <td><strong>{airline.name}</strong></td>
                  <td>{airline.code || '—'}</td>
                  <td>{airline.flightCount}</td>
                  <td>
                    <div className="um-actions">
                      <button className="um-icon-btn" onClick={() => openModal(airline)} title="Redaktə et">
                        <FiEdit2 />
                      </button>
                      <button
                        className="um-icon-btn um-danger"
                        onClick={() => handleDelete(airline)}
                        title={airline.flightCount > 0 ? 'Uçuşu olan aviaşirkət silinə bilməz' : 'Sil'}
                        disabled={airline.flightCount > 0}
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
            <h2>{editing ? 'Aviaşirkəti redaktə et' : 'Yeni aviaşirkət'}</h2>
            <button className="um-icon-btn" onClick={closeModal}><FiX /></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="um-form-group">
              <label>Ad *</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Məsələn: Turkish Airlines"
                maxLength={100}
                required
                disabled={saving}
              />
              {editing && editing.flightCount > 0 && (
                <small>Ad dəyişsə, bu aviaşirkətin {editing.flightCount} uçuşunda da yenilənəcək.</small>
              )}
            </div>

            <div className="um-form-group">
              <label>Kod</label>
              <input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="TK"
                maxLength={3}
                disabled={saving}
              />
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

export default AdminAirlines;
