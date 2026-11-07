import Select from '../../../components/common/Select/Select';
import { FaRegTrashAlt } from 'react-icons/fa';
import { Fragment } from 'react';
import React, { useEffect, useMemo, useState } from 'react';
import { createFlight, deleteFlight, getAirlines, getSiteCities, getSiteCountries, listFlights, updateFlight } from '../../../api/client';
import '../Hotels/AdminHotels.css';

const CABIN_LABELS = {
  economy: 'Ekonom',
  business: 'Biznes',
  first: 'Birinci',
};

const emptyFlight = () => ({
  airline: '',
  flightNumber: '',
  originCode: '',
  originCity: '',
  originCountry: '',
  destinationCode: '',
  destinationCity: '',
  destinationCountry: '',
  departureAt: '',
  arrivalAt: '',
  duration: '',
  stops: 0,
  // Every flight sells one or more classes, each with its own price and seats.
  cabins: [{ cabinClass: 'economy', price: 0, seatsAvailable: 0 }],
  refundable: false,
});

const toDateTimeLocal = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 16);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatDateTime = (value) => {
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

const stopLabel = (stops) => {
  const count = Number(stops) || 0;
  if (count <= 0) return 'Birbaşa';
  if (count === 1) return '1 dayanacaq';
  return `${count} dayanacaq`;
};

const toFlightRequest = (flight) => ({
  airline: (flight.airline || '').trim(),
  flightNumber: (flight.flightNumber || '').trim(),
  originCode: (flight.originCode || '').trim(),
  originCity: (flight.originCity || '').trim(),
  originCountry: (flight.originCountry || '').trim(),
  destinationCode: (flight.destinationCode || '').trim(),
  destinationCity: (flight.destinationCity || '').trim(),
  destinationCountry: (flight.destinationCountry || '').trim(),
  departureAt: flight.departureAt ? new Date(flight.departureAt).toISOString() : flight.departureAt,
  arrivalAt: flight.arrivalAt ? new Date(flight.arrivalAt).toISOString() : flight.arrivalAt,
  duration: (flight.duration || '').trim(),
  stops: Number(flight.stops) || 0,
  cabins: (flight.cabins || []).map((cabin) => ({
    cabinClass: cabin.cabinClass,
    price: Number(cabin.price) || 0,
    seatsAvailable: Number(cabin.seatsAvailable) || 0,
  })),
  refundable: Boolean(flight.refundable),
});

const toEditFlight = (flight) => ({
  ...emptyFlight(),
  ...flight,
  departureAt: toDateTimeLocal(flight.departureAt),
  arrivalAt: toDateTimeLocal(flight.arrivalAt),
  stops: Number(flight.stops) || 0,
  cabins: (flight.cabins && flight.cabins.length ? flight.cabins : emptyFlight().cabins).map((cabin) => ({ ...cabin })),
  refundable: Boolean(flight.refundable),
});

const AdminFlights = () => {
  const [flights, setFlights] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [cabinFilter, setCabinFilter] = useState('all');
  const [originFilter, setOriginFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Dropdown data
  const [countries, setCountries] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [originCities, setOriginCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);

  const loadFlights = (silent = false) => {
    if (!silent) setLoading(true);
    return listFlights()
      .then((items) => {
        setFlights(Array.isArray(items) ? items : []);
        setLoadError('');
      })
      .catch((error) => {
        setFlights([]);
        setLoadError(error.message || 'Uçuşlar yüklənmədi.');
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  };

  useEffect(() => {
    loadFlights();
    getAirlines()
      .then(setAirlines)
      .catch(() => setAirlines([]));
    // Load countries and cities
    getSiteCountries()
      .then(setCountries)
      .catch(() => setCountries([]));
    getSiteCities()
      .then(setAllCities)
      .catch(() => setAllCities([]));
  }, []);

  const origins = useMemo(() => {
    const unique = new Map();
    flights.forEach((flight) => {
      const code = (flight.originCode || '').toUpperCase();
      if (!code) return;
      unique.set(code, flight.originCity ? `${code} · ${flight.originCity}` : code);
    });
    return [...unique.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [flights]);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return flights.filter((flight) => {
      const classes = (flight.cabins || []).map((cabin) => cabin.cabinClass);
      if (cabinFilter !== 'all' && !classes.includes(cabinFilter)) return false;
      if (originFilter !== 'all' && String(flight.originCode || '').toUpperCase() !== originFilter) return false;
      if (!query) return true;
      const haystack = [
        flight.airline,
        flight.flightNumber,
        flight.originCode,
        flight.originCity,
        flight.originCountry,
        flight.destinationCode,
        flight.destinationCity,
        flight.destinationCountry,
        flight.duration,
        ...classes.map((name) => CABIN_LABELS[name]),
        ...classes,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [flights, search, cabinFilter, originFilter]);

  const handleOriginCountryChange = (country) => {
    setEditing({ ...editing, originCountry: country, originCity: '' });
    const citiesForCountry = allCities.filter(c => c.country === country);
    setOriginCities(citiesForCountry);
  };

  const handleDestinationCountryChange = (country) => {
    setEditing({ ...editing, destinationCountry: country, destinationCity: '' });
    const citiesForCountry = allCities.filter(c => c.country === country);
    setDestinationCities(citiesForCountry);
  };

  const handleEditFlight = (flight) => {
    setSaveError('');
    setSuccessMessage('');
    setEditing(toEditFlight(flight));
    
    // Load cities for origin country
    if (flight.originCountry) {
      const citiesForCountry = allCities.filter(c => c.country === flight.originCountry);
      setOriginCities(citiesForCountry);
    }
    
    // Load cities for destination country
    if (flight.destinationCountry) {
      const citiesForCountry = allCities.filter(c => c.country === flight.destinationCountry);
      setDestinationCities(citiesForCountry);
    }
  };

  const handleNewFlight = () => {
    setSaveError('');
    setSuccessMessage('');
    setEditing(emptyFlight());
    setOriginCities([]);
    setDestinationCities([]);
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (!editing || saving) return;
    const payload = toFlightRequest(editing);
    const isExisting = flights.some((flight) => flight.id === editing.id);
    setSaving(true);
    setSaveError('');
    setSuccessMessage('');
    const action = isExisting ? updateFlight(editing.id, payload) : createFlight(payload);
    action
      .then(() => {
        setEditing(null);
        setSuccessMessage(isExisting ? 'Uçuş yeniləndi.' : 'Uçuş əlavə olundu.');
        return loadFlights(true);
      })
      .catch((error) => {
        setSaveError(error.message || 'Uçuş yadda saxlanılmadı.');
      })
      .finally(() => setSaving(false));
  };

  const handleDelete = (flight) => {
    if (!window.confirm('Bu uçuşu silmək istəyirsiniz? Əlaqəli rezervasiya varsa əməliyyat dayandırılacaq.')) return;
    setDeletingId(flight.id);
    setSaveError('');
    setSuccessMessage('');
    deleteFlight(flight.id)
      .then(() => {
        if (editing?.id === flight.id) setEditing(null);
        setSuccessMessage('Uçuş silindi.');
        return loadFlights(true);
      })
      .catch((error) => {
        setSaveError(error.message || 'Uçuş silinmədi.');
      })
      .finally(() => setDeletingId(null));
  };

  const editForm = editing && (
        <form className="admin-edit-card" onSubmit={handleSave}>
          <h3>{flights.some((flight) => flight.id === editing.id) ? 'Uçuşu redaktə et' : 'Yeni uçuş'}</h3>
          {saveError && <p className="muted">{saveError}</p>}
          <div className="admin-form-grid">
            <label>
              Aviaşirkət
              <Select
                value={editing.airline}
                onChange={(e) => setEditing({ ...editing, airline: e.target.value })}
                required
              >
                <option value="">{airlines.length ? 'Aviaşirkət seçin' : 'Əvvəlcə Aviaşirkətlər bölməsində əlavə edin'}</option>
                {airlines.map((airline) => (
                  <option key={airline.id} value={airline.name}>{airline.name}</option>
                ))}
              </Select>
            </label>
            <label>
              Uçuş nömrəsi
              <input
                value={editing.flightNumber}
                onChange={(e) => setEditing({ ...editing, flightNumber: e.target.value })}
                maxLength={20}
                required
              />
            </label>
            <label>
              Haradan (kod)
              <input
                value={editing.originCode}
                onChange={(e) => setEditing({ ...editing, originCode: e.target.value })}
                maxLength={10}
                required
              />
            </label>
            <label>
              Haradan ölkə *
              <Select
                value={editing.originCountry}
                onChange={(e) => handleOriginCountryChange(e.target.value)}
                required
              >
                <option value="">Ölkə seçin</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </Select>
            </label>
            <label>
              Haradan şəhər *
              <Select
                value={editing.originCity}
                onChange={(e) => setEditing({ ...editing, originCity: e.target.value })}
                required
                disabled={!editing.originCountry}
              >
                <option value="">Şəhər seçin</option>
                {originCities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </Select>
            </label>
            <label>
              Haraya (kod)
              <input
                value={editing.destinationCode}
                onChange={(e) => setEditing({ ...editing, destinationCode: e.target.value })}
                maxLength={10}
                required
              />
            </label>
            <label>
              Haraya ölkə *
              <Select
                value={editing.destinationCountry}
                onChange={(e) => handleDestinationCountryChange(e.target.value)}
                required
              >
                <option value="">Ölkə seçin</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </Select>
            </label>
            <label>
              Haraya şəhər *
              <Select
                value={editing.destinationCity}
                onChange={(e) => setEditing({ ...editing, destinationCity: e.target.value })}
                required
                disabled={!editing.destinationCountry}
              >
                <option value="">Şəhər seçin</option>
                {destinationCities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </Select>
            </label>
            <label>
              Gediş
              <input
                type="datetime-local"
                value={editing.departureAt}
                onChange={(e) => setEditing({ ...editing, departureAt: e.target.value })}
                required
              />
            </label>
            <label>
              Çatış
              <input
                type="datetime-local"
                value={editing.arrivalAt}
                onChange={(e) => setEditing({ ...editing, arrivalAt: e.target.value })}
                required
              />
            </label>
            <label>
              Müddət
              <input
                value={editing.duration}
                onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
                maxLength={50}
                placeholder="məs. 4s 20d"
              />
            </label>
            <label>
              Dayanacaq
              <Select
                value={String(Number(editing.stops) || 0)}
                onChange={(e) => setEditing({ ...editing, stops: Number(e.target.value) })}
              >
                {[...new Set([0, 1, 2, 3, Number(editing.stops) || 0])].sort((a, b) => a - b).map((count) => (
                  <option key={count} value={count}>{stopLabel(count)}</option>
                ))}
              </Select>
            </label>
            <div className="full cabin-editor">
              <strong>Biletlər və qiymətlər</strong>
              <small className="muted">Hər sinfin öz qiyməti və yer sayı var. Müştəri bunlardan birini seçir.</small>
              {Object.entries(CABIN_LABELS).map(([value, label]) => {
                const row = (editing.cabins || []).find((cabin) => cabin.cabinClass === value);
                const update = (patch) => setEditing({
                  ...editing,
                  cabins: editing.cabins.map((cabin) => (cabin.cabinClass === value ? { ...cabin, ...patch } : cabin)),
                });
                return (
                  <div key={value} className="cabin-editor-row">
                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={Boolean(row)}
                        onChange={(e) => setEditing({
                          ...editing,
                          cabins: e.target.checked
                            ? [...(editing.cabins || []), { cabinClass: value, price: 0, seatsAvailable: 0 }]
                            : (editing.cabins || []).filter((cabin) => cabin.cabinClass !== value),
                        })}
                      />
                      {label}
                    </label>
                    {row && (
                      <>
                        <label>
                          Qiymət (₼)
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={row.price}
                            onChange={(e) => update({ price: e.target.value })}
                            required
                          />
                        </label>
                        <label>
                          Mövcud yer
                          <input
                            type="number"
                            min="0"
                            value={row.seatsAvailable}
                            onChange={(e) => update({ seatsAvailable: e.target.value })}
                            required
                          />
                        </label>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={Boolean(editing.refundable)}
                onChange={(e) => setEditing({ ...editing, refundable: e.target.checked })}
              />
              Geri qaytarılan
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
        <h1 className="page-title">Uçuşlar</h1>
        <p className="page-subtitle">Uçuş nömrəsi, marşrut, tarix, qiymət və yer sayını idarə edin</p>
      </div>

      {loading && <p className="page-subtitle">Yüklənir...</p>}
      {loadError && (
        <div className="coming-soon-card">
          <h2>Məlumat yüklənmədi</h2>
          <p>{loadError}</p>
          <div className="admin-form-actions">
            <button type="button" className="btn-admin-primary" onClick={() => loadFlights()}>
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
              onClick={handleNewFlight}
            >
              + Uçuş əlavə et
            </button>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nömrə, aviaşirkət və ya şəhər axtar"
            />
            <Select value={originFilter} onChange={(e) => setOriginFilter(e.target.value)}>
              <option value="all">Bütün istiqamətlər</option>
              {origins.map(([code, label]) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </Select>
            <Select value={cabinFilter} onChange={(e) => setCabinFilter(e.target.value)}>
              <option value="all">Bütün siniflər</option>
              {Object.entries(CABIN_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </div>

          {successMessage && !editing && <p className="page-subtitle">{successMessage}</p>}
          {saveError && !editing && <p className="muted">{saveError}</p>}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Uçuş nömrəsi</th>
                  <th>Haradan-haraya</th>
                  <th>Tarix</th>
                  <th>Qiymət</th>
                  <th>Sinif / yer</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {editing && !editing.id && (
                  <tr className="edit-row">
                    <td colSpan="6">{editForm}</td>
                  </tr>
                )}
                {visible.map((flight) => (
                  <Fragment key={flight.id}>
                  <tr>
                    <td>
                      <strong>{flight.flightNumber}</strong>
                      <div className="muted">{flight.airline}</div>
                    </td>
                    <td>
                      {flight.originCode} → {flight.destinationCode}
                      <div className="muted">
                        {flight.originCity}{flight.originCountry ? `, ${flight.originCountry}` : ''} → {flight.destinationCity}{flight.destinationCountry ? `, ${flight.destinationCountry}` : ''}
                      </div>
                    </td>
                    <td>
                      {formatDateTime(flight.departureAt)}
                      <div className="muted">{flight.duration || stopLabel(flight.stops)}</div>
                    </td>
                    <td>
                      {(flight.cabins || []).map((cabin) => (
                        <div key={cabin.cabinClass}>
                          {CABIN_LABELS[cabin.cabinClass] || cabin.cabinClass}: ₼{Number(cabin.price || 0).toLocaleString('az-AZ', { maximumFractionDigits: 0 })}
                        </div>
                      ))}
                    </td>
                    <td>
                      {(flight.cabins || []).map((cabin) => (
                        <div key={cabin.cabinClass}>
                          {CABIN_LABELS[cabin.cabinClass] || cabin.cabinClass}: {cabin.seatsAvailable} yer
                        </div>
                      ))}
                      <div className="muted">{flight.refundable ? 'Geri qaytarılan' : 'Qaytarılmayan'}</div>
                    </td>
                    <td className="table-actions">
                      <button onClick={() => handleEditFlight(flight)}>
                        Redaktə
                      </button>
                      <button className="danger" onClick={() => handleDelete(flight)} disabled={deletingId === flight.id}>
                        {deletingId === flight.id ? 'Silinir...' : <FaRegTrashAlt aria-label="Sil" />}
                      </button>
                    </td>
                  </tr>
                  {editing?.id === flight.id && (
                    <tr className="edit-row">
                      <td colSpan="6">{editForm}</td>
                    </tr>
                  )}
                  </Fragment>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan="6">{flights.length === 0 ? 'Uçuş yoxdur' : 'Uyğun uçuş tapılmadı'}</td>
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

export default AdminFlights;
