import Select from '../../../components/common/Select/Select';
import { FaRegTrashAlt } from 'react-icons/fa';
import { Fragment } from 'react';
import React, { useEffect, useMemo, useState } from 'react';
import { createTour, deleteTour, getHotels, getTourCategoryList, listTours, updateTour, uploadMedia } from '../../../api/client';
import { newestFirst } from '../../../utils/newestFirst';
import '../Hotels/AdminHotels.css';

// The fixed difficulty levels; the server accepts only these.
const DIFFICULTIES = ['Asan', 'Orta', 'Çətin'];

const splitList = (value) => (Array.isArray(value)
  ? value
  : String(value || '').split(',').map((item) => item.trim()).filter(Boolean));

const joinList = (value) => (Array.isArray(value) ? value.join(', ') : (value || ''));

const parseItinerary = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => ({
      day: Number(item.day) || 1,
      title: item.title || '',
      activities: item.activities || [],
    }));
  }
  return String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [day, title, activities] = line.split('|').map((part) => (part || '').trim());
      return {
        day: Number(day) || 1,
        title: title || '',
        activities: (activities || '').split(';').map((item) => item.trim()).filter(Boolean),
      };
    });
};

const formatItinerary = (value) => {
  if (typeof value === 'string') return value;
  return (value || [])
    .map((item) => `${item.day || 1}|${item.title || ''}|${(item.activities || []).join('; ')}`)
    .join('\n');
};

const emptyTour = () => ({
  name: '',
  destination: '',
  hotelId: '',
  rating: 0,
  reviewCount: 0,
  duration: '',
  price: 0,
  imageFile: '',
  description: '',
  category: '',
  difficulty: '',
  maxGuests: 10,
  minGuests: 1,
  highlightsText: '',
  includedText: '',
  excludedText: '',
  itineraryText: '',
  availableDatesText: '',
});

const toTourRequest = (tour) => ({
  name: (tour.name || '').trim(),
  destination: (tour.destination || '').trim(),
  hotelId: Number(tour.hotelId) || null,
  rating: Number(tour.rating) || 0,
  reviewCount: Number(tour.reviewCount) || 0,
  duration: (tour.duration || '').trim(),
  price: Number(tour.price) || 0,
  imageFile: (tour.imageFile || '').trim(),
  description: (tour.description || '').trim(),
  category: (tour.category || '').trim(),
  difficulty: (tour.difficulty || '').trim(),
  maxGuests: Number(tour.maxGuests) || 1,
  minGuests: Number(tour.minGuests) || 1,
  highlights: splitList(tour.highlightsText),
  included: splitList(tour.includedText),
  excluded: splitList(tour.excludedText),
  itinerary: parseItinerary(tour.itineraryText),
  availableDates: splitList(tour.availableDatesText),
});

const toEditTour = (tour) => ({
  ...emptyTour(),
  ...tour,
  highlightsText: joinList(tour.highlights),
  includedText: joinList(tour.included),
  excludedText: joinList(tour.excluded),
  itineraryText: formatItinerary(tour.itinerary),
  availableDatesText: joinList(tour.availableDates),
});

