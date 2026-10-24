import React, { useEffect, useMemo, useState } from 'react';
import { createTour, deleteTour, listTours, updateTour } from '../../../api/client';
import '../Hotels/AdminHotels.css';

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

  const loadTours = (silent = false) => {
    if (!silent) setLoading(true);
    return listTours()
      .then((items) => {
        setTours(Array.isArray(items) ? items : []);
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
  }, []);

  const categories = useMemo(() => (
    [...new Set(tours.map((tour) => tour.category).filter(Boolean))].sort()
  ), [tours]);

  const difficulties = useMemo(() => (
    [...new Set(tours.map((tour) => tour.difficulty).filter(Boolean))].sort()
  ), [tours]);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tours.filter((tour) => {
      if (categoryFilter !== 'all' && tour.category !== categoryFilter) return false;
      if (difficultyFilter !== 'all' && tour.difficulty !== difficultyFilter) return false;
      if (!query) return true;
      const haystack = [
        tour.name,
        tour.destination,
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
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">Bütün kateqoriyalar</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
              <option value="all">Bütün çətinliklər</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>

          {successMessage && !editing && <p className="page-subtitle">{successMessage}</p>}
          {saveError && !editing && <p className="muted">{saveError}</p>}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tur adı</th>
                  <th>İstiqamət</th>
                  <th>Qiymət</th>
                  <th>Tarix</th>
                  <th>Digər</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((tour) => (
                  <tr key={tour.id}>
                    <td>
                      <strong>{tour.name}</strong>
                      <div className="muted">{tour.category || 'Kateqoriya yoxdur'}</div>
                    </td>
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
                        {deletingId === tour.id ? 'Silinir...' : 'Sil'}
                      </button>
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan="6">{tours.length === 0 ? 'Tur yoxdur' : 'Uyğun tur tapılmadı'}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {editing && (
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
              İstiqamət
              <input
                value={editing.destination}
                onChange={(e) => setEditing({ ...editing, destination: e.target.value })}
                maxLength={200}
              />
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
              <input
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                maxLength={100}
              />
            </label>
            <label>
              Çətinlik
              <input
                value={editing.difficulty}
                onChange={(e) => setEditing({ ...editing, difficulty: e.target.value })}
                maxLength={50}
              />
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
              Mövcud tarixlər (vergüllə, yyyy-mm-dd)
              <input
                value={editing.availableDatesText}
                onChange={(e) => setEditing({ ...editing, availableDatesText: e.target.value })}
                placeholder="2026-11-01, 2026-11-15"
              />
            </label>
            <label className="full">
              Şəkil
              <input
                value={editing.imageFile}
                onChange={(e) => setEditing({ ...editing, imageFile: e.target.value })}
                maxLength={200}
                placeholder="Fayl adı və ya şəkil ünvanı"
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
            <button type="button" onClick={() => { setEditing(null); setSaveError(''); }}>Bağla</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminTours;
