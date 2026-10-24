import React, { useEffect, useState } from 'react';
import { createHotel, deleteHotel, getHotels, updateHotel, uploadMedia } from '../../../api/client';
import './AdminHotels.css';

const emptyHotel = () => ({
  title: '',
  city: '',
  country: '',
  location: '',
  address: '',
  stars: 4,
  description: '',
  pricePerNight: 200,
  hotelType: '',
  checkInTime: '14:00',
  checkOutTime: '12:00',
  imageFile: '',
  amenities: [],
});

const toHotelRequest = (hotel) => ({
  title: hotel.title.trim(),
  city: hotel.city.trim(),
  country: hotel.country.trim(),
  location: (hotel.location || '').trim(),
  address: (hotel.address || '').trim(),
  stars: Number(hotel.stars) || 1,
  description: hotel.description || '',
  pricePerNight: Number(hotel.pricePerNight) || 0,
  hotelType: hotel.hotelType || '',
  checkInTime: hotel.checkInTime || '14:00',
  checkOutTime: hotel.checkOutTime || '12:00',
  imageFile: hotel.imageFile || '',
  amenities: hotel.amenities || [],
});

const AdminHotelManager = () => {
  const [hotels, setHotels] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadHotels = (silent = false) => {
    if (!silent) setLoading(true);
    return getHotels()
      .then((items) => {
        setHotels(items);
        setLoadError('');
      })
      .catch((error) => {
        setHotels([]);
        setLoadError(error.message || 'Otellər yüklənmədi.');
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const handleSave = (event) => {
    event.preventDefault();
    if (!editing || saving) return;
    const payload = toHotelRequest(editing);
    const isExisting = hotels.some((hotel) => hotel.id === editing.id);
    setSaving(true);
    setSaveError('');
    setSuccessMessage('');
    const action = isExisting ? updateHotel(editing.id, payload) : createHotel(payload);
    action
      .then(() => {
        setEditing(null);
        setSuccessMessage(isExisting ? 'Otel yeniləndi.' : 'Otel əlavə olundu.');
        return loadHotels(true);
      })
      .catch((error) => {
        setSaveError(error.message || 'Otel yadda saxlanılmadı.');
      })
      .finally(() => setSaving(false));
  };

  const handleDelete = (hotel) => {
    const roomCount = hotel.rooms?.length || 0;
    const message = roomCount
      ? `Bu otelin ${roomCount} otağı var. Otaq, rezervasiya və ya booking bağlıdırsa silinməyəcək. Yenə də silmək istəyirsiniz?`
      : 'Bu oteli silmək istəyirsiniz? Rezervasiya və ya booking varsa əməliyyat dayandırılacaq.';
    if (!window.confirm(message)) return;
    setDeletingId(hotel.id);
    setSaveError('');
    setSuccessMessage('');
    deleteHotel(hotel.id)
      .then(() => {
        if (editing?.id === hotel.id) setEditing(null);
        setSuccessMessage('Otel silindi.');
        return loadHotels(true);
      })
      .catch((error) => {
        setSaveError(error.message || 'Otel silinmədi.');
      })
      .finally(() => setDeletingId(null));
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Otellər</h1>
        <p className="page-subtitle">Otel adı, ünvan, təsvir, qiymət və şəkli idarə edin</p>
      </div>

      {loading && <p className="page-subtitle">Yüklənir...</p>}
      {loadError && (
        <div className="coming-soon-card">
          <h2>Məlumat yüklənmədi</h2>
          <p>{loadError}</p>
          <div className="admin-form-actions">
            <button type="button" className="btn-admin-primary" onClick={() => loadHotels()}>
              Yenidən yoxla
            </button>
          </div>
        </div>
      )}

      {!loading && !loadError && (
        <>
          <div className="inventory-toolbar">
            <button className="btn-admin-primary" onClick={() => { setSaveError(''); setSuccessMessage(''); setEditing(emptyHotel()); }}>
              + Otel əlavə et
            </button>
          </div>

          {successMessage && !editing && <p className="page-subtitle">{successMessage}</p>}
          {saveError && !editing && <p className="muted">{saveError}</p>}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Otel</th>
                  <th>Ünvan</th>
                  <th>Qiymət</th>
                  <th>Ulduz</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((hotel) => (
                  <tr key={hotel.id}>
                    <td>
                      <strong>{hotel.title}</strong>
                      <div className="muted">{hotel.city}{hotel.country ? `, ${hotel.country}` : ''}</div>
                      <div className="muted">{hotel.rooms?.length || 0} otaq</div>
                    </td>
                    <td>{hotel.address || hotel.location || '—'}</td>
                    <td>₼{hotel.pricePerNight}</td>
                    <td>{hotel.stars}</td>
                    <td className="table-actions">
                      <button onClick={() => { setSaveError(''); setSuccessMessage(''); setEditing({ ...hotel, amenities: hotel.amenities || [] }); }}>
                        Redaktə
                      </button>
                      <button className="danger" onClick={() => handleDelete(hotel)} disabled={deletingId === hotel.id}>
                        {deletingId === hotel.id ? 'Silinir...' : 'Sil'}
                      </button>
                    </td>
                  </tr>
                ))}
                {hotels.length === 0 && (
                  <tr>
                    <td colSpan="5">Otel yoxdur</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {editing && (
        <form className="admin-edit-card" onSubmit={handleSave}>
          <h3>{hotels.some((hotel) => hotel.id === editing.id) ? 'Oteli redaktə et' : 'Yeni otel'}</h3>
          {saveError && <p className="muted">{saveError}</p>}
          <div className="admin-form-grid">
            <label>
              Ad
              <input
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                maxLength={200}
                required
              />
            </label>
            <label>
              Gecəlik qiymət
              <input
                type="number"
                min="0"
                step="0.01"
                value={editing.pricePerNight}
                onChange={(e) => setEditing({ ...editing, pricePerNight: e.target.value })}
                required
              />
            </label>
            <label>
              Şəhər
              <input
                value={editing.city}
                onChange={(e) => setEditing({ ...editing, city: e.target.value })}
                maxLength={100}
                required
              />
            </label>
            <label>
              Ölkə
              <input
                value={editing.country}
                onChange={(e) => setEditing({ ...editing, country: e.target.value })}
                maxLength={100}
                required
              />
            </label>
            <label>
              Ünvan
              <input
                value={editing.address}
                onChange={(e) => setEditing({ ...editing, address: e.target.value })}
                maxLength={300}
              />
            </label>
            <label>
              Məkan
              <input
                value={editing.location}
                onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                maxLength={300}
              />
            </label>
            <label>
              Ulduz
              <select
                value={editing.stars}
                onChange={(e) => setEditing({ ...editing, stars: Number(e.target.value) })}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <option key={star} value={star}>{star}</option>
                ))}
              </select>
            </label>
            <label>
              Otel tipi
              <input
                value={editing.hotelType}
                onChange={(e) => setEditing({ ...editing, hotelType: e.target.value })}
                maxLength={100}
              />
            </label>
            <label>
              Giriş vaxtı
              <input
                value={editing.checkInTime}
                onChange={(e) => setEditing({ ...editing, checkInTime: e.target.value })}
                maxLength={10}
              />
            </label>
            <label>
              Çıxış vaxtı
              <input
                value={editing.checkOutTime}
                onChange={(e) => setEditing({ ...editing, checkOutTime: e.target.value })}
                maxLength={10}
              />
            </label>
            <label className="full">
              Təsvir
              <textarea
                value={editing.description || ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                maxLength={4000}
                rows={3}
              />
            </label>
            <label className="full">
              Şəkil
              <input
                value={editing.imageFile || ''}
                onChange={(e) => setEditing({ ...editing, imageFile: e.target.value })}
                maxLength={400}
                placeholder="Fayl adı və ya şəkil ünvanı"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  uploadMedia(file)
                    .then((data) => setEditing((prev) => ({ ...prev, imageFile: data.url })))
                    .catch((err) => setSaveError(err.message || 'Şəkil yüklənmədi.'));
                }}
              />
            </label>
            <label className="full">
              İmkanlar (vergüllə)
              <input
                value={(editing.amenities || []).join(', ')}
                onChange={(e) => setEditing({
                  ...editing,
                  amenities: e.target.value.split(',').map((item) => item.trim()).filter(Boolean),
                })}
              />
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="btn-admin-primary" disabled={saving}>
              {saving ? 'Yadda saxlanılır...' : 'Yadda saxla'}
            </button>
            <button type="button" onClick={() => { setEditing(null); setSaveError(''); }}>Bağla</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminHotelManager;
