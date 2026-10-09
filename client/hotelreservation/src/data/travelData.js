import img3 from '../assets/images/hotelimg3.jfif';
import hotelimg1 from '../assets/images/hotelimg1.jfif';
import hotelimg2 from '../assets/images/hotelimg2.jfif';
import hotelimg3 from '../assets/images/hotelimg3.jfif';
import hotelimg4 from '../assets/images/hotelimg4.jfif';
import hotelimg5 from '../assets/images/hotelimg5.jfif';
import hotelimg6 from '../assets/images/hotelimg6.jfif';
import hotelimg7 from '../assets/images/hotelimg7.jfif';
import theme2 from '../assets/images/hotelimg2.jfif';
import theme3 from '../assets/images/hotelimg5.jfif';
import theme4 from '../assets/images/hotelimg4.jfif';
import theme5 from '../assets/images/hotelimg1.jfif';
import theme6 from '../assets/images/hotelimg6.jfif';
import theme9 from '../assets/images/hotelimg7.jfif';
import theme10 from '../assets/images/hotelimg2.jfif';

export const CITIES = [
  { name: 'Bakı', country: 'Azərbaycan' },
  { name: 'Qəbələ', country: 'Azərbaycan' },
  { name: 'Şəki', country: 'Azərbaycan' },
  { name: 'Naxçıvan', country: 'Azərbaycan' },
  { name: 'İstanbul', country: 'Türkiyə' },
  { name: 'Antalya', country: 'Türkiyə' },
  { name: 'Dubay', country: 'BƏƏ' },
  { name: 'Paris', country: 'Fransa' },
  { name: 'Roma', country: 'İtaliya' },
  { name: 'Maldiv', country: 'Maldiv adaları' },
  { name: 'Çendu', country: 'Çin' },
  { name: 'Malta', country: 'Malta' },
];

