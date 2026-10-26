const PATH_KEYS = {
  '/': 'footer.home',
  '/hotels': 'nav.hotels',
  '/flights': 'nav.flight',
  '/tours': 'nav.tours',
  '/about': 'nav.about',
  '/gallery': 'nav.gallery',
  '/reviews': 'nav.reviews',
  '/destinations': 'nav.destinations',
  '/contact': 'footer.contact',
};

const SHORT_PATH_KEYS = {
  '/hotels': 'nav.hotel',
  '/flights': 'nav.flight',
  '/tours': 'nav.tour',
};

const HASH_KEYS = {
  '#featured': 'feat.title',
  '#gallery': 'nav.gallery',
  '#about': 'nav.about',
  '#top': 'footer.home',
  '#destinations': 'nav.destinations',
  '#reviews': 'nav.reviews',
};

const ICON_KEYS = {
  hotel: 'nav.hotel',
  plane: 'nav.flight',
  car: 'nav.tour',
  tour: 'nav.tour',
};

export const menuLabel = (item, t, { short = false } = {}) => {
  const url = item?.url || item?.href || '';
  const path = url.split('?')[0];
  const key = (short && SHORT_PATH_KEYS[path])
    || PATH_KEYS[path]
    || HASH_KEYS[path]
    || ICON_KEYS[item?.iconKey];
  return key ? t(key) : item?.label || '';
};
