import { FaRegTrashAlt } from 'react-icons/fa';
import { Fragment } from 'react';
import React, { useEffect, useState } from 'react';
import { createHotel, deleteHotel, getHotels, getLocationCities, getLocationCountries, getLocationTouristPlaces, updateHotel, uploadMedia } from '../../../api/client';
import { hasRole } from '../../../api/auth';
import './AdminHotels.css';

const emptyHotel = () => ({
  title: '',
  countryId: '',
  cityId: '',
  touristPlaceId: '',
  address: '',
  stars: 4,
  description: '',
  pricePerNight: 200,
  hotelType: '',
  checkInTime: '14:00',
  checkOutTime: '12:00',
  cancellationPolicy: 'Check-in tarixindən əvvəl ləğv etmək olar.',
  imageFile: '',
  amenities: [],
});

const toHotelRequest = (hotel) => ({
  title: hotel.title.trim(),
  countryId: Number(hotel.countryId) || null,
  cityId: Number(hotel.cityId) || null,
  touristPlaceId: Number(hotel.touristPlaceId) || null,
  address: (hotel.address || '').trim(),
  stars: Number(hotel.stars) || 1,
  description: hotel.description || '',
  pricePerNight: Number(hotel.pricePerNight) || 0,
  hotelType: hotel.hotelType || '',
  checkInTime: hotel.checkInTime || '14:00',
  checkOutTime: hotel.checkOutTime || '12:00',
  cancellationPolicy: hotel.cancellationPolicy || 'Check-in tarixindən əvvəl ləğv etmək olar.',
  imageFile: hotel.imageFile || '',
  amenities: hotel.amenities || [],
});

const AdminHotelManager = () => {
  // A hotel manager only edits the hotel assigned to them: no new hotels, no deleting.
  const isManager = hasRole('HotelManager') && !hasRole('SuperAdmin', 'Admin');
  const [hotels, setHotels] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Dropdown data
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingPlaces, setLoadingPlaces] = useState(false);

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
    getLocationCountries()
      .then(setCountries)
      .catch(() => setCountries([]));
  }, []);

  const loadCities = (countryId) => {
    setCities([]);
    if (!countryId) return Promise.resolve();
    setLoadingCities(true);
    return getLocationCities(countryId)
      .then(setCities)
      .catch(() => setCities([]))
      .finally(() => setLoadingCities(false));
  };

  const loadPlaces = (cityId) => {
    setPlaces([]);
    if (!cityId) return Promise.resolve();
    setLoadingPlaces(true);
    return getLocationTouristPlaces(cityId)
      .then(setPlaces)
      .catch(() => setPlaces([]))
      .finally(() => setLoadingPlaces(false));
  };

  // Changing the country clears the city and place; changing the city clears the place.
  const handleCountryChange = (countryId) => {
    setEditing({ ...editing, countryId, cityId: '', touristPlaceId: '' });
    setPlaces([]);
    loadCities(countryId);
  };

  const handleCityChange = (cityId) => {
    setEditing({ ...editing, cityId, touristPlaceId: '' });
    loadPlaces(cityId);
  };

  const handleEditHotel = (hotel) => {
    setSaveError('');
    setSuccessMessage('');
    setEditing({
      ...hotel,
      countryId: hotel.countryId ? String(hotel.countryId) : '',
      cityId: hotel.cityId ? String(hotel.cityId) : '',
      touristPlaceId: hotel.touristPlaceId ? String(hotel.touristPlaceId) : '',
      amenities: hotel.amenities || [],
    });
    loadCities(hotel.countryId);
    loadPlaces(hotel.cityId);
  };

  const handleNewHotel = () => {
    setSaveError('');
    setSuccessMessage('');
    setEditing(emptyHotel());
    setCities([]);
    setPlaces([]);
  };

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

  const editForm = editing && (
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
              Ölkə *
              <select
                value={editing.countryId}
                onChange={(e) => handleCountryChange(e.target.value)}
                required
              >
                <option value="">Ölkə seçin</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Şəhər *
              <select
                value={editing.cityId}
                onChange={(e) => handleCityChange(e.target.value)}
                required
                disabled={!editing.countryId || loadingCities}
              >
                <option value="">{loadingCities ? 'Yüklənir...' : 'Şəhər seçin'}</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Turistik məkan *
              <select
                value={editing.touristPlaceId}
                onChange={(e) => setEditing({ ...editing, touristPlaceId: e.target.value })}
                required
                disabled={!editing.cityId || loadingPlaces}
              >
                <option value="">{loadingPlaces ? 'Yüklənir...' : 'Məkan seçin'}</option>
                {places.map((place) => (
                  <option key={place.id} value={place.id}>
                    {place.name}
                  </option>
                ))}
              </select>
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
              Ləğv qaydası
              <textarea
                value={editing.cancellationPolicy || ''}
                onChange={(e) => setEditing({ ...editing, cancellationPolicy: e.target.value })}
                maxLength={1000}
                rows={2}
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
            <button type="button" onClick={() => { setEditing(null); setSaveError(''); }}>Ləğv et</button>
          </div>
        </form>
  );

  return (
    <div className="admin-page">
      <div className="page-header page-header-row">
        <div>
          <h1 className="page-title">{isManager ? 'Mənim otelim' : 'Otellər'}</h1>
          <p className="page-subtitle">
            {isManager ? 'Otelinizin məlumatını, ünvanını, təsvirini və şəklini redaktə edin' : 'Otel adı, ünvan, təsvir, qiymət və şəkli idarə edin'}
          </p>
        </div>
        {!loading && !loadError && !isManager && (
          <button className="btn-admin-primary" onClick={handleNewHotel}>
            + Otel əlavə et
          </button>
        )}
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
                {editing && !editing.id && (
                  <tr className="edit-row">
                    <td colSpan="5">{editForm}</td>
                  </tr>
                )}
                {hotels.map((hotel) => (
                  <Fragment key={hotel.id}>
                  <tr>
                    <td>
                      <div className="cell-media">
                        {hotel.mainImage && <img className="cell-thumb" src={hotel.mainImage} alt="" />}
                        <div>
                          <strong>{hotel.title}</strong>
                          <div className="muted">{hotel.city}{hotel.country ? `, ${hotel.country}` : ''} • {hotel.rooms?.length || 0} otaq</div>
                        </div>
                      </div>
                    </td>
                    <td>{hotel.address || hotel.location || '—'}</td>
                    <td>₼{hotel.pricePerNight}</td>
                    <td>
                      <span className="star-rating">
                        {'★'.repeat(Number(hotel.stars) || 0)}{'☆'.repeat(Math.max(0, 5 - (Number(hotel.stars) || 0)))}
                      </span>{' '}
                      {hotel.stars}
                    </td>
                    <td className="table-actions">
                      <button onClick={() => handleEditHotel(hotel)}>
                        Redaktə
                      </button>
                      {!isManager && (
                        <button className="danger" onClick={() => handleDelete(hotel)} disabled={deletingId === hotel.id}>
                          {deletingId === hotel.id ? 'Silinir...' : <FaRegTrashAlt aria-label="Sil" />}
                        </button>
                      )}
                    </td>
                  </tr>
                  {editing?.id === hotel.id && (
                    <tr className="edit-row">
                      <td colSpan="5">{editForm}</td>
                    </tr>
                  )}
                  </Fragment>
                ))}
                {hotels.length === 0 && (
                  <tr>
                    <td colSpan="5">{isManager ? 'Sizə təyin edilmiş otel tapılmadı' : 'Otel yoxdur'}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  );
};

export default AdminHotelManager;
