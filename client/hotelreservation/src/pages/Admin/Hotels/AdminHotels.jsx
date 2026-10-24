import React, { useEffect, useMemo, useState } from 'react';
import { createRoom, deleteRoom, getHotels, updateRoom } from '../../../api/client';
import './AdminHotels.css';

const emptyRoom = (hotelId) => ({
  name: 'Yeni otaq',
  description: '',
  capacity: 2,
  bedType: '1 King yataq',
  size: '30 m²',
  amenities: ['Wi-Fi'],
  images: [],
  imageFile: '',
  pricePerNight: 200,
  available: true,
  hotelId,
});

const toRoomRequest = (hotelId, room) => ({
  hotelId,
  name: room.name,
  description: room.description || '',
  capacity: Number(room.capacity) || 1,
  bedType: room.bedType || '',
  size: room.size || '',
  pricePerNight: Number(room.pricePerNight) || 0,
  available: room.available !== false,
  imageFile: room.imageFile || room.images?.[0] || '',
  amenities: room.amenities || [],
});

const AdminHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');

  const loadHotels = () => {
    setLoading(true);
    return getHotels()
      .then((items) => {
        setHotels(items);
        setLoadError('');
        setSelectedHotelId((current) => {
          if (items.some((item) => String(item.id) === String(current))) return current;
          return items[0]?.id || '';
        });
      })
      .catch((error) => {
        setHotels([]);
        setLoadError(error.message || 'Otellər yüklənmədi.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const hotel = useMemo(
    () => hotels.find((item) => item.id === Number(selectedHotelId)),
    [hotels, selectedHotelId]
  );

  const handleSave = (event) => {
    event.preventDefault();
    if (!editing) return;
    const hotelId = Number(editing.hotelId);
    if (!hotelId) {
      setSaveError('Otel seçin.');
      return;
    }
    const payload = toRoomRequest(hotelId, editing);
    const isExisting = hotels.some((item) => (item.rooms || []).some((room) => room.id === editing.id));
    const action = isExisting ? updateRoom(editing.id, payload) : createRoom(payload);
    action
      .then(() => {
        setEditing(null);
        setSaveError('');
        setSelectedHotelId(hotelId);
        return loadHotels();
      })
      .catch((error) => {
        setSaveError(error.message || 'Otaq yadda saxlanılmadı.');
      });
  };

  const handleDelete = (roomId) => {
    if (!hotel || !window.confirm('Otağı silmək istəyirsiniz?')) return;
    deleteRoom(roomId)
      .then(() => loadHotels())
      .catch((error) => {
        setLoadError(error.message || 'Otaq silinmədi.');
      });
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Otaq inventarı</h1>
        <p className="page-subtitle">Otaq tipi, qiymət, tutum, şəkil və imkanları idarə edin</p>
      </div>

      {loading && <p className="page-subtitle">Yüklənir...</p>}
      {loadError && (
        <div className="coming-soon-card">
          <h2>Məlumat yüklənmədi</h2>
          <p>{loadError}</p>
        </div>
      )}

      {!loading && !loadError && (
        <>
          <div className="inventory-toolbar">
            <select
              value={selectedHotelId}
              onChange={(e) => setSelectedHotelId(Number(e.target.value))}
            >
              {hotels.map((item) => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
            <button
              className="btn-admin-primary"
              onClick={() => setEditing({
                ...emptyRoom(hotel?.id),
                images: hotel?.images?.slice(0, 2) || (hotel?.mainImage ? [hotel.mainImage] : []),
              })}
              disabled={!hotel}
            >
              + Otaq əlavə et
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Otaq</th>
                  <th>Tutum</th>
                  <th>Qiymət</th>
                  <th>İmkanlar</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {hotel?.rooms.map((room) => (
                  <tr key={room.id}>
                    <td>
                      <strong>{room.name}</strong>
                      <div className="muted">{room.size} · {room.bedType}</div>
                    </td>
                    <td>{room.capacity} nəfər</td>
                    <td>₼{room.pricePerNight}</td>
                    <td>{(room.amenities || []).slice(0, 3).join(', ')}</td>
                    <td>{room.available === false ? 'Bağlı' : 'Açıq'}</td>
                    <td className="table-actions">
                      <button onClick={() => setEditing({ ...room, hotelId: room.hotelId || hotel?.id })}>Redaktə</button>
                      <button className="danger" onClick={() => handleDelete(room.id)}>Sil</button>
                    </td>
                  </tr>
                ))}
                {(!hotel || hotel.rooms.length === 0) && (
                  <tr>
                    <td colSpan="6">Otaq yoxdur</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {editing && (
        <form className="admin-edit-card" onSubmit={handleSave}>
          <h3>{hotels.some((item) => (item.rooms || []).some((room) => room.id === editing.id)) ? 'Otağı redaktə et' : 'Yeni otaq'}</h3>
          {saveError && <p className="muted">{saveError}</p>}
          <div className="admin-form-grid">
            <label>
              Otel
              <select
                value={editing.hotelId || ''}
                onChange={(e) => setEditing({ ...editing, hotelId: Number(e.target.value) })}
                required
              >
                <option value="" disabled>Otel seçin</option>
                {hotels.map((item) => (
                  <option key={item.id} value={item.id}>{item.title}</option>
                ))}
              </select>
            </label>
            <label>
              Ad
              <input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                required
              />
            </label>
            <label>
              Gecəlik qiymət
              <input
                type="number"
                min="1"
                value={editing.pricePerNight}
                onChange={(e) => setEditing({ ...editing, pricePerNight: Number(e.target.value) })}
                required
              />
            </label>
            <label>
              Tutum
              <input
                type="number"
                min="1"
                value={editing.capacity}
                onChange={(e) => setEditing({ ...editing, capacity: Number(e.target.value) })}
              />
            </label>
            <label>
              Ölçü
              <input
                value={editing.size}
                onChange={(e) => setEditing({ ...editing, size: e.target.value })}
              />
            </label>
            <label className="full">
              Təsvir
              <input
                value={editing.description || ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
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
            <label className="full">
              Şəkil URL
              <input
                value={editing.images?.[0] || editing.imageFile || ''}
                onChange={(e) => setEditing({
                  ...editing,
                  imageFile: e.target.value,
                  images: e.target.value ? [e.target.value, ...(editing.images || []).slice(1)] : [],
                })}
              />
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={editing.available !== false}
                onChange={(e) => setEditing({ ...editing, available: e.target.checked })}
              />
              Satışa açıqdır
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="btn-admin-primary">Yadda saxla</button>
            <button type="button" onClick={() => setEditing(null)}>Bağla</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminHotels;
