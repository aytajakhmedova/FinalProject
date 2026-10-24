import React, { useEffect, useState } from 'react';
import {
  createSiteAdvantage,
  createSiteMenuItem,
  createSiteSlide,
  deleteSiteAdvantage,
  deleteSiteMenuItem,
  deleteSiteSlide,
  getSiteAdvantages,
  getSiteContent,
  getSiteMenuItems,
  getSiteSlides,
  updateSiteAdvantage,
  updateSiteMenuItem,
  updateSiteSettings,
  updateSiteSlide,
  uploadMedia,
} from '../../../api/client';
import { useSiteContent } from '../../../context/SiteContentContext';
import '../Hotels/AdminHotels.css';

const emptyMenu = () => ({ label: '', url: '/', placement: 'footer', iconKey: '', isRoute: true, sortOrder: 0, isActive: true });
const emptySlide = () => ({ imageUrl: '', title: '', description: '', sortOrder: 0, isActive: true });
const emptyAdvantage = () => ({ iconKey: 'star', color: '#4ade80', title: '', description: '', sortOrder: 0, isActive: true });

const AdminSettings = () => {
  const { reload } = useSiteContent();
  const [settings, setSettings] = useState(null);
  const [menus, setMenus] = useState([]);
  const [slides, setSlides] = useState([]);
  const [advantages, setAdvantages] = useState([]);
  const [editingMenu, setEditingMenu] = useState(null);
  const [editingSlide, setEditingSlide] = useState(null);
  const [editingAdvantage, setEditingAdvantage] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([getSiteContent(), getSiteMenuItems(), getSiteSlides(), getSiteAdvantages()])
      .then(([content, menuItems, slideItems, advantageItems]) => {
        setSettings(content.settings);
        setMenus(menuItems);
        setSlides(slideItems);
        setAdvantages(advantageItems);
        setError('');
      })
      .catch((err) => setError(err.message || 'Parametrlər yüklənmədi.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const saveSettings = (event) => {
    event.preventDefault();
    updateSiteSettings(settings)
      .then(() => {
        setMessage('Sayt parametrləri yadda saxlandı.');
        reload();
      })
      .catch((err) => setError(err.message || 'Yadda saxlanılmadı.'));
  };

  const uploadTo = (setter) => (file) => {
    if (!file) return;
    uploadMedia(file)
      .then((data) => setter(data.url))
      .catch((err) => setError(err.message));
  };

  const field = (key, label, extra = {}) => (
    <label className={extra.full ? 'full' : undefined}>
      {label}
      {extra.file ? (
        <>
          <input value={settings?.[key] || ''} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} />
          <input type="file" accept="image/*,video/mp4,video/webm" onChange={(e) => uploadTo((url) => setSettings({ ...settings, [key]: url }))(e.target.files?.[0])} />
        </>
      ) : extra.area ? (
        <textarea rows={3} value={settings?.[key] || ''} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} />
      ) : (
        <input value={settings?.[key] || ''} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} />
      )}
    </label>
  );

  if (loading) return <div className="admin-page"><p className="page-subtitle">Yüklənir...</p></div>;
  if (error && !settings) {
    return (
      <div className="admin-page">
        <div className="coming-soon-card">
          <h2>Məlumat yüklənmədi</h2>
          <p>{error}</p>
          <button type="button" className="btn-admin-primary" onClick={load}>Yenidən yoxla</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Parametrlər</h1>
        <p className="page-subtitle">Logo, hero, footer və digər sayt məzmununu dəyişin. Dəyişiklik saytda rebuild olmadan görünür.</p>
      </div>
      {message && <p className="page-subtitle">{message}</p>}
      {error && <p className="muted">{error}</p>}

      <form className="admin-edit-card" onSubmit={saveSettings}>
        <h3>Brend və hero</h3>
        <div className="admin-form-grid">
          {field('siteName', 'Sayt adı')}
          {field('logoUrl', 'Logo', { full: true, file: true })}
          {field('heroKicker', 'Hero üst yazı')}
          {field('heroTitleBefore', 'Başlıq (əvvəl)')}
          {field('heroTitleAccent', 'Başlıq (vurğu)')}
          {field('heroTitleAfter', 'Başlıq (sonra)')}
          {field('heroDescription', 'Açıqlama', { full: true, area: true })}
          {field('heroPrimaryButtonText', 'Əsas düymə')}
          {field('heroPrimaryButtonUrl', 'Əsas düymə keçidi')}
          {field('heroSecondaryButtonText', 'İkinci düymə')}
          {field('heroVideoUrl', 'Hero video', { full: true, file: true })}
          {field('heroFloatImage1Url', 'Üzən şəkil 1', { file: true })}
          {field('heroFloatImage2Url', 'Üzən şəkil 2', { file: true })}
          {field('heroSupportBadge', 'Dəstək badge')}
          {field('heroSupportLabel', 'Dəstək mətni')}
          {field('heroStoryTitle', 'Hekayə başlığı')}
          {field('heroStoryText', 'Hekayə mətni', { full: true, area: true })}
          {field('advantagesTitle', 'Üstünlüklər başlığı')}
          {field('advantagesDescription', 'Üstünlüklər mətni', { full: true, area: true })}
          {field('advantagesImageUrl', 'Üstünlüklər şəkli', { full: true, file: true })}
          {field('advantagesRating', 'Reytinq')}
          {field('galleryTitle', 'Qalereya başlığı')}
          {field('featuredEyebrow', 'Seçilmiş eyebrow')}
          {field('featuredTitle', 'Seçilmiş başlıq')}
          {field('footerDescription', 'Footer mətn', { full: true, area: true })}
          {field('footerLinksTitle', 'Keçidlər başlığı')}
          {field('footerHoursTitle', 'Saatlar başlığı')}
          {field('footerContactTitle', 'Əlaqə başlığı')}
          {field('hoursWeekdays', 'Həftə içi')}
          {field('hoursSaturday', 'Şənbə')}
          {field('hoursSunday', 'Bazar')}
          {field('hoursValue', 'Saat dəyəri')}
          {field('contactAddress', 'Ünvan', { full: true })}
          {field('contactEmail', 'Email')}
          {field('contactPhone', 'Telefon')}
          {field('copyrightText', 'Copyright', { full: true })}
          {field('linkedInUrl', 'LinkedIn')}
          {field('twitterUrl', 'Twitter')}
          {field('instagramUrl', 'Instagram')}
          {field('facebookUrl', 'Facebook')}
          {field('noticeSummer', 'Bildiriş 1', { full: true })}
          {field('noticeSupport', 'Bildiriş 2', { full: true })}
        </div>
        <div className="admin-form-actions">
          <button type="submit" className="btn-admin-primary">Parametrləri yadda saxla</button>
        </div>
      </form>

      <div className="admin-edit-card">
        <h3>Menyu</h3>
        <button className="btn-admin-primary" type="button" onClick={() => setEditingMenu(emptyMenu())}>+ Keçid</button>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Yer</th><th>Ad</th><th>URL</th><th></th></tr></thead>
            <tbody>
              {menus.map((item) => (
                <tr key={item.id}>
                  <td>{item.placement}</td>
                  <td>{item.label}</td>
                  <td>{item.url}</td>
                  <td className="table-actions">
                    <button type="button" onClick={() => setEditingMenu(item)}>Redaktə</button>
                    <button type="button" className="danger" onClick={() => deleteSiteMenuItem(item.id).then(load).then(reload)}>Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingMenu && (
        <form className="admin-edit-card" onSubmit={(e) => {
          e.preventDefault();
          const action = editingMenu.id ? updateSiteMenuItem(editingMenu.id, editingMenu) : createSiteMenuItem(editingMenu);
          action.then(() => { setEditingMenu(null); load(); reload(); });
        }}>
          <h3>Menyu elementi</h3>
          <div className="admin-form-grid">
            <label>Ad<input value={editingMenu.label} onChange={(e) => setEditingMenu({ ...editingMenu, label: e.target.value })} required /></label>
            <label>URL<input value={editingMenu.url} onChange={(e) => setEditingMenu({ ...editingMenu, url: e.target.value })} required /></label>
            <label>Yer
              <select value={editingMenu.placement} onChange={(e) => setEditingMenu({ ...editingMenu, placement: e.target.value })}>
                <option value="discover">discover</option>
                <option value="pages">pages</option>
                <option value="quick">quick</option>
                <option value="footer">footer</option>
              </select>
            </label>
            <label>İkon<input value={editingMenu.iconKey} onChange={(e) => setEditingMenu({ ...editingMenu, iconKey: e.target.value })} placeholder="hotel, plane, car" /></label>
            <label>Sıra<input type="number" value={editingMenu.sortOrder} onChange={(e) => setEditingMenu({ ...editingMenu, sortOrder: Number(e.target.value) })} /></label>
            <label>Aktiv
              <select value={String(editingMenu.isActive)} onChange={(e) => setEditingMenu({ ...editingMenu, isActive: e.target.value === 'true' })}>
                <option value="true">Bəli</option>
                <option value="false">Xeyr</option>
              </select>
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="btn-admin-primary">Yadda saxla</button>
            <button type="button" onClick={() => setEditingMenu(null)}>Bağla</button>
          </div>
        </form>
      )}

      <div className="admin-edit-card">
        <h3>Slider / qalereya</h3>
        <button className="btn-admin-primary" type="button" onClick={() => setEditingSlide(emptySlide())}>+ Slayd</button>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Başlıq</th><th>Şəkil</th><th></th></tr></thead>
            <tbody>
              {slides.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td className="muted">{item.imageUrl}</td>
                  <td className="table-actions">
                    <button type="button" onClick={() => setEditingSlide(item)}>Redaktə</button>
                    <button type="button" className="danger" onClick={() => deleteSiteSlide(item.id).then(load).then(reload)}>Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingSlide && (
        <form className="admin-edit-card" onSubmit={(e) => {
          e.preventDefault();
          const action = editingSlide.id ? updateSiteSlide(editingSlide.id, editingSlide) : createSiteSlide(editingSlide);
          action.then(() => { setEditingSlide(null); load(); reload(); });
        }}>
          <h3>Slayd</h3>
          <div className="admin-form-grid">
            <label className="full">Şəkil
              <input value={editingSlide.imageUrl} onChange={(e) => setEditingSlide({ ...editingSlide, imageUrl: e.target.value })} required />
              <input type="file" accept="image/*" onChange={(e) => uploadMedia(e.target.files?.[0]).then((data) => setEditingSlide({ ...editingSlide, imageUrl: data.url }))} />
            </label>
            <label>Başlıq<input value={editingSlide.title} onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })} /></label>
            <label>Sıra<input type="number" value={editingSlide.sortOrder} onChange={(e) => setEditingSlide({ ...editingSlide, sortOrder: Number(e.target.value) })} /></label>
            <label>Aktiv
              <select value={String(editingSlide.isActive)} onChange={(e) => setEditingSlide({ ...editingSlide, isActive: e.target.value === 'true' })}>
                <option value="true">Bəli</option>
                <option value="false">Xeyr</option>
              </select>
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="btn-admin-primary">Yadda saxla</button>
            <button type="button" onClick={() => setEditingSlide(null)}>Bağla</button>
          </div>
        </form>
      )}

      <div className="admin-edit-card">
        <h3>Üstünlüklər</h3>
        <button className="btn-admin-primary" type="button" onClick={() => setEditingAdvantage(emptyAdvantage())}>+ Üstünlük</button>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Başlıq</th><th>İkon</th><th></th></tr></thead>
            <tbody>
              {advantages.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.iconKey}</td>
                  <td className="table-actions">
                    <button type="button" onClick={() => setEditingAdvantage(item)}>Redaktə</button>
                    <button type="button" className="danger" onClick={() => deleteSiteAdvantage(item.id).then(load).then(reload)}>Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingAdvantage && (
        <form className="admin-edit-card" onSubmit={(e) => {
          e.preventDefault();
          const action = editingAdvantage.id ? updateSiteAdvantage(editingAdvantage.id, editingAdvantage) : createSiteAdvantage(editingAdvantage);
          action.then(() => { setEditingAdvantage(null); load(); reload(); });
        }}>
          <h3>Üstünlük</h3>
          <div className="admin-form-grid">
            <label>Başlıq<input value={editingAdvantage.title} onChange={(e) => setEditingAdvantage({ ...editingAdvantage, title: e.target.value })} required /></label>
            <label>İkon<input value={editingAdvantage.iconKey} onChange={(e) => setEditingAdvantage({ ...editingAdvantage, iconKey: e.target.value })} placeholder="utensils, bolt, shield, clock" /></label>
            <label>Rəng<input value={editingAdvantage.color} onChange={(e) => setEditingAdvantage({ ...editingAdvantage, color: e.target.value })} /></label>
            <label>Sıra<input type="number" value={editingAdvantage.sortOrder} onChange={(e) => setEditingAdvantage({ ...editingAdvantage, sortOrder: Number(e.target.value) })} /></label>
            <label className="full">Açıqlama<textarea value={editingAdvantage.description} onChange={(e) => setEditingAdvantage({ ...editingAdvantage, description: e.target.value })} /></label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="btn-admin-primary">Yadda saxla</button>
            <button type="button" onClick={() => setEditingAdvantage(null)}>Bağla</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminSettings;
