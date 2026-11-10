import { useEffect, useMemo, useRef, useState } from 'react';
import { FiAlertCircle, FiBriefcase, FiCheckCircle, FiChevronLeft, FiChevronRight, FiEye, FiFilter, FiHome, FiLoader, FiLock, FiSearch, FiShield, FiTrash2, FiUsers, FiX } from 'react-icons/fi';
import { deleteCustomer, deleteStaff, getHotels, getUsers, updateUserRole } from '../../../api/client';
import { canManageUser, getAuthUser, hasRole } from '../../../api/auth';
import UserPicker from './UserPicker';
import { allRoles, isAdmin, matchText, needsHotel, roleOf, roles } from './userRoles';
import './AdminUsers.css';

const PAGE_SIZE = 10;
const formatDate = (date) => date ? new Date(date).toLocaleDateString('az-AZ') : '—';

function Identity({ user }) {
  const name = user.name || user.email;
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('');
  return <div className="um-identity">
    <span className="um-avatar" aria-hidden="true">{initials.toLocaleUpperCase('az')}</span>
    <span><strong>{name}</strong><small>{user.email}</small></span>
  </div>;
}

function Badge({ role }) {
  const Icon = role.icon;
  return <span className={`um-badge ${role.tone}`}><Icon />{role.label}</span>;
}

