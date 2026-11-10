import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HotelCard from '../../components/common/HotelCard/HotelCard';
import { getHotels } from '../../api/client';
import { getAuthToken } from '../../api/auth';
import './Favorites.css';

const Favorites = ({ favorites = [], onToggleFavorite }) => {
  const [hotels, setHotels] = useState(null);

  useEffect(() => {
    let active = true;
    if (!getAuthToken()) {
      setHotels([]);
      return undefined;
    }
    getHotels()
      .then((items) => active && setHotels(items))
      .catch(() => active && setHotels([]));
    return () => { active = false; };
  }, []);

  const signedIn = Boolean(getAuthToken());
  // the order follows the favourites list (the newest first); an unfavoured hotel leaves at once
  const shown = (hotels || [])
    .filter((hotel) => favorites.includes(hotel.id))
    .sort((a, b) => favorites.indexOf(a.id) - favorites.indexOf(b.id));

  return (
    <section className="favorites-page">
      <h1>Sevimli otellərim</h1>
      {!signedIn && (
        <p className="favorites-note">Sevimliləri görmək üçün <Link to="/login">hesabınıza daxil olun</Link>.</p>
      )}
      {signedIn && hotels === null && <p className="favorites-note">Yüklənir...</p>}
      {signedIn && hotels !== null && shown.length === 0 && (
        <p className="favorites-note">Hələ sevimli otel yoxdur. Ana səhifədə otelin yanındakı ürəyə basın. <Link to="/hotels">Otellərə bax</Link></p>
      )}
      <div className="favorites-grid">
        {shown.map((hotel) => (
          <div key={hotel.id} className="favorite-item">
            <HotelCard hotel={hotel} />
            <button type="button" className="favorite-remove" onClick={() => onToggleFavorite(hotel.id)}>
              Sevimlilərdən çıxar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Favorites;
