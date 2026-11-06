import Select from '../../../components/common/Select/Select';
import React, { useEffect, useMemo, useState } from 'react';
import { getPayments, updatePaymentStatus } from '../../../api/client';
import '../Hotels/AdminHotels.css';
import '../Analytics/AdminAnalytics.css';
import '../Manage/AdminManage.css';

const money = (value) =>
  `₼${(Number(value) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Gözləyir' },
  { value: 'paid', label: 'Ödənilib' },
  { value: 'failed', label: 'Uğursuz' },
  { value: 'refunded', label: 'Geri qaytarılıb' },
  { value: 'cancelled', label: 'Ləğv edilib' },
];
const METHOD_LABELS = { card: 'Kart', cash: 'Nağd', hotel: 'Otel qəbulunda' };
const statusLabel = (value) => STATUS_OPTIONS.find((item) => item.value === value)?.label || value;

const dayKey = (value) => String(value || '').slice(0, 10);

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [method, setMethod] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [savingId, setSavingId] = useState(0);
  const [message, setMessage] = useState('');

  const load = () => {
    setLoading(true);
    return getPayments()
      .then((items) => {
        setPayments(Array.isArray(items) ? items : []);
        setLoadError('');
      })
      .catch((error) => {
        setPayments([]);
        setLoadError(error.message || 'Ödənişlər yüklənmədi.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const methods = useMemo(() => [...new Set(payments.map((item) => item.method).filter(Boolean))], [payments]);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return payments.filter((item) => {
      if (status !== 'all' && item.status !== status) return false;
      if (method !== 'all' && item.method !== method) return false;
      const created = dayKey(item.createdAt);
      if (from && created < from) return false;
      if (to && created > to) return false;
      if (!query) return true;
      return [item.bookingCode, item.guestName, item.guestEmail, item.itemName]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [payments, search, status, method, from, to]);

  const totals = useMemo(() => {
    const sum = (key) => visible.filter((item) => item.status === key).reduce((total, item) => total + item.amount, 0);
    return { paid: sum('paid'), pending: sum('pending'), refunded: sum('refunded'), failed: visible.filter((item) => item.status === 'failed').length };
  }, [visible]);

  const changeStatus = (payment, next) => {
    if (next === payment.status) return;
    setSavingId(payment.id);
    setMessage('');
    updatePaymentStatus(payment.id, next)
      .then((updated) => {
        setPayments((prev) => prev.map((item) => (item.id === payment.id ? { ...item, ...updated } : item)));
        setMessage(`${payment.bookingCode} ödənişi: ${statusLabel(next)}.`);
      })
      .catch((error) => setMessage(error.message || 'Status dəyişmədi.'))
      .finally(() => setSavingId(0));
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Ödənişlər</h1>
        <p className="page-subtitle">Bütün rezervasiya ödənişləri və statusları</p>
      </div>

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
              <span>Ödənilib</span>
              <strong>{money(totals.paid)}</strong>
              <small>Seçilmiş filtr üzrə</small>
            </div>
            <div className="an-kpi">
              <span>Gözləyir</span>
              <strong>{money(totals.pending)}</strong>
              <small>Hələ təsdiqlənməyən ödənişlər</small>
            </div>
            <div className="an-kpi">
              <span>Geri qaytarılıb</span>
              <strong>{money(totals.refunded)}</strong>
              <small>{totals.failed} uğursuz ödəniş</small>
            </div>
          </div>

          <div className="manage-toolbar">
            <input
              className="grow"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rezervasiya nömrəsi, müştəri və ya xidmət axtar"
            />
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">Hər status</option>
              {STATUS_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </Select>
            <Select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="all">Hər metod</option>
              {methods.map((item) => (
                <option key={item} value={item}>{METHOD_LABELS[item] || item}</option>
              ))}
            </Select>
            <label className="date-field">
              Başlanğıc
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </label>
            <label className="date-field">
              Son
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </label>
          </div>
          {message && <p className="manage-message">{message}</p>}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Rezervasiya</th>
                  <th>Müştəri</th>
                  <th>Məbləğ</th>
                  <th>Metod</th>
                  <th>Tarix</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <strong>{payment.bookingCode}</strong>
                      <br />
                      <small>{payment.itemName || '—'}</small>
                    </td>
                    <td>
                      {payment.guestName || '—'}
                      <br />
                      <small>{payment.guestEmail}</small>
                    </td>
                    <td>
                      {money(payment.amount)} <small>{payment.currency}</small>
                      {payment.depositPercent > 0 && (
                        <>
                          <br />
                          <small>Depozit {payment.depositPercent}% · qalıq {money(payment.remainingAmount)}</small>
                        </>
                      )}
                    </td>
                    <td>
                      {METHOD_LABELS[payment.method] || payment.method}
                      {payment.cardLast4 && (
                        <>
                          <br />
                          <small>•••• {payment.cardLast4}</small>
                        </>
                      )}
                    </td>
                    <td>{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('az-AZ') : '—'}</td>
                    <td>
                      <Select
                        className={`status-select status-${payment.status}`}
                        value={payment.status}
                        disabled={savingId === payment.id}
                        onChange={(e) => changeStatus(payment, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((item) => (
                          <option key={item.value} value={item.value}>{item.label}</option>
                        ))}
                      </Select>
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan="6">{payments.length === 0 ? 'Ödəniş yoxdur' : 'Uyğun ödəniş tapılmadı'}</td>
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

export default AdminPayments;
