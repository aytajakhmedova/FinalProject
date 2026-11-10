import { useEffect, useState } from 'react';
import { getMyInquiries } from '../../../api/client';
import './MyInquiries.css';

const STATUS_LABELS = { new: 'Cavab gözlənilir', answered: 'Cavablanıb', closed: 'Bağlanıb' };

// The signed-in guest's own questions and the answers they got from the hotel manager or the team.
const MyInquiries = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getMyInquiries()
      .then((rows) => {
        if (active) setItems(Array.isArray(rows) ? rows : []);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Suallar yüklənmədi.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading || (!error && items.length === 0)) return null;

  return (
    <div className="my-inquiries">
      <h2 className="section-title">Suallarım</h2>
      {error && <p className="my-inquiries-error">{error}</p>}
      {items.map((item) => (
        <article key={item.id} className="my-inquiry">
          <header>
            <div>
              <strong>{item.subject}</strong>
              <div className="my-inquiry-meta">
                {item.hotelName || 'Ümumi sual'} · {item.createdAt ? new Date(item.createdAt).toLocaleDateString('az-AZ') : ''}
              </div>
            </div>
            <span className={`my-inquiry-status status-${item.status}`}>{STATUS_LABELS[item.status] || item.status}</span>
          </header>
          <p className="my-inquiry-message">{item.message}</p>
          {item.reply && (
            <div className="my-inquiry-reply">
              <div className="my-inquiry-meta">
                Cavab{item.repliedBy ? ` — ${item.repliedBy}` : ''}
                {item.repliedAt ? ` · ${new Date(item.repliedAt).toLocaleDateString('az-AZ')}` : ''}
              </div>
              <p>{item.reply}</p>
            </div>
          )}
        </article>
      ))}
    </div>
  );
};

export default MyInquiries;
