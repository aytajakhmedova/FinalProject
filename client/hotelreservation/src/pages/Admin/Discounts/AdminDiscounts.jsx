import React, { useEffect, useMemo, useState } from 'react';
import { createDiscount, deleteDiscount, getDiscounts, updateDiscount } from '../../../api/client';
import '../Hotels/AdminHotels.css';

const COMBO_OPTIONS = [
  { value: 'hotel_flight', label: 'Otel + uçuş' },
  { value: 'hotel_tour', label: 'Otel + tur' },
  { value: 'hotel_flight_tour', label: 'Otel + uçuş + tur' },
];

const comboLabel = (combo) => COMBO_OPTIONS.find((item) => item.value === combo)?.label || combo;

const emptyDiscount = () => ({
  name: '',
  combo: 'hotel_flight',
  percent: 5,
  amount: 0,
  startsAt: '',
  endsAt: '',
  isActive: true,
});

const toDateTimeLocal = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 16);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('az-AZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const toRequest = (item) => ({
  name: (item.name || '').trim(),
  combo: item.combo,
  percent: Number(item.percent) || 0,
  amount: Number(item.amount) || 0,
  startsAt: item.startsAt ? new Date(item.startsAt).toISOString() : null,
  endsAt: item.endsAt ? new Date(item.endsAt).toISOString() : null,
  isActive: Boolean(item.isActive),
});

const AdminDiscounts = () => {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadItems = (silent = false) => {
    if (!silent) setLoading(true);
    return getDiscounts()
      .then((rows) => {
        setItems(Array.isArray(rows) ? rows : []);
        setLoadError('');
      })
      .catch((error) => {
        setItems([]);
        setLoadError(error.message || 'Endirimlər yüklənmədi.');
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  };

  useEffect(() => {
    loadItems();
  }, []);

  const visible = useMemo(() => items, [items]);

  const handleSave = (event) => {
    event.preventDefault();
    if (!editing || saving) return;
    const payload = toRequest(editing);
    if (payload.percent <= 0 && payload.amount <= 0) {
      setSaveError('Faiz və ya məbləğdən birini yazın.');
      return;
    }
    const isExisting = items.some((item) => item.id === editing.id);
    setSaving(true);
    setSaveError('');
    setSuccessMessage('');
    const action = isExisting ? updateDiscount(editing.id, payload) : createDiscount(payload);
    action
      .then(() => {
        setEditing(null);
        setSuccessMessage(isExisting ? 'Paket yeniləndi.' : 'Paket əlavə olundu.');
        return loadItems(true);
      })
      .catch((error) => {
        setSaveError(error.message || 'Paket yadda saxlanılmadı.');
      })
      .finally(() => setSaving(false));
  };

  const handleDelete = (item) => {
    if (!window.confirm('Bu endirim paketini silmək istəyirsiniz?')) return;
    setDeletingId(item.id);
    setSaveError('');
    setSuccessMessage('');
    deleteDiscount(item.id)
      .then(() => {
        if (editing?.id === item.id) setEditing(null);
        setSuccessMessage('Paket silindi.');
        return loadItems(true);
      })
      .catch((error) => {
        setSaveError(error.message || 'Paket silinmədi.');
      })
      .finally(() => setDeletingId(null));
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Paketlər və Endirimlər</h1>
        <p className="page-subtitle">Otel + uçuş / tur kombinasiyaları üçün faiz və ya məbləğ təyin edin</p>
      </div>

      {loading && <p className="page-subtitle">Yüklənir...</p>}
      {loadError && (
        <div className="coming-soon-card">
          <h2>Məlumat yüklənmədi</h2>
          <p>{loadError}</p>
          <div className="admin-form-actions">
            <button type="button" className="btn-admin-primary" onClick={() => loadItems()}>
              Yenidən yoxla
            </button>
          </div>
        </div>
      )}

      {!loading && !loadError && (
        <>
          <div className="inventory-toolbar">
            <button
              className="btn-admin-primary"
              onClick={() => { setSaveError(''); setSuccessMessage(''); setEditing(emptyDiscount()); }}
            >
              + Paket əlavə et
            </button>
          </div>
          {successMessage && !editing && <p className="page-subtitle">{successMessage}</p>}
          {saveError && !editing && <p className="muted">{saveError}</p>}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ad</th>
                  <th>Kombinasiya</th>
                  <th>Endirim</th>
                  <th>Tarix</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.name}</strong></td>
                    <td>{comboLabel(item.combo)}</td>
                    <td>
                      {Number(item.percent) > 0 ? `${Number(item.percent)}%` : '—'}
                      {Number(item.amount) > 0 ? ` / ₼${Number(item.amount)}` : ''}
                    </td>
                    <td>
                      {formatDate(item.startsAt)}
                      <div className="muted">{formatDate(item.endsAt)}</div>
                    </td>
                    <td>{item.isActive ? 'Aktiv' : 'Deaktiv'}</td>
                    <td className="table-actions">
                      <button onClick={() => {
                        setSaveError('');
                        setSuccessMessage('');
                        setEditing({
                          ...emptyDiscount(),
                          ...item,
                          startsAt: toDateTimeLocal(item.startsAt),
                          endsAt: toDateTimeLocal(item.endsAt),
                        });
                      }}>
                        Redaktə
                      </button>
                      <button className="danger" onClick={() => handleDelete(item)} disabled={deletingId === item.id}>
                        {deletingId === item.id ? 'Silinir...' : 'Sil'}
                      </button>
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan="6">Paket yoxdur</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {editing && (
        <form className="admin-edit-card" onSubmit={handleSave}>
          <h3>{items.some((item) => item.id === editing.id) ? 'Paketi redaktə et' : 'Yeni paket'}</h3>
          {saveError && <p className="muted">{saveError}</p>}
          <div className="admin-form-grid">
            <label>
              Ad
              <input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                maxLength={120}
                required
              />
            </label>
            <label>
              Kombinasiya
              <select
                value={editing.combo}
                onChange={(e) => setEditing({ ...editing, combo: e.target.value })}
              >
                {COMBO_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label>
              Faiz (%)
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={editing.percent}
                onChange={(e) => setEditing({ ...editing, percent: e.target.value })}
              />
            </label>
            <label>
              Məbləğ (₼)
              <input
                type="number"
                min="0"
                step="0.01"
                value={editing.amount}
                onChange={(e) => setEditing({ ...editing, amount: e.target.value })}
              />
            </label>
            <label>
              Başlanğıc
              <input
                type="datetime-local"
                value={editing.startsAt}
                onChange={(e) => setEditing({ ...editing, startsAt: e.target.value })}
              />
            </label>
            <label>
              Bitmə
              <input
                type="datetime-local"
                value={editing.endsAt}
                onChange={(e) => setEditing({ ...editing, endsAt: e.target.value })}
              />
            </label>
            <label>
              Status
              <select
                value={editing.isActive ? '1' : '0'}
                onChange={(e) => setEditing({ ...editing, isActive: e.target.value === '1' })}
              >
                <option value="1">Aktiv</option>
                <option value="0">Deaktiv</option>
              </select>
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="btn-admin-primary" disabled={saving}>
              {saving ? 'Yadda saxlanır...' : 'Yadda saxla'}
            </button>
            <button type="button" onClick={() => setEditing(null)}>Ləğv et</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminDiscounts;