export const HOTELS = [
  {
    id: 1,
    title: 'Çendu Corinthia',
    city: 'Çendu',
    country: 'Çin',
    year: '2028-ci ilin açılışı',
    description:
      'Gui Xi Şəhər Parkının yanında ucalan lüks otel — Çendu mədəniyyəti ilə müasir Corinthia ruhunu birləşdirir.',
    image: hotelimg2,
    price: 420,
    rating: 4.8,
    reviews: 1284,
    nights: 1,
    amenities: ['Spa', 'Hovuz', 'Wi-Fi', 'Restoran'],
    tag: 'Yeni',
    video: 'https://www.youtube.com/watch?v=a_G5ZaoZbvk',
  },
  {
    id: 2,
    title: 'Corinthia Oasis',
    city: 'Malta',
    country: 'Malta',
    year: '2028-ci ilin açılışı',
    description:
      'Aralıq dənizi sahilində wellness mərkəzi — sağlamlıq, spa və dəniz mənzərəsi bir ünvanda.',
    image: hotelimg3,
    price: 510,
    rating: 4.9,
    reviews: 892,
    nights: 1,
    amenities: ['Wellness', 'Plaj', 'Yoga', 'All-inclusive'],
    tag: 'Wellness',
    video: 'https://www.youtube.com/watch?v=btwEbe-ztNE',
  },
  {
    id: 3,
    title: 'Maldiv Manta Resort',
    city: 'Maldiv',
    country: 'Maldiv adaları',
    year: '2028-ci ilin açılışı',
    description:
      'Xurma ağacları və firuzəyi su ilə əhatə olunmuş iki ada təcrübəsi — okean üzərində villalar.',
    image: hotelimg5,
    price: 890,
    rating: 5.0,
    reviews: 640,
    nights: 1,
    amenities: ['Overwater villa', 'Snorkel', 'Spa', 'Transfer'],
    tag: 'Lüks',
    video: 'https://www.youtube.com/watch?v=G_3icYBpqC0',
  },
  {
    id: 4,
    title: 'Grand Luxury Resort',
    city: 'Dubay',
    country: 'BƏƏ',
    year: 'Açıqdır',
    description:
      'Sahilboyu lüks otel, dünya səviyyəli xidmət və panoramik şəhər-dəniz mənzərəsi.',
    image: hotelimg1,
    price: 640,
    rating: 4.7,
    reviews: 2103,
    nights: 1,
    amenities: ['Infinity pool', 'Sky bar', 'Gym', 'Valet'],
    tag: 'Populyar',
    video: 'https://www.youtube.com/watch?v=A8p4t_YuZkU',
  },
  {
    id: 5,
    title: 'Paradise Beach Hotel',
    city: 'Antalya',
    country: 'Türkiyə',
    year: 'Açıqdır',
    description:
      'Tropik rahatlıq, ailə üçün ideal çimərlik və aktiv istirahət paketləri.',
    image: hotelimg4,
    price: 280,
    rating: 4.6,
    reviews: 1750,
    nights: 1,
    amenities: ['Ailə', 'Aquapark', 'All-inclusive', 'Uşaq klubu'],
    tag: 'Ailə',
    video: 'https://www.youtube.com/watch?v=LYTqsQF6OMQ',
  },
  {
    id: 6,
    title: 'Flame Towers Suites',
    city: 'Bakı',
    country: 'Azərbaycan',
    year: 'Açıqdır',
    description: 'Xəzər mənzərəli penthouse otaqlar, şəhər mərkəzinə 8 dəqiqə.',
    image: hotelimg7,
    price: 195,
    rating: 4.7,
    reviews: 980,
    nights: 1,
    amenities: ['Dəniz mənzərəsi', 'Wi-Fi', 'Parking', 'Restoran'],
    tag: 'Şəhər',
    video: 'https://www.youtube.com/watch?v=Bdd9RAEo0YI',
  },
  {
    id: 7,
    title: 'Qəbələ Mountain Lodge',
    city: 'Qəbələ',
    country: 'Azərbaycan',
    year: 'Açıqdır',
    description: 'Dağ havası, spa və qış-yay turları — Tufandağ yaxınlığında.',
    image: theme2,
    price: 160,
    rating: 4.5,
    reviews: 540,
    nights: 1,
    amenities: ['Dağ', 'Spa', 'Kayak', 'Şömine'],
    tag: 'Təbiət',
    video: 'https://www.youtube.com/watch?v=DQ29-sgwMl0',
  },
  {
    id: 8,
    title: 'Bosphorus Palas',
    city: 'İstanbul',
    country: 'Türkiyə',
    year: 'Açıqdır',
    description: 'Boğaz sahilində butik otel — tarixi yarımadaya qısa məsafə.',
    image: theme3,
    price: 310,
    rating: 4.8,
    reviews: 1320,
    nights: 1,
    amenities: ['Boğaz', 'Rooftop', 'Spa', 'Transfer'],
    tag: 'Romantik',
    video: 'https://www.youtube.com/watch?v=dFlsu5Fj46E',
  },
];

export const getYoutubeId = (url = '') => {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return match ? match[1] : '';
};

