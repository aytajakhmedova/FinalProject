import React, { useEffect, useState } from 'react';
import { createRoom, deleteRoom, getHotels, getRooms, updateRoom } from '../../api/client';
import './Hotels/AdminHotels.css';

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

const toRoomRequest = (room) => ({
  hotelId: Number(room.hotelId),
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

const AdminRooms = () => {
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');

  const loadData = () => {
    setLoading(true);
    return Promise.all([getHotels(), getRooms()])
      .then(([hotelItems, roomItems]) => {
        setHotels(hotelItems);
        setRooms(roomItems);
        setLoadError('');
      })
      .catch((error) => {
        setHotels([]);
        setRooms([]);
        setLoadError(error.message || 'Otaqlar yüklənmədi.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const hotelName = (hotelId) => hotels.find((hotel) => hotel.id === Number(hotelId))?.title || `Otel #${hotelId}`;

  const handleSave = (event) => {
    event.preventDefault();
    if (!editing) return;
    const payload = toRoomRequest(editing);
    const isExisting = rooms.some((room) => room.id === editing.id);
    const action = isExisting ? updateRoom(editing.id, payload) : createRoom(payload);
    action
      .then(() => {
        setEditing(null);
        setSaveError('');
        return loadData();
      })
      .catch((error) => {
        setSaveError(error.message || 'Otaq yadda saxlanılmadı.');
      });
  };

  const handleDelete = (roomId) => {
    if (!window.confirm('Otağı silmək istəyirsiniz?')) return;
    deleteRoom(roomId)
      .then(() => loadData())
      .catch((error) => {
        setLoadError(error.message || 'Otaq silinmədi.');
      });
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Otaq İdarəetməsi</h1>
        <p className="page-subtitle">Otaq tipi, qiymət, tutum və statusu idarə edin</p>
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
            <button
              className="btn-admin-primary"
              onClick={() => setEditing(emptyRoom(hotels[0]?.id))}
              disabled={hotels.length === 0}
            >
              + Otaq əlavə et
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Otaq</th>
                  <th>Otel</th>
                  <th>Tutum</th>
                  <th>Qiymət</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td>
                      <strong>{room.name}</strong>
                      <div className="muted">{room.size} · {room.bedType}</div>
                    </td>
                    <td>{room.hotelName || hotelName(room.hotelId)}</td>
                    <td>{room.capacity} nəfər</td>
                    <td>₼{room.pricePerNight}</td>
                    <td>{room.available === false ? 'Bağlı' : 'Açıq'}</td>
                    <td className="table-actions">
                      <button onClick={() => setEditing({ ...room })}>Redaktə</button>
                      <button className="danger" onClick={() => handleDelete(room.id)}>Sil</button>
                    </td>
                  </tr>
                ))}
                {rooms.length === 0 && (
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
          <h3>{rooms.some((room) => room.id === editing.id) ? 'Otağı redaktə et' : 'Yeni otaq'}</h3>
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
                {hotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>{hotel.title}</option>
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

export default AdminRooms;
