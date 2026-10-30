import React, { useEffect, useMemo, useState } from 'react';
import { approveReview, deleteReview, getAdminReviews } from '../../../api/client';
import '../Hotels/AdminHotels.css';

const AdminReviews = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState('');

  const load = (silent = false) => {
    if (!silent) setLoading(true);
    return getAdminReviews()
      .then((rows) => {
        setItems(Array.isArray(rows) ? rows : []);
        setLoadError('');
      })
      .catch((error) => {
        setItems([]);
        setLoadError(error.message || 'Rəylər yüklənmədi.');
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    if (filter === 'pending') return items.filter((item) => !item.isApproved);
    if (filter === 'approved') return items.filter((item) => item.isApproved);
    return items;
  }, [items, filter]);

  const pendingCount = items.filter((item) => !item.isApproved).length;

  const approve = (review) => {
    if (busyId) return;
    setBusyId(review.id);
    setNotice('');
    approveReview(review.id)
      .then(() => {
        setNotice('Rəy təsdiqləndi və oteldə görünür.');
        return load(true);
      })
      .catch((error) => setNotice(error.message || 'Təsdiq olunmadı.'))
      .finally(() => setBusyId(null));
  };

  const remove = (review) => {
    if (busyId) return;
    if (!window.confirm('Bu rəy silinəcək və oteldə görünməyəcək. Davam edilsin?')) return;
    setBusyId(review.id);
    setNotice('');
    deleteReview(review.id)
      .then(() => {
        setNotice('Rəy silindi.');
        return load(true);
      })
      .catch((error) => setNotice(error.message || 'Silinmədi.'))
      .finally(() => setBusyId(null));
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Rəylər</h1>
        <p className="page-subtitle">
          Yazılan rəylər burada yığılır. Təsdiqlə — oteldə ulduz kimi görünür. Təsdiqləmə — sil.
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
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="pending">Gözləyənlər ({pendingCount})</option>
              <option value="approved">Təsdiqlənənlər</option>
              <option value="all">Hamısı ({items.length})</option>
            </select>
          </div>
          {notice && <p className="page-subtitle">{notice}</p>}
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Otel</th>
                  <th>Qonaq</th>
                  <th>Ulduz</th>
                  <th>Rəy</th>
                  <th>Status</th>
                  <th>Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((review) => (
                  <tr key={review.id}>
                    <td>{review.hotelName || review.hotelId}</td>
                    <td>
                      <strong>{review.guestName}</strong>
                      <div className="muted">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString('az-AZ') : ''}
                      </div>
                    </td>
                    <td>{'★'.repeat(Number(review.rating) || 0)}</td>
                    <td>
                      <strong>{review.title}</strong>
                      <div className="muted">{review.comment}</div>
                    </td>
                    <td>{review.isApproved ? 'Təsdiqlənib' : 'Gözləyir'}</td>
                    <td className="table-actions">
                      {!review.isApproved && (
                        <button type="button" disabled={busyId === review.id} onClick={() => approve(review)}>
                          Təsdiqlə
                        </button>
                      )}
                      <button type="button" disabled={busyId === review.id} onClick={() => remove(review)}>
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan="6">Bu filterdə rəy yoxdur</td>
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

export default AdminReviews;
