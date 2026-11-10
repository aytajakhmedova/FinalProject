import Select from '../../../components/common/Select/Select';
import React, { useEffect, useMemo, useState } from 'react';
import { getInquiries, replyInquiry, setInquiryStatus, deleteInquiry } from '../../../api/client';
import { hasRole } from '../../../api/auth';
import '../Hotels/AdminHotels.css';

const STATUS_LABELS = { new: 'Yeni', answered: 'Cavablanıb', closed: 'Bağlanıb' };
const STATUS_CLASS = { new: 'status-pending', answered: 'status-confirmed', closed: 'status-cancelled' };

// Questions from guests. A hotel manager sees only the questions about their own hotel (the server enforces it);
// admins see every question, including the general ones that are not about a hotel.
const AdminInquiries = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('new');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [draft, setDraft] = useState('');
  const canDelete = hasRole('SuperAdmin', 'Admin');

  const load = (silent = false) => {
    if (!silent) setLoading(true);
    return getInquiries()
      .then((rows) => {
        setItems(Array.isArray(rows) ? rows : []);
        setLoadError('');
      })
      .catch((error) => {
        setItems([]);
        setLoadError(error.message || 'Suallar yüklənmədi.');
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(
    () => (filter === 'all' ? items : items.filter((item) => item.status === filter)),
    [items, filter],
  );
  const newCount = items.filter((item) => item.status === 'new').length;

  const run = (item, action, success) => {
    if (busyId) return Promise.resolve();
    setBusyId(item.id);
    setNotice('');
    return action()
      .then(() => {
        setNotice(success);
        return load(true);
      })
      .catch((error) => setNotice(error.message || 'Əməliyyat alınmadı.'))
      .finally(() => setBusyId(null));
  };

  const toggle = (item) => {
    if (openId === item.id) {
      setOpenId(null);
      return;
    }
    setOpenId(item.id);
    setDraft(item.reply || '');
  };

  const sendReply = (item) =>
    run(item, () => replyInquiry(item.id, draft), 'Cavab göndərildi və qonağın e-poçtuna yazıldı.')
      .then(() => setOpenId(null));

  const remove = (item) => {
    if (!window.confirm('Bu sual silinəcək. Davam edilsin?')) return;
    run(item, () => deleteInquiry(item.id), 'Sual silindi.');
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Suallar</h1>
        <p className="page-subtitle">
          Qonaqların sualları. Otelə aid suallar yalnız o otelin menecerinə, ümumi suallar adminlərə görünür.
        </p>
      </div>

      {loading && <p className="page-subtitle">Yüklənir...</p>}
      {loadError && (
        <div className="coming-soon-card">
          <h2>Məlumat yüklənmədi</h2>
          <p>{loadError}</p>
          <div className="admin-form-actions">
            <button type="button" className="btn-admin-primary" onClick={() => load()}>Yenidən yoxla</button>
          </div>
        </div>
      )}

      {!loading && !loadError && (
        <>
          <div className="inventory-toolbar">
            <Select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="new">Yeni ({newCount})</option>
              <option value="answered">Cavablanıb</option>
              <option value="closed">Bağlanıb</option>
              <option value="all">Hamısı ({items.length})</option>
            </Select>
          </div>
          {notice && <p className="page-subtitle">{notice}</p>}
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Otel</th>
                  <th>Qonaq</th>
                  <th>Sual</th>
                  <th>Status</th>
                  <th>Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr>
                      <td>{item.hotelName || 'Ümumi sual'}</td>
                      <td>
                        <strong>{item.name}</strong>
                        <div className="muted">{item.email}</div>
                        <div className="muted">
                          {item.createdAt ? new Date(item.createdAt).toLocaleString('az-AZ') : ''}
                        </div>
                      </td>
                      <td>
                        <strong>{item.subject}</strong>
                        <div className="muted" style={{ whiteSpace: 'pre-wrap' }}>{item.message}</div>
                      </td>
                      <td>
                        <span className={`status-badge ${STATUS_CLASS[item.status] || ''}`}>
                          {STATUS_LABELS[item.status] || item.status}
                        </span>
                      </td>
                      <td className="table-actions">
                        <button type="button" disabled={busyId === item.id} onClick={() => toggle(item)}>
                          {item.status === 'answered' ? 'Cavaba bax' : 'Cavabla'}
                        </button>
                        {item.status !== 'closed' && (
                          <button
                            type="button"
                            disabled={busyId === item.id}
                            onClick={() => run(item, () => setInquiryStatus(item.id, 'closed'), 'Sual bağlandı.')}
                          >
                            Bağla
                          </button>
                        )}
                        {canDelete && (
                          <button type="button" className="danger" disabled={busyId === item.id} onClick={() => remove(item)}>
                            Sil
                          </button>
                        )}
                      </td>
                    </tr>
                    {openId === item.id && (
                      <tr>
                        <td colSpan="5">
                          {item.reply && (
                            <p className="muted">
                              Əvvəlki cavab ({item.repliedBy}, {item.repliedAt ? new Date(item.repliedAt).toLocaleString('az-AZ') : ''})
                            </p>
                          )}
                          <textarea
                            rows={4}
                            style={{ width: '100%' }}
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            placeholder="Cavabınızı yazın..."
                            maxLength={4000}
                          />
                          <div className="admin-form-actions">
                            <button
                              type="button"
                              className="btn-admin-primary"
                              disabled={busyId === item.id || draft.trim().length < 2}
                              onClick={() => sendReply(item)}
                            >
                              Cavabı göndər
                            </button>
                            <button type="button" onClick={() => setOpenId(null)}>Bağla</button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan="5">Bu filterdə sual yoxdur</td>
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

export default AdminInquiries;
