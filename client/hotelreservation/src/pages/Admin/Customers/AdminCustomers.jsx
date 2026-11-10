import Select from '../../../components/common/Select/Select';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { deleteCustomer, getCustomerBookings, getCustomers } from '../../../api/client';
import { FaRegTrashAlt } from 'react-icons/fa';
import { STATUS_LABELS } from '../../../utils/bookingStatus';
import '../Hotels/AdminHotels.css';
import '../Analytics/AdminAnalytics.css';
import '../Manage/AdminManage.css';

const money = (value) =>
  `₼${(Number(value) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const day = (value) => (value ? new Date(value).toLocaleDateString('az-AZ') : '—');
const TYPE_LABELS = { hotel: 'Otel', flight: 'Uçuş', tour: 'Tur' };

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [bookingFilter, setBookingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [openId, setOpenId] = useState('');
  const [history, setHistory] = useState({});
  const [message, setMessage] = useState('');
  const [busyId, setBusyId] = useState('');

  const remove = (customer) => {
    if (busyId) return;
    const note = customer.bookingCount > 0
      ? `

Bu müştərinin ${customer.bookingCount} rezervasiyası var. Rezervasiyalar otelin qeydlərində qalacaq, amma hesaba bağlı olmayacaq.`
      : '';
    if (!window.confirm(`${customer.name} (${customer.email}) hesabı həmişəlik silinsin?${note}`)) return;
    setBusyId(customer.id);
    setMessage('');
    deleteCustomer(customer.id)
      .then(() => {
        setCustomers((prev) => prev.filter((item) => item.id !== customer.id));
        setMessage(`${customer.email} silindi.`);
      })
      .catch((error) => setMessage(error.message || 'Silinmədi.'))
      .finally(() => setBusyId(''));
  };

  const load = () => {
    setLoading(true);
    return getCustomers()
      .then((items) => {
        setCustomers(Array.isArray(items) ? items : []);
        setLoadError('');
      })
      .catch((error) => {
        setCustomers([]);
        setLoadError(error.message || 'Müştərilər yüklənmədi.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return customers.filter((customer) => {
      if (bookingFilter === 'with' && customer.bookingCount === 0) return false;
      if (bookingFilter === 'without' && customer.bookingCount > 0) return false;
      if (statusFilter === 'active' && customer.isRestricted) return false;
      if (statusFilter === 'restricted' && !customer.isRestricted) return false;
      if (!query) return true;
      return [customer.name, customer.surname, customer.email, customer.phone]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [customers, search, bookingFilter, statusFilter]);

  const totals = useMemo(
    () => ({
      count: customers.length,
      withBookings: customers.filter((customer) => customer.bookingCount > 0).length,
      spent: customers.reduce((sum, customer) => sum + customer.totalSpent, 0),
    }),
    [customers]
  );

  const toggleHistory = (customer) => {
    if (openId === customer.id) {
      setOpenId('');
      return;
    }
    setOpenId(customer.id);
    if (history[customer.id]) return;
    setHistory((prev) => ({ ...prev, [customer.id]: { loading: true } }));
    getCustomerBookings(customer.id)
      .then((items) => setHistory((prev) => ({ ...prev, [customer.id]: { items } })))
      .catch((error) => setHistory((prev) => ({ ...prev, [customer.id]: { error: error.message || 'Tarixçə yüklənmədi.' } })));
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Müştərilər</h1>
        <p className="page-subtitle">Qeydiyyatlı müştərilər, rezervasiya sayı və ümumi xərcləri</p>
      </div>

      {message && <p className="manage-message">{message}</p>}
      {loading && <p className="page-subtitle">Yüklənir...</p>}
      {loadError && (
        <div className="coming-soon-card">
          <h2>Məlumat yüklənmədi</h2>
          <p>{loadError}</p>
          <div className="admin-form-actions">
            <button type="button" className="btn-admin-primary" onClick={load}>Yenidən yoxla</button>
          </div>
        </div>
      )}

      {!loading && !loadError && (
        <>
          <div className="an-kpis">
            <div className="an-kpi">
              <span>Müştəri sayı</span>
              <strong>{totals.count}</strong>
              <small>{totals.withBookings} nəfərin rezervasiyası var</small>
            </div>
            <div className="an-kpi">
              <span>Ümumi xərc</span>
              <strong>{money(totals.spent)}</strong>
              <small>Ləğv edilmiş rezervasiyalar çıxılmaqla</small>
            </div>
          </div>

          <div className="manage-toolbar">
            <input
              className="grow"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ad, email və ya telefon axtar"
            />
            <Select value={bookingFilter} onChange={(e) => setBookingFilter(e.target.value)}>
              <option value="all">Bütün müştərilər</option>
              <option value="with">Rezervasiyası olanlar</option>
              <option value="without">Rezervasiyası olmayanlar</option>
            </Select>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Hər status</option>
              <option value="active">Aktiv</option>
              <option value="restricted">Məhdudlaşdırılmış</option>
            </Select>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ad Soyad</th>
                  <th>Email</th>
                  <th>Telefon</th>
                  <th>Rezervasiya</th>
                  <th>Ümumi xərc</th>
                  <th>Son rezervasiya</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((customer) => {
                  const entry = history[customer.id];
                  return (
                    <Fragment key={customer.id}>
                      <tr className="row-clickable" onClick={() => toggleHistory(customer)}>
                        <td><strong>{customer.name} {customer.surname !== customer.name ? customer.surname : ''}</strong></td>
                        <td>{customer.email}</td>
                        <td>{customer.phone || '—'}</td>
                        <td>{customer.bookingCount}</td>
                        <td>{money(customer.totalSpent)}</td>
                        <td>{day(customer.lastBookingAt)}</td>
                        <td>
                          <span className={`status-badge ${customer.isRestricted ? 'status-passive' : 'status-active'}`}>
                            {customer.isRestricted ? 'Məhdud' : 'Aktiv'}
                          </span>
                        </td>
                        <td className="table-actions">
                          <button
                            type="button"
                            className="danger"
                            aria-label="Sil"
                            title="Sil"
                            disabled={busyId === customer.id}
                            onClick={(event) => { event.stopPropagation(); remove(customer); }}
                          >
                            <FaRegTrashAlt />
                          </button>
                        </td>
                      </tr>
                      {openId === customer.id && (
                        <tr className="edit-row">
                          <td colSpan="8">
                            <div className="admin-edit-card">
                              <h3>Rezervasiya tarixçəsi</h3>
                              {(!entry || entry.loading) && <p className="manage-message">Yüklənir...</p>}
                              {entry?.error && <p className="manage-message error">{entry.error}</p>}
                              {entry?.items && entry.items.length === 0 && <p className="manage-message">Bu müştərinin rezervasiyası yoxdur.</p>}
                              {entry?.items && entry.items.length > 0 && (
                                <table className="history-table">
                                  <thead>
                                    <tr>
                                      <th>Kod</th>
                                      <th>Növ</th>
                                      <th>Xidmət</th>
                                      <th>Tarix</th>
                                      <th>Məbləğ</th>
                                      <th>Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {entry.items.map((booking) => (
                                      <tr key={booking.id}>
                                        <td>{booking.code}</td>
                                        <td>{TYPE_LABELS[booking.bookingType] || booking.bookingType}</td>
                                        <td>{booking.itemName || '—'}</td>
                                        <td>
                                          {booking.checkIn ? `${day(booking.checkIn)} – ${day(booking.checkOut)}` : day(booking.createdAt)}
                                        </td>
                                        <td>{money(booking.totalPrice)}</td>
                                        <td>
                                          <span className={`status-badge status-${booking.status}`}>
                                            {STATUS_LABELS[booking.status] || booking.status}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan="8">{customers.length === 0 ? 'Müştəri yoxdur' : 'Uyğun müştəri tapılmadı'}</td>
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

export default AdminCustomers;