export const DESTINATIONS = [
  {
    country: 'Azərbaycan',
    image: hotelimg6,
    description: 'Qiymətlər 2 yetişkin üçün gecəlik orta göstəricidir.',
    months: [
      { name: 'Fevral', priceRange: '₼150 – ₼750' },
      { name: 'Mart', priceRange: '₼165 – ₼820' },
      { name: 'Aprel', priceRange: '₼180 – ₼890' },
      { name: 'May', priceRange: '₼200 – ₼960' },
      { name: 'İyun', priceRange: '₼220 – ₼1.050' },
      { name: 'İyul', priceRange: '₼240 – ₼1.120' },
    ],
  },
  {
    country: 'Türkiyə',
    image: theme4,
    description: 'Qiymətlər 2 yetişkin üçün gecəlik orta göstəricidir.',
    months: [
      { name: 'Fevral', priceRange: '₺2.380 – ₺11.300' },
      { name: 'Mart', priceRange: '₺2.395 – ₺11.610' },
      { name: 'Aprel', priceRange: '₺2.750 – ₺13.275' },
      { name: 'May', priceRange: '₺2.945 – ₺14.100' },
      { name: 'İyun', priceRange: '₺3.235 – ₺15.900' },
      { name: 'İyul', priceRange: '₺3.160 – ₺15.750' },
    ],
  },
  {
    country: 'İtaliya',
    image: theme9,
    description: 'Qiymətlər 2 yetişkin üçün gecəlik orta göstəricidir.',
    months: [
      { name: 'Fevral', priceRange: '€180 – €850' },
      { name: 'Mart', priceRange: '€195 – €920' },
      { name: 'Aprel', priceRange: '€220 – €1.050' },
      { name: 'May', priceRange: '€250 – €1.180' },
      { name: 'İyun', priceRange: '€280 – €1.320' },
      { name: 'İyul', priceRange: '€310 – €1.450' },
    ],
  },
  {
    country: 'İspaniya',
    image: theme5,
    description: 'Qiymətlər 2 yetişkin üçün gecəlik orta göstəricidir.',
    months: [
      { name: 'Fevral', priceRange: '€170 – €820' },
      { name: 'Mart', priceRange: '€185 – €890' },
      { name: 'Aprel', priceRange: '€210 – €980' },
      { name: 'May', priceRange: '€240 – €1.120' },
      { name: 'İyun', priceRange: '€270 – €1.260' },
      { name: 'İyul', priceRange: '€300 – €1.400' },
    ],
  },
  {
    country: 'Yunanıstan',
    image: theme10,
    description: 'Qiymətlər 2 yetişkin üçün gecəlik orta göstəricidir.',
    months: [
      { name: 'Fevral', priceRange: '€160 – €780' },
      { name: 'Mart', priceRange: '€175 – €850' },
      { name: 'Aprel', priceRange: '€200 – €920' },
      { name: 'May', priceRange: '€230 – €1.050' },
      { name: 'İyun', priceRange: '€260 – €1.180' },
      { name: 'İyul', priceRange: '€290 – €1.320' },
    ],
  },
];

export const EXPERIENCES = [
  {
    id: 1,
    title: 'Qəbələ dağ turu',
    location: 'Qəbələ',
    duration: '2 gün',
    price: 145,
    image: theme2,
    category: 'Təbiət',
  },
  {
    id: 2,
    title: 'Bakı gecə turu',
    location: 'Bakı',
    duration: '4 saat',
    price: 45,
    image: hotelimg6,
    category: 'Şəhər',
  },
  {
    id: 3,
    title: 'Maldiv dalğıc',
    location: 'Maldiv',
    duration: '1 gün',
    price: 220,
    image: img3,
    category: 'Dəniz',
  },
  {
    id: 4,
    title: 'İstanbul Boğaz kruizi',
    location: 'İstanbul',
    duration: '3 saat',
    price: 68,
    image: theme3,
    category: 'Romantik',
  },
  {
    id: 5,
    title: 'Dubay səhra safari',
    location: 'Dubay',
    duration: '6 saat',
    price: 95,
    image: hotelimg4,
    category: 'Macəra',
  },
  {
    id: 6,
    title: 'Antalya spa günü',
    location: 'Antalya',
    duration: '1 gün',
    price: 80,
    image: theme6,
    category: 'Wellness',
  },
];

export const RATES = {
  AZN: { label: 'AZN', symbol: '₼', rate: 1 },
  USD: { label: 'USD', symbol: '$', rate: 1 / 1.7 },
  EUR: { label: 'EUR', symbol: '€', rate: 1 / 1.85 },
};

export const formatPrice = (aznAmount, currency = 'AZN') => {
  const cfg = RATES[currency] || RATES.AZN;
  const value = Math.round(aznAmount * cfg.rate);
  return `${cfg.symbol}${value}`;
};
