import React, { useCallback, useEffect, useState } from 'react';
import { getReport } from '../../../api/client';
import { STATUS_LABELS } from '../../../utils/bookingStatus';
import '../Hotels/AdminHotels.css';
import '../Analytics/AdminAnalytics.css';
import '../Manage/AdminManage.css';

const money = (value) =>
  `₼${(Number(value) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const MONTHS = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn', 'İyl', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'];
const monthLabel = (key) => {
  const [year, month] = key.split('-');
  return `${MONTHS[Number(month) - 1] || month} ${year}`;
};
const TYPE_LABELS = { hotel: 'Otel', flight: 'Uçuş', tour: 'Tur' };
const PAYMENT_STATUS = { pending: 'Gözləyir', paid: 'Ödənilib', failed: 'Uğursuz', refunded: 'Geri qaytarılıb', cancelled: 'Ləğv edilib' };
const METHOD_LABELS = { card: 'Kart', cash: 'Nağd', hotel: 'Otel qəbulunda' };

const iso = (date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const BarList = ({ rows, format = money, empty = 'Məlumat yoxdur' }) => {
  const max = Math.max(1, ...rows.map(([, value]) => value));
  if (rows.length === 0) return <p className="an-empty">{empty}</p>;
  return (
    <ul className="an-bars">
      {rows.map(([label, value]) => (
        <li key={label}>
          <span className="an-bar-label">{label}</span>
          <span className="an-bar-track">
            <span className="an-bar-fill" style={{ width: `${Math.max(3, (value / max) * 100)}%` }} />
          </span>
          <strong className="an-bar-value">{format(value)}</strong>
        </li>
      ))}
    </ul>
  );
};

const AdminReports = () => {
  const today = new Date();
  const [from, setFrom] = useState(iso(new Date(today.getFullYear(), today.getMonth() - 11, 1)));
  const [to, setTo] = useState(iso(today));
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(
    (start, end) => {
      setLoading(true);
      return getReport(start, end)
        .then((data) => {
          setReport(data);
          setError('');
        })
        .catch((err) => {
          setReport(null);
          setError(err.message || 'Hesabat yüklənmədi.');
        })
        .finally(() => setLoading(false));
    },
    []
  );

  useEffect(() => {
    load(from, to);
    // the first load uses the default range; later loads run from the buttons
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const preset = (months) => {
    const end = new Date();
    const start = months === 0 ? new Date(end.getFullYear(), 0, 1) : new Date(end.getFullYear(), end.getMonth() - (months - 1), 1);
    setFrom(iso(start));
    setTo(iso(end));
    load(iso(start), iso(end));
  };

  const apply = (event) => {
    event.preventDefault();
    load(from, to);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Hesabatlar</h1>
        <p className="page-subtitle">Gəlir, rezervasiya, doluluq və ödəniş hesabatı (rezervasiya tarixinə görə)</p>
      </div>

      <form className="manage-toolbar" onSubmit={apply}>
        <label className="date-field">
          Başlanğıc
          <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} required />
        </label>
        <label className="date-field">
          Son
          <input type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} required />
        </label>
        <button type="submit" className="btn-admin-primary">Göstər</button>
        <div className="presets">
          <button type="button" onClick={() => preset(1)}>Bu ay</button>
          <button type="button" onClick={() => preset(3)}>Son 3 ay</button>
          <button type="button" onClick={() => preset(12)}>Son 12 ay</button>
          <button type="button" onClick={() => preset(0)}>Bu il</button>
        </div>
      </form>

      {loading && <p className="page-subtitle">Yüklənir...</p>}
      {error && (
        <div className="coming-soon-card">
          <h2>Məlumat yüklənmədi</h2>
          <p>{error}</p>
          <div className="admin-form-actions">
            <button type="button" className="btn-admin-primary" onClick={() => load(from, to)}>Yenidən yoxla</button>
          </div>
        </div>
      )}

      {!loading && !error && report && (
        <>
          <div className="an-kpis">
            <div className="an-kpi">
              <span>Ümumi gəlir</span>
              <strong>{money(report.totalRevenue)}</strong>
              <small>Ləğv edilmiş rezervasiyalar çıxılmaqla</small>
            </div>
            <div className="an-kpi">
              <span>Rezervasiyalar</span>
              <strong>{report.bookingCount}</strong>
              <small>Orta məbləğ {money(report.averageBookingValue)}</small>
            </div>
            <div className="an-kpi">
              <span>Ləğv edilənlər</span>
              <strong>{report.cancelledCount}</strong>
              <small>Seçilmiş dövr üzrə</small>
            </div>
          </div>

          <div className="an-grid">
            <section className="an-panel span-all">
              <h2>Aylıq gəlir</h2>
              <p>{report.from} – {report.to}</p>
              <BarList rows={report.monthly.map((row) => [monthLabel(row.month), row.revenue])} />
            </section>

            <section className="an-panel">
              <h2>Rezervasiya statusları</h2>
              <p>Dövr üzrə say</p>
              <BarList
                rows={report.byStatus.map((row) => [STATUS_LABELS[row.label] || row.label, row.count])}
                format={(value) => String(value)}
              />
            </section>

            <section className="an-panel">
              <h2>Otel, uçuş və tur satışı</h2>
              <p>Gəlir və rezervasiya sayı</p>
              <BarList rows={report.byType.map((row) => [`${TYPE_LABELS[row.type] || row.type} (${row.bookings})`, row.revenue])} />
            </section>

            <section className="an-panel">
              <h2>Ödənişlər – status üzrə</h2>
              <p>Məbləğ</p>
              <BarList rows={report.paymentsByStatus.map((row) => [`${PAYMENT_STATUS[row.label] || row.label} (${row.count})`, row.amount])} />
            </section>

            <section className="an-panel">
              <h2>Ödənişlər – metod üzrə</h2>
              <p>Məbləğ</p>
              <BarList rows={report.paymentsByMethod.map((row) => [`${METHOD_LABELS[row.label] || row.label} (${row.count})`, row.amount])} />
            </section>

            <section className="an-panel span-all">
              <h2>Otellər: rezervasiya və doluluq</h2>
              <p>Ən çox rezervasiya edilən otellər yuxarıdadır. Doluluq = rezerv gecələr / (otaq sayı × gün sayı)</p>
              {report.hotels.length === 0 ? (
                <p className="an-empty">Otel yoxdur</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="an-table">
                    <thead>
                      <tr>
                        <th>Otel</th>
                        <th className="num">Rezervasiya</th>
                        <th className="num">Gəlir</th>
                        <th className="num">Otaq</th>
                        <th className="num">Rezerv gecə</th>
                        <th className="num">Doluluq</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.hotels.map((hotel) => (
                        <tr key={hotel.hotelId}>
                          <td>{hotel.name}</td>
                          <td className="num">{hotel.bookings}</td>
                          <td className="num">{money(hotel.revenue)}</td>
                          <td className="num">{hotel.rooms}</td>
                          <td className="num">{hotel.bookedNights}</td>
                          <td className="num">{hotel.occupancyPercent.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminReports;