const AdminTours = () => {
  const [tours, setTours] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [hotels, setHotels] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const loadTours = (silent = false) => {
    if (!silent) setLoading(true);
    return listTours()
      .then((items) => {
        setTours(newestFirst(items));
        setLoadError('');
      })
      .catch((error) => {
        setTours([]);
        setLoadError(error.message || 'Turlar yüklənmədi.');
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  };

  useEffect(() => {
    loadTours();
    getHotels().then(setHotels).catch(() => setHotels([]));
    getTourCategoryList().then(setCategoryList).catch(() => setCategoryList([]));
  }, []);

  const handleAddDate = () => {
    if (!dateInput.trim()) return;
    const currentDates = splitList(editing.availableDatesText);
    if (currentDates.includes(dateInput.trim())) {
      setSaveError('Bu tarix artıq əlavə edilib.');
      return;
    }
    const newDates = [...currentDates, dateInput.trim()].sort();
    setEditing({ ...editing, availableDatesText: newDates.join(', ') });
    setDateInput('');
    setSaveError('');
  };

  const handleRemoveDate = (dateToRemove) => {
    const currentDates = splitList(editing.availableDatesText);
    const newDates = currentDates.filter(d => d !== dateToRemove);
    setEditing({ ...editing, availableDatesText: newDates.join(', ') });
  };

  const categories = useMemo(() => (
    categoryList.map((category) => category.name)
  ), [categoryList]);

  const difficulties = DIFFICULTIES;

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tours.filter((tour) => {
      if (categoryFilter !== 'all' && tour.category !== categoryFilter) return false;
      if (difficultyFilter !== 'all' && tour.difficulty !== difficultyFilter) return false;
      if (!query) return true;
      const haystack = [
        tour.name,
        tour.destination,
        tour.hotelName,
        tour.category,
        tour.difficulty,
        tour.duration,
        tour.description,
        ...(tour.availableDates || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [tours, search, categoryFilter, difficultyFilter]);

  const handleSave = (event) => {
    event.preventDefault();
    if (!editing || saving) return;
    const payload = toTourRequest(editing);
    const isExisting = tours.some((tour) => tour.id === editing.id);
    setSaving(true);
    setSaveError('');
    setSuccessMessage('');
    const action = isExisting ? updateTour(editing.id, payload) : createTour(payload);
    action
      .then(() => {
        setEditing(null);
        setSuccessMessage(isExisting ? 'Tur yeniləndi.' : 'Tur əlavə olundu.');
        return loadTours(true);
      })
      .catch((error) => {
        setSaveError(error.message || 'Tur yadda saxlanılmadı.');
      })
      .finally(() => setSaving(false));
  };

  const handleDelete = (tour) => {
    if (!window.confirm('Bu turu silmək istəyirsiniz? Əlaqəli rezervasiya varsa əməliyyat dayandırılacaq.')) return;
    setDeletingId(tour.id);
    setSaveError('');
    setSuccessMessage('');
    deleteTour(tour.id)
      .then(() => {
        if (editing?.id === tour.id) setEditing(null);
        setSuccessMessage('Tur silindi.');
        return loadTours(true);
      })
      .catch((error) => {
        setSaveError(error.message || 'Tur silinmədi.');
      })
      .finally(() => setDeletingId(null));
  };

  const editForm = editing && (
        <form className="admin-edit-card" onSubmit={handleSave}>
          <h3>{tours.some((tour) => tour.id === editing.id) ? 'Turu redaktə et' : 'Yeni tur'}</h3>
          {saveError && <p className="muted">{saveError}</p>}
          <div className="admin-form-grid">
            <label>
              Tur adı
              <input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                maxLength={200}
                required
              />
            </label>
            <label>
              Otel
              <Select
                value={editing.hotelId ? String(editing.hotelId) : ''}
                onChange={(e) => setEditing({ ...editing, hotelId: e.target.value })}
                required
              >
                <option value="">Otel seçin</option>
                {hotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>{hotel.title || hotel.name} — {hotel.city}</option>
                ))}
              </Select>
            </label>
            <label>
              Qiymət
              <input
                type="number"
                min="0"
                step="0.01"
                value={editing.price}
                onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                required
              />
            </label>
            <label>
              Müddət
              <input
                value={editing.duration}
                onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
                maxLength={50}
                placeholder="məs. 1 gün"
              />
            </label>
            <label>
              Kateqoriya
              <Select
                value={editing.category || ''}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                required
              >
                <option value="">{categoryList.length ? 'Kateqoriya seçin' : 'Əvvəlcə Tur kateqoriyaları bölməsində əlavə edin'}</option>
                {categoryList.map((category) => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </Select>
            </label>
            <label>
              Çətinlik
              <Select
                value={editing.difficulty || ''}
                onChange={(e) => setEditing({ ...editing, difficulty: e.target.value })}
                required
              >
                <option value="">Çətinlik seçin</option>
                {DIFFICULTIES.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </Select>
            </label>
            <label>
              Min qonaq
              <input
                type="number"
                min="1"
                value={editing.minGuests}
                onChange={(e) => setEditing({ ...editing, minGuests: e.target.value })}
                required
              />
            </label>
            <label>
              Max qonaq
              <input
                type="number"
                min="1"
                value={editing.maxGuests}
                onChange={(e) => setEditing({ ...editing, maxGuests: e.target.value })}
                required
              />
            </label>
            <label>
              Reytinq
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={editing.rating}
                onChange={(e) => setEditing({ ...editing, rating: e.target.value })}
              />
            </label>
            <label>
              Rəy sayı
              <input
                type="number"
                min="0"
                value={editing.reviewCount}
                onChange={(e) => setEditing({ ...editing, reviewCount: e.target.value })}
              />
            </label>
            <label className="full">
              Mövcud tarixlər (yyyy-mm-dd)
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button
                  type="button"
                  onClick={handleAddDate}
                  className="btn-admin-primary"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  + Əlavə et
                </button>
              </div>
              {splitList(editing.availableDatesText).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                  {splitList(editing.availableDatesText).map((date) => (
                    <div
                      key={date}
                      style={{
                        padding: '6px 12px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      <span>📅 {date}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDate(date)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.3)',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '18px',
                          padding: '0 4px',
                          lineHeight: '1',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.5)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                        title="Sil"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
              Təsvir
              <textarea
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                maxLength={4000}
                rows={3}
              />
            </label>
            <label className="full">
              Önə çıxanlar (vergüllə)
              <input
                value={editing.highlightsText}
                onChange={(e) => setEditing({ ...editing, highlightsText: e.target.value })}
              />
            </label>
            <label className="full">
              Daxildir (vergüllə)
              <input
                value={editing.includedText}
                onChange={(e) => setEditing({ ...editing, includedText: e.target.value })}
              />
            </label>
            <label className="full">
              Daxil deyil (vergüllə)
              <input
                value={editing.excludedText}
                onChange={(e) => setEditing({ ...editing, excludedText: e.target.value })}
              />
            </label>
            <label className="full">
              Marşrut (hər sətirdə: gün|başlıq|fəaliyyət1; fəaliyyət2)
              <textarea
                value={editing.itineraryText}
                onChange={(e) => setEditing({ ...editing, itineraryText: e.target.value })}
                rows={3}
                placeholder="1|Şəhər gəzintisi|İçərişəhər; Qız Qalası"
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
      <div className="page-header">
        <h1 className="page-title">Turlar</h1>
        <p className="page-subtitle">Tur adı, istiqamət, qiymət, tarix və yer limitlərini idarə edin</p>
      </div>

      {loading && <p className="page-subtitle">Yüklənir...</p>}
      {loadError && (
        <div className="coming-soon-card">
          <h2>Məlumat yüklənmədi</h2>
          <p>{loadError}</p>
          <div className="admin-form-actions">
            <button type="button" className="btn-admin-primary" onClick={() => loadTours()}>
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
              onClick={() => { setSaveError(''); setSuccessMessage(''); setEditing(emptyTour()); }}
            >
              + Tur əlavə et
            </button>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ad, istiqamət və ya tarix axtar"
            />
            <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">Bütün kateqoriyalar</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
            <Select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
              <option value="all">Bütün çətinliklər</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </Select>
          </div>

          {successMessage && !editing && <p className="page-subtitle">{successMessage}</p>}
          {saveError && !editing && <p className="muted">{saveError}</p>}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tur adı</th>
                  <th>Otel</th>
                  <th>İstiqamət</th>
                  <th>Qiymət</th>
                  <th>Tarix</th>
                  <th>Digər</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {editing && !editing.id && (
                  <tr className="edit-row">
                    <td colSpan="7">{editForm}</td>
                  </tr>
                )}
                {visible.map((tour) => (
                  <Fragment key={tour.id}>
                  <tr>
                    <td>
                      <strong>{tour.name}</strong>
                      <div className="muted">{tour.category || 'Kateqoriya yoxdur'}</div>
                    </td>
                    <td>{tour.hotelName || '—'}</td>
                    <td>{tour.destination || '—'}</td>
                    <td>₼{Number(tour.price || 0).toLocaleString('az-AZ', { maximumFractionDigits: 0 })}</td>
                    <td>
                      {(tour.availableDates || []).length
                        ? (tour.availableDates || []).join(', ')
                        : '—'}
                    </td>
                    <td>
                      {tour.duration || '—'}
                      <div className="muted">
                        {tour.difficulty || '—'} · {tour.minGuests}-{tour.maxGuests} nəfər
                      </div>
                    </td>
                    <td className="table-actions">
                      <button onClick={() => { setSaveError(''); setSuccessMessage(''); setEditing(toEditTour(tour)); }}>
                        Redaktə
                      </button>
                      <button className="danger" onClick={() => handleDelete(tour)} disabled={deletingId === tour.id}>
                        {deletingId === tour.id ? 'Silinir...' : <FaRegTrashAlt aria-label="Sil" />}
                      </button>
                    </td>
                  </tr>
                  {editing?.id === tour.id && (
                    <tr className="edit-row">
                      <td colSpan="7">{editForm}</td>
                    </tr>
                  )}
                  </Fragment>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan="7">{tours.length === 0 ? 'Tur yoxdur' : 'Uyğun tur tapılmadı'}</td>
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

export default AdminTours;