function UserDialog({ title, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return <dialog ref={ref} className="um-dialog" aria-labelledby="um-dialog-title" onCancel={onClose}>
    <div className="um-dialog-head"><h2 id="um-dialog-title">{title}</h2><button type="button" aria-label="Bağla" className="um-icon-btn" onClick={onClose}><FiX /></button></div>
    {children}
  </dialog>;
}

function Metric({ icon: Icon, label, value }) {
  return <div className="um-metric"><span className="um-metric-icon"><Icon /></span><div><span>{label}</span><strong>{value}</strong></div></div>;
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const pending = useRef(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.all([getUsers(), getHotels()]).then(([items, properties]) => {
      if (!active) return;
      setUsers(items);
      setHotels(properties);
    }).catch((error) => {
      if (!active) return;
      const message = error.message || 'Məlumat yüklənmədi.';
      setLoadError(message);
      setToast({ type: 'error', message });
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);

  useEffect(() => {
    if (!toast || toast.type === 'loading') return;
    const timeout = setTimeout(() => setToast(null), toast.type === 'error' ? 8000 : 4500);
    return () => clearTimeout(timeout);
  }, [toast]);

  const hotelOptions = useMemo(() => hotels.map((hotel) => ({ value: hotel.id, label: hotel.title, icon: FiHome })), [hotels]);
  const hotelNames = useMemo(() => new Map(hotelOptions.map((hotel) => [hotel.value, hotel.label])), [hotelOptions]);
  const availableRoles = roles.filter((role) => role.value !== 'SuperAdmin' || hasRole('SuperAdmin'));
  const filterOptions = [...new Map([allRoles, ...roles, ...users.map(roleOf)].map((role) => [role.value, role])).values()];
  const actorId = getAuthUser()?.id;
  const visible = useMemo(() => {
    const query = matchText(search);
    return users.filter((user) => {
      const role = roleOf(user);
      return (!filter || user.roles?.includes(filter) || role.value === filter) &&
        matchText([user.name, user.email, role.label, ...(user.roles || []), (needsHotel(role.value) ? hotelNames.get(user.assignedHotelId) : '')].join(' ')).includes(query);
    });
  }, [users, search, filter, hotelNames]);

  const pages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const start = (current - 1) * PAGE_SIZE;
  const displayed = visible.slice(start, start + PAGE_SIZE);
  const count = (value) => loading || loadError ? '—' : value;
  const feedback = loading ? { type: 'loading', message: 'İstifadəçilər yüklənir…' } : toast;
  const ToastIcon = feedback?.type === 'error' ? FiAlertCircle : feedback?.type === 'loading' ? FiLoader : FiCheckCircle;

  async function save(user, role, hotelId) {
    if (pending.current) return;
    if (!canManageUser(user) || (role === 'SuperAdmin' && !hasRole('SuperAdmin'))) {
      setToast({ type: 'error', message: 'Bu əməliyyat üçün icazəniz yoxdur.' });
      setModal(null);
      return;
    }
    if (needsHotel(role) && !hotelNames.has(hotelId)) return;
    pending.current = true;
    setSaving(true);
    setModal(null);
    setToast({ type: 'loading', message: 'Dəyişiklik saxlanılır…' });
    try {
      const updated = await updateUserRole(user.id, role, needsHotel(role) ? Number(hotelId) : null);
      setUsers((items) => items.map((item) => item.id === user.id ? updated : item));
      setToast({ type: 'success', message: `${updated.name || updated.email} üçün dəyişiklik saxlanıldı.` });
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Dəyişiklik saxlanılmadı.' });
    } finally {
      pending.current = false;
      setSaving(false);
    }
  }

  // Staff accounts go through the staff endpoint, guests through the customer one; the server checks the permissions again.
  async function remove(user) {
    if (pending.current) return;
    if (!canManageUser(user) || user.id === actorId) {
      setToast({ type: 'error', message: 'Bu əməliyyat üçün icazəniz yoxdur.' });
      return;
    }
    const isStaff = user.roles?.some((item) => ['SuperAdmin', 'Admin', 'HotelManager', 'Receptionist'].includes(item));
    const note = isStaff ? '' : ' Rezervasiyaları otelin qeydlərində qalacaq.';
    if (!window.confirm(`${user.name || user.email} (${user.email}) hesabı həmişəlik silinsin?${note}`)) return;
    pending.current = true;
    setSaving(true);
    setToast({ type: 'loading', message: 'Hesab silinir…' });
    try {
      await (isStaff ? deleteStaff(user.id) : deleteCustomer(user.id));
      setUsers((items) => items.filter((item) => item.id !== user.id));
      setToast({ type: 'success', message: `${user.email} silindi.` });
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Silinmədi.' });
    } finally {
      pending.current = false;
      setSaving(false);
    }
  }

  function resetFilters() { setFilter(''); setSearch(''); setPage(1); }

  return <section className="um-page">
    <header className="um-heading"><h1>İstifadəçilər</h1><p>İstifadəçi rollarını və otel təyinatlarını idarə edin.</p></header>
    <div className="um-metrics">
      <Metric icon={FiUsers} label="Ümumi istifadəçilər" value={count(users.length)} />
      <Metric icon={FiShield} label="Administratorlar" value={count(users.filter((user) => user.roles?.some(isAdmin)).length)} />
      <Metric icon={FiBriefcase} label="Otel heyəti" value={count(users.filter((user) => user.roles?.some(needsHotel)).length)} />
    </div>
    <div className="um-directory">
      <div className="um-toolbar">
        <h2>İstifadəçi siyahısı</h2>
        <div className="um-controls">
          <label className="um-search"><FiSearch /><input type="search" aria-label="İstifadəçiləri axtar" placeholder="Ad, e-poçt və ya otel axtar…" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} /></label>
          <UserPicker icon={FiFilter} label="Rol filtri" options={filterOptions} value={filter} onChange={(value) => { setFilter(value); setPage(1); }} />
        </div>
      </div>
      {loading ? <div className="um-empty" aria-busy="true">Siyahı yüklənir…</div> : loadError ? <div className="um-empty"><FiAlertCircle /><h3>Siyahı yüklənmədi</h3><p>{loadError}</p><button className="um-btn" onClick={() => { setLoading(true); setLoadError(''); setToast(null); setAttempt(attempt + 1); }}>Yenidən yoxla</button></div> :
        displayed.length ? <table className="um-table" aria-label="İstifadəçi siyahısı"><thead><tr>
          <th>İstifadəçi</th><th>Rol</th><th>İdarə etdiyi otel</th><th>Əməliyyatlar</th>
        </tr></thead><tbody>{displayed.map((user) => {
          const role = roleOf(user);
          const editable = canManageUser(user);
          const hasHotelRole = needsHotel(role.value);
          const options = availableRoles.some((item) => item.value === role.value) ? availableRoles : [...availableRoles, role];
          return <tr key={user.id}>
            <td><Identity user={user} /></td>
            <td data-label="Rol">{editable && user.id !== actorId ? <UserPicker label={`${user.name} üçün rol`} tone={role.tone} icon={role.icon} value={role.value} options={options} disabled={saving}
              onChange={(value) => setModal({ user, role: roles.find((item) => item.value === value), hotelId: hasHotelRole && hotelNames.has(user.assignedHotelId) ? user.assignedHotelId : null })} /> : <Badge role={role} />}</td>
            <td data-label="Otel">{hasHotelRole && editable ? <UserPicker icon={FiHome} label={`${user.name} üçün otel`} value={user.assignedHotelId} options={hotelOptions} searchable placeholder={hotels.length ? 'Otel seçin' : 'Otel yoxdur'} disabled={saving || !hotels.length} onChange={(value) => save(user, role.value, value)} /> : <span className="um-property">{hasHotelRole ? hotelNames.get(user.assignedHotelId) || 'Təyin edilməyib' : '—'}</span>}</td>
            <td className="um-action"><button className="um-icon-btn" aria-label={`${user.name} — hesab məlumatları`} title="Hesab məlumatları" onClick={() => setModal({ user })}><FiEye /></button>{editable && user.id !== actorId && <button className="um-icon-btn" aria-label={`${user.name} — hesabı sil`} title="Hesabı sil" disabled={saving} onClick={() => remove(user)}><FiTrash2 /></button>}</td>
          </tr>;
        })}</tbody></table> : <div className="um-empty"><FiSearch /><h3>{users.length ? 'Uyğun istifadəçi tapılmadı' : 'İstifadəçi yoxdur'}</h3>{(filter || search) && <button className="um-btn" onClick={resetFilters}>Filtrləri təmizlə</button>}</div>}
      {!loading && !loadError && <footer className="um-pagination"><span>{visible.length ? `${start + 1}–${start + displayed.length} / ${visible.length} istifadəçi` : '0 istifadəçi'}</span>
        <nav aria-label="Siyahı səhifələri"><button className="um-icon-btn" aria-label="Əvvəlki səhifə" disabled={current === 1} onClick={() => setPage(current - 1)}><FiChevronLeft /></button><span aria-current="page">{current} / {pages}</span><button className="um-icon-btn" aria-label="Növbəti səhifə" disabled={current === pages} onClick={() => setPage(current + 1)}><FiChevronRight /></button></nav></footer>}
    </div>
    {modal && <UserDialog title={modal.role ? 'Rol dəyişikliyini təsdiqləyin' : 'Hesab məlumatları'} onClose={() => setModal(null)}>
      <Identity user={modal.user} />
      <dl className="um-facts">
        <div><dt>{modal.role ? 'Cari rol' : 'Rol'}</dt><dd><Badge role={roleOf(modal.user)} /></dd></div>
        {modal.role && <div><dt>Yeni rol</dt><dd><Badge role={modal.role} /></dd></div>}
        {modal.role && needsHotel(modal.role.value) ? <div><dt>Otel</dt><dd><UserPicker icon={FiHome} label="Təyin ediləcək otel" options={hotelOptions} value={modal.hotelId} searchable placeholder={hotels.length ? 'Otel seçin' : 'Otel yoxdur'} disabled={!hotels.length} onChange={(hotelId) => setModal({ ...modal, hotelId })} /></dd></div> : !modal.role && <><div><dt>İdarə etdiyi otel</dt><dd>{needsHotel(roleOf(modal.user).value) ? hotelNames.get(modal.user.assignedHotelId) || 'Təyin edilməyib' : '—'}</dd></div><div><dt>Qeydiyyat tarixi</dt><dd>{formatDate(modal.user.createdAt)}</dd></div></>}
      </dl>
      {modal.role && <><p className="um-notice"><FiLock />{needsHotel(modal.role.value) ? 'Seçilmiş otel bu hesaba təyin ediləcək.' : modal.user.assignedHotelId ? 'Bu dəyişiklik mövcud otel təyinatını ləğv edəcək.' : 'Bu dəyişiklik hesabın giriş səlahiyyətlərinə təsir edəcək.'}</p>
        <div className="um-dialog-actions"><button className="um-btn" onClick={() => setModal(null)}>Ləğv et</button><button className="um-btn um-primary" disabled={needsHotel(modal.role.value) && !hotelNames.has(modal.hotelId)} onClick={() => save(modal.user, modal.role.value, modal.hotelId)}>Təsdiqlə</button></div></>}
    </UserDialog>}
    {feedback && <div className={`um-toast um-${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}><ToastIcon /><span>{feedback.message}</span>{feedback.type !== 'loading' && <button className="um-icon-btn" onClick={() => setToast(null)} aria-label="Bildirişi bağla"><FiX /></button>}</div>}
  </section>;
}


