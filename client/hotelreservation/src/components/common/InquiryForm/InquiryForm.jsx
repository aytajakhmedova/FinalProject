import { useState } from 'react';
import { createInquiry } from '../../../api/client';
import { getAuthUser } from '../../../api/auth';
import './InquiryForm.css';

// A guest's question. With a hotelId it goes to that hotel's manager, without one to the site admins.
const InquiryForm = ({ hotelId = null, hotelName = '' }) => {
  const user = getAuthUser();
  const [form, setForm] = useState({
    name: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.fullName || '',
    email: user?.email || '',
    subject: '',
    message: '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const change = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    createInquiry({ ...form, hotelId })
      .then(() => {
        setSent(true);
        setForm((current) => ({ ...current, subject: '', message: '' }));
      })
      .catch((err) => setError(err.message || 'Sual göndərilmədi.'))
      .finally(() => setBusy(false));
  };

  if (sent) {
    return (
      <div className="inquiry-form inquiry-sent">
        <h3>Sualınız göndərildi</h3>
        <p>
          {hotelName ? `${hotelName} meneceri` : 'Komandamız'} cavabı {form.email} ünvanına göndərəcək.
        </p>
        <button type="button" className="inquiry-button" onClick={() => setSent(false)}>Yeni sual yaz</button>
      </div>
    );
  }

  return (
    <form className="inquiry-form" onSubmit={submit}>
      <h3>{hotelName ? `${hotelName} — sual ver` : 'Bizimlə əlaqə'}</h3>
      <p className="inquiry-hint">
        {hotelName ? 'Sualınız bu otelin menecerinə gedəcək.' : 'Sualınız komandamıza gedəcək.'}
      </p>
      <div className="inquiry-row">
        <label>
          Ad
          <input value={form.name} onChange={change('name')} maxLength={100} required />
        </label>
        <label>
          E-poçt
          <input type="email" value={form.email} onChange={change('email')} maxLength={200} required />
        </label>
      </div>
      <label>
        Mövzu
        <input value={form.subject} onChange={change('subject')} maxLength={150} required />
      </label>
      <label>
        Mesaj
        <textarea rows={5} value={form.message} onChange={change('message')} maxLength={3000} required />
      </label>
      {error && <p className="inquiry-error">{error}</p>}
      <button type="submit" className="inquiry-button" disabled={busy}>
        {busy ? 'Göndərilir...' : 'Göndər'}
      </button>
    </form>
  );
};

export default InquiryForm;
