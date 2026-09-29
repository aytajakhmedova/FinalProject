import img1 from '../assets/images/img1.jpg';
import img2 from '../assets/images/img2.jpg';
import img3 from '../assets/images/img3.jpg';
import img4 from '../assets/images/img4.jpg';
import img5 from '../assets/images/img5.png';
import theme1 from '../assets/images/hotelthme1.jpg';
import theme2 from '../assets/images/hotelthme2.jpg';
import theme3 from '../assets/images/hotelthme3.jpg';
import theme4 from '../assets/images/hotelthme4.jpg';
import theme5 from '../assets/images/hotelthme5.jpg';
import theme6 from '../assets/images/hotelthme6.jpg';
import theme8 from '../assets/images/hotelthme8.jpg';
import theme9 from '../assets/images/hotelthme9.jpg';
import theme10 from '../assets/images/hotelthme10.jpg';

export const HOTELS_EXTENDED = [
  {
    id: 1,
    title: 'Çendu Corinthia',
    city: 'Çendu',
    country: 'Çin',
    location: 'Gui Xi Şəhər Parkının yanı',
    address: 'No. 88, Jinrong Avenue, Tianfu District',
    stars: 5,
    rating: 4.8,
    reviews: 1284,
    description: 'Gui Xi Şəhər Parkının yanında ucalan lüks otel — Çendu mədəniyyəti ilə müasir Corinthia ruhunu birləşdirir. Şəhərin mərkəzində yerləşən bu otel qonaqlarımıza dünya standartında xidmət təqdim edir.',
    images: [img1, theme1, theme2, theme3, theme4],
    mainImage: img1,
    pricePerNight: 420,
    amenities: ['Spa', 'Hovuz', 'Wi-Fi', 'Restoran', 'Fitness', 'Bar', 'Room Service', 'Parking'],
    hotelType: 'Lüks',
    checkIn: '14:00',
    checkOut: '12:00',
    rooms: [
      {
        id: 101,
        name: 'Standart Otaq',
        description: 'Rahat və müasir dizaynlı standart otaq',
        capacity: 2,
        bedType: '1 King yataq və ya 2 Twin yataq',
        size: '32 m²',
        amenities: ['Wi-Fi', 'TV', 'Minibar', 'Kondisioner', 'Çay/Qəhvə', 'Safe'],
        images: [theme5, theme6],
        pricePerNight: 420,
        available: true
      },
      {
        id: 102,
        name: 'Deluxe Otaq',
        description: 'Şəhər mənzərəli geniş otaq',
        capacity: 3,
        bedType: '1 King yataq + 1 Sofa',
        size: '45 m²',
        amenities: ['Wi-Fi', 'TV', 'Minibar', 'Kondisioner', 'Çay/Qəhvə', 'Safe', 'Şəhər mənzərəsi'],
        images: [theme8, theme9],
        pricePerNight: 580,
        available: true
      },
      {
        id: 103,
        name: 'Suite Otaq',
        description: 'Ayrıca yaşayış otağı olan premium suite',
        capacity: 4,
        bedType: '1 King yataq + Qonaq otağı',
        size: '65 m²',
        amenities: ['Wi-Fi', 'TV', 'Minibar', 'Kondisioner', 'Çay/Qəhvə', 'Safe', 'Şəhər mənzərəsi', 'Balkon', 'Jakuzzi'],
        images: [theme10, img5],
        pricePerNight: 890,
        available: false
      }
    ]
  },
  {
    id: 2,
    title: 'Corinthia Oasis',
    city: 'Malta',
    country: 'Malta',
    location: 'Aralıq dənizi sahili',
    address: 'St. George\'s Bay, St Julian\'s',
    stars: 5,
    rating: 4.9,
    reviews: 892,
    description: 'Aralıq dənizi sahilində wellness mərkəzi — sağlamlıq, spa və dəniz mənzərəsi bir ünvanda. Rahatlaşmaq və yenilənmək üçün ideal məkan.',
    images: [img2, theme4, theme5, theme6],
    mainImage: img2,
    pricePerNight: 510,
    amenities: ['Wellness', 'Plaj', 'Yoga', 'All-inclusive', 'Spa', 'Fitness', 'Restoran'],
    hotelType: 'Wellness',
    checkIn: '15:00',
    checkOut: '11:00',
    rooms: [
      {
        id: 201,
        name: 'Dəniz Mənzərəli Otaq',
        description: 'Panoramik dəniz mənzərəli rahat otaq',
        capacity: 2,
        bedType: '1 King yataq',
        size: '38 m²',
        amenities: ['Wi-Fi', 'TV', 'Minibar', 'Balkon', 'Dəniz mənzərəsi'],
        images: [theme1, theme2],
        pricePerNight: 510,
        available: true
      },
      {
        id: 202,
        name: 'Wellness Suite',
        description: 'Şəxsi jakuzzi və spa xidmətləri',
        capacity: 2,
        bedType: '1 King yataq',
        size: '55 m²',
        amenities: ['Wi-Fi', 'TV', 'Minibar', 'Balkon', 'Dəniz mənzərəsi', 'Jakuzzi', 'Spa xidməti'],
        images: [theme3, theme4],
        pricePerNight: 780,
        available: true
      }
    ]
  },
  {
    id: 3,
    title: 'Maldiv Manta Resort',
    city: 'Maldiv',
    country: 'Maldiv adaları',
    location: 'Okean üzərində',
    address: 'Baa Atoll, North Maldives',
    stars: 5,
    rating: 5.0,
    reviews: 640,
    description: 'Xurma ağacları və firuzəyi su ilə əhatə olunmuş iki ada təcrübəsi — okean üzərində villalar. Əsl tropik cənnət.',
    images: [img3, theme8, theme9, theme10],
    mainImage: img3,
    pricePerNight: 890,
    amenities: ['Overwater villa', 'Snorkel', 'Spa', 'Transfer', 'Plaj', 'Su idmanları'],
    hotelType: 'Lüks',
    checkIn: '14:00',
    checkOut: '12:00',
    rooms: [
      {
        id: 301,
        name: 'Water Villa',
        description: 'Su üzərində şəxsi villalar',
        capacity: 2,
        bedType: '1 King yataq',
        size: '75 m²',
        amenities: ['Wi-Fi', 'TV', 'Minibar', 'Okean mənzərəsi', 'Şəxsi hovuz', 'Snorkel avadanlığı'],
        images: [img3, theme1],
        pricePerNight: 890,
        available: true
      },
      {
        id: 302,
        name: 'Honeymoon Villa',
        description: 'Bal ayı üçün ultra-lüks villa',
        capacity: 2,
        bedType: '1 King yataq',
        size: '95 m²',
        amenities: ['Wi-Fi', 'TV', 'Minibar', 'Okean mənzərəsi', 'Şəxsi hovuz', 'Açıq duş', 'Butler xidməti'],
        images: [theme2, theme3],
        pricePerNight: 1450,
        available: true
      }
    ]
  },
  {
    id: 4,
    title: 'Grand Luxury Resort',
    city: 'Dubay',
    country: 'BƏƏ',
    location: 'Jumeirah Beach',
    address: 'Jumeirah Beach Road, Dubai',
    stars: 5,
    rating: 4.7,
    reviews: 2103,
    description: 'Sahilboyu lüks otel, dünya səviyyəli xidmət və panoramik şəhər-dəniz mənzərəsi. Dubayın ən məşhur otellərindən biri.',
    images: [img4, theme5, theme6, theme8],
    mainImage: img4,
    pricePerNight: 640,
    amenities: ['Infinity pool', 'Sky bar', 'Gym', 'Valet', 'Spa', 'Plaj', 'Restoran'],
    hotelType: 'Lüks',
    checkIn: '15:00',
    checkOut: '12:00',
    rooms: [
      {
        id: 401,
        name: 'City View Room',
        description: 'Şəhər mənzərəli müasir otaq',
        capacity: 2,
        bedType: '1 King yataq',
        size: '42 m²',
        amenities: ['Wi-Fi', 'TV', 'Minibar', 'Şəhər mənzərəsi', 'Kondisioner'],
        images: [theme9, theme10],
        pricePerNight: 640,
        available: true
      },
      {
        id: 402,
        name: 'Ocean Suite',
        description: 'Okean mənzərəli lüks suite',
        capacity: 3,
        bedType: '1 King yataq + Qonaq otağı',
        size: '70 m²',
        amenities: ['Wi-Fi', 'TV', 'Minibar', 'Okean mənzərəsi', 'Balkon', 'Butler xidməti'],
        images: [img5, theme1],
        pricePerNight: 950,
        available: true
      }
    ]
  },
  {
    id: 5,
    title: 'Paradise Beach Hotel',
    city: 'Antalya',
    country: 'Türkiyə',
    location: 'Lara Beach',
    address: 'Lara Yolu, Muratpaşa, Antalya',
    stars: 4,
    rating: 4.6,
    reviews: 1750,
    description: 'Tropik rahatlıq, ailə üçün ideal çimərlik və aktiv istirahət paketləri. All-inclusive sistem.',
    images: [img5, theme2, theme3, theme4],
    mainImage: img5,
    pricePerNight: 280,
    amenities: ['Ailə', 'Aquapark', 'All-inclusive', 'Uşaq klubu', 'Animasiya', 'Plaj'],
    hotelType: 'Ailə',
    checkIn: '14:00',
    checkOut: '12:00',
    rooms: [
      {
        id: 501,
        name: 'Standart Ailə Otağı',
        description: 'Ailə üçün geniş otaq',
        capacity: 4,
        bedType: '2 Twin yataq + 1 Sofa',
        size: '40 m²',
        amenities: ['Wi-Fi', 'TV', 'Minibar', 'All-inclusive', 'Balkon'],
        images: [theme5, theme6],
        pricePerNight: 280,
        available: true
      },
      {
        id: 502,
        name: 'Family Suite',
        description: 'İki otaqlı ailə suite',
        capacity: 6,
        bedType: '1 King + 2 Twin yataq',
        size: '65 m²',
        amenities: ['Wi-Fi', 'TV', 'Minibar', 'All-inclusive', 'Balkon', 'Ayrı otaqlar'],
        images: [theme8, theme9],
        pricePerNight: 480,
        available: true
      }
    ]
  }
];

export const getHotelById = (id) => {
  return HOTELS_EXTENDED.find(hotel => hotel.id === parseInt(id));
};

export const getRoomById = (hotelId, roomId) => {
  const hotel = getHotelById(hotelId);
  if (!hotel) return null;
  return hotel.rooms.find(room => room.id === parseInt(roomId));
};
