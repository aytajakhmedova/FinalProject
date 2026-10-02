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
        description: 'Rahat və müasir dizaynlı standart otaq. Biznes və istirahət səfərləri üçün ideal seçim.',
        capacity: 2,
        bedType: '1 King yataq və ya 2 Twin yataq',
        size: '32 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Minibar', 'Kondisioner', 'Çay/Qəhvə stansiyası', 'Safe', 'Masaüstü iş yeri', 'Hamamlıq dəsti'],
        images: [theme5, theme6],
        pricePerNight: 420,
        available: true
      },
      {
        id: 102,
        name: 'Deluxe Room',
        description: 'Şəhər mənzərəli geniş və lüks dizaynlı otaq. Əlavə rahatlıq və premium xidmətlər.',
        capacity: 3,
        bedType: '1 King yataq + 1 Sofa yataq',
        size: '45 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Minibar', 'Kondisioner', 'Çay/Qəhvə stansiyası', 'Safe', 'Şəhər mənzərəsi', 'Balkon', 'İş masası', 'Nespresso maşını'],
        images: [theme8, theme9],
        pricePerNight: 580,
        available: true
      },
      {
        id: 103,
        name: 'Executive Room',
        description: 'İcraçılar üçün premium otaq. Şəhər panoraması və ekskluziv xidmətlər.',
        capacity: 2,
        bedType: '1 King yataq',
        size: '50 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Premium minibar', 'Kondisioner', 'Nespresso', 'Safe', 'Panoramik mənzərə', 'Balkon', 'Executive lounge girişi', 'Butler xidməti'],
        images: [theme10, theme1],
        pricePerNight: 720,
        available: true
      },
      {
        id: 104,
        name: 'Family Room',
        description: 'Ailələr üçün geniş və rahat otaq. Uşaqlar üçün xüsusi avadanlıq.',
        capacity: 4,
        bedType: '1 King yataq + 2 Twin yataq',
        size: '55 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Minibar', 'Kondisioner', 'Safe', 'Uşaq yatağı', 'Oyuncaqlar', 'Baby monitor', 'Ayrı hamam'],
        images: [theme2, theme3],
        pricePerNight: 650,
        available: true
      },
      {
        id: 105,
        name: 'Suite',
        description: 'Ayrıca yaşayış otağı olan premium suite. Lüks və rahatlığın ən yüksək səviyyəsi.',
        capacity: 4,
        bedType: '1 King yataq + Qonaq otağı',
        size: '75 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Premium minibar', 'Kondisioner', 'Nespresso', 'Safe', 'Şəhər mənzərəsi', 'Geniş balkon', 'Jakuzzi', 'Butler xidməti', 'Ayrı yaşayış otağı'],
        images: [theme4, theme5],
        pricePerNight: 980,
        available: true
      },
      {
        id: 106,
        name: 'Presidential Suite',
        description: 'Ən lüks və geniş suite. Prezident və VIP qonaqlar üçün hazırlanmış ultra-premium otaq.',
        capacity: 6,
        bedType: '2 King yataq + Qonaq otağı',
        size: '120 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Premium minibar', 'Kondisioner', 'Nespresso', 'Safe', '360° panorama', 'Terras', 'Jakuzzi', '24/7 Butler', 'Şəxsi hamam', 'Yemək otağı', 'Private lounge'],
        images: [theme6, theme8],
        pricePerNight: 1850,
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
        description: 'Panoramik dəniz mənzərəli rahat otaq. Hər gün gün çıxışını seyr edin.',
        capacity: 2,
        bedType: '1 King yataq',
        size: '38 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Minibar', 'Balkon', 'Dəniz mənzərəsi', 'Safe', 'Yoga matı'],
        images: [theme1, theme2],
        pricePerNight: 510,
        available: true
      },
      {
        id: 202,
        name: 'Deluxe Ocean View',
        description: 'Geniş balkonlu lüks dəniz mənzərəli otaq',
        capacity: 3,
        bedType: '1 King yataq + 1 Sofa',
        size: '48 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Premium minibar', 'Geniş balkon', 'Dəniz mənzərəsi', 'Safe', 'Yoga matı', 'Spa xidməti'],
        images: [theme3, theme4],
        pricePerNight: 680,
        available: true
      },
      {
        id: 203,
        name: 'Executive Wellness Room',
        description: 'Wellness mərkəzinə birbaşa girişli premium otaq',
        capacity: 2,
        bedType: '1 King yataq',
        size: '52 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Premium minibar', 'Balkon', 'Dəniz mənzərəsi', 'Jakuzzi', 'Wellness center VIP giriş', 'Şəxsi yoga instructor'],
        images: [theme5, theme6],
        pricePerNight: 850,
        available: true
      },
      {
        id: 204,
        name: 'Family Wellness Suite',
        description: 'Ailələr üçün wellness programlı geniş suite',
        capacity: 4,
        bedType: '1 King + 2 Twin yataq',
        size: '62 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Minibar', '2 Balkon', 'Dəniz mənzərəsi', 'Ayrıca uşaq otağı', 'Family spa paket'],
        images: [theme8, theme9],
        pricePerNight: 920,
        available: true
      },
      {
        id: 205,
        name: 'Wellness Suite',
        description: 'Şəxsi jakuzzi və spa xidmətləri olan lüks suite',
        capacity: 2,
        bedType: '1 King yataq',
        size: '65 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Premium minibar', 'Balkon', 'Dəniz mənzərəsi', 'Jakuzzi', 'Spa xidməti', 'Masaj', 'Yoga paket'],
        images: [theme10, theme1],
        pricePerNight: 1120,
        available: true
      },
      {
        id: 206,
        name: 'Presidential Wellness Suite',
        description: 'Şəxsi wellness mərkəzi və okean panoraması',
        capacity: 4,
        bedType: '1 King yataq + Qonaq otağı',
        size: '95 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Premium minibar', 'Terras', 'Panoramik dəniz mənzərəsi', 'Şəxsi jakuzzi', 'Şəxsi sauna', 'Butler', '24/7 spa therapist', 'Yoga studio'],
        images: [theme2, theme3],
        pricePerNight: 1890,
        available: false
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
        name: 'Beach Villa',
        description: 'Plaj kənarında şəxsi villa, birbaşa okean girişi',
        capacity: 2,
        bedType: '1 King yataq',
        size: '68 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Minibar', 'Şəxsi plaj', 'Açıq duş', 'Snorkel avadanlığı', 'Velosiped'],
        images: [img3, theme1],
        pricePerNight: 780,
        available: true
      },
      {
        id: 302,
        name: 'Water Villa',
        description: 'Su üzərində şəxsi villalar, okean mənzərəsi və şəffaf döşəmə',
        capacity: 2,
        bedType: '1 King yataq',
        size: '75 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Minibar', 'Okean mənzərəsi', 'Şəxsi hovuz', 'Snorkel avadanlığı', 'Şəffaf döşəmə', 'Su velosiped'],
        images: [theme2, theme3],
        pricePerNight: 1180,
        available: true
      },
      {
        id: 303,
        name: 'Deluxe Water Villa',
        description: 'Genişləndirilmiş su villası və infinity hovuz',
        capacity: 3,
        bedType: '1 King yataq + Qonaq sahəsi',
        size: '85 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Premium minibar', 'Okean panorama', 'Infinity hovuz', 'Snorkel avadanlığı', 'Şəffaf döşəmə', 'Açıq jakuzzi', 'Butler'],
        images: [theme4, theme5],
        pricePerNight: 1550,
        available: true
      },
      {
        id: 304,
        name: 'Family Water Villa',
        description: 'İki yatak otağı olan ailə su villası',
        capacity: 4,
        bedType: '1 King + 2 Twin yataq',
        size: '95 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Minibar', 'Okean mənzərəsi', '2 Hamam', 'Şəxsi hovuz', 'Uşaq snorkel', 'Su oyuncaqları'],
        images: [theme6, theme8],
        pricePerNight: 1680,
        available: true
      },
      {
        id: 305,
        name: 'Honeymoon Water Suite',
        description: 'Bal ayı üçün ultra-lüks romantik villa',
        capacity: 2,
        bedType: '1 King yataq',
        size: '105 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Premium minibar', 'Okean panorama', 'Şəxsi hovuz', 'Açıq duş', 'Butler xidməti', 'Şampan qarşılama', 'Couple spa'],
        images: [theme9, theme10],
        pricePerNight: 1980,
        available: true
      },
      {
        id: 306,
        name: 'Presidential Ocean Suite',
        description: 'Okean üzərində maksimum lüks, şəxsi butler və chef',
        capacity: 4,
        bedType: '2 King yataq',
        size: '150 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Premium minibar', '360° okean mənzərəsi', 'Infinity hovuz', 'Şəxsi sauna', '24/7 Butler', 'Private chef', 'Helipad transfer', 'Yacht gəzintisi'],
        images: [img5, theme1],
        pricePerNight: 3500,
        available: false
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
        description: 'Şəhər mənzərəli müasir otaq, Dubay skyline panoraması',
        capacity: 2,
        bedType: '1 King yataq',
        size: '42 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Minibar', 'Şəhər mənzərəsi', 'Kondisioner', 'Safe', 'Hamamlıq dəsti'],
        images: [theme9, theme10],
        pricePerNight: 640,
        available: true
      },
      {
        id: 402,
        name: 'Deluxe Ocean Room',
        description: 'Okean və şəhər qarışıq mənzərəli deluxe otaq',
        capacity: 2,
        bedType: '1 King yataq',
        size: '50 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Premium minibar', 'Okean və şəhər mənzərəsi', 'Balkon', 'Nespresso', 'Sky bar girişi'],
        images: [img5, theme1],
        pricePerNight: 820,
        available: true
      },
      {
        id: 403,
        name: 'Executive Ocean Suite',
        description: 'İcraçı üçün okean panoramalı lüks suite',
        capacity: 3,
        bedType: '1 King yataq + Qonaq otağı',
        size: '68 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Premium minibar', 'Okean panorama', 'Balkon', 'Executive lounge', 'Butler', 'Infinity pool VIP'],
        images: [theme2, theme3],
        pricePerNight: 1150,
        available: true
      },
      {
        id: 404,
        name: 'Family Duplex Suite',
        description: 'İki mərtəbəli ailə suite, balkonla',
        capacity: 5,
        bedType: '1 King + 2 Twin yataq',
        size: '85 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Minibar', '2 Mərtəbə', 'Balkon', '2 Hamam', 'Uşaq oyun sahəsi', 'Plaj avadanlığı'],
        images: [theme4, theme5],
        pricePerNight: 1280,
        available: true
      },
      {
        id: 405,
        name: 'Royal Suite',
        description: 'Kral suite - tam lüks və şəhər panoraması',
        capacity: 4,
        bedType: '1 King yataq + Qonaq otağı',
        size: '110 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Premium minibar', 'Şəhər və okean panorama', 'Geniş terras', 'Jakuzzi', 'Butler', 'Private chef', 'Limuzin xidməti'],
        images: [theme6, theme8],
        pricePerNight: 1890,
        available: true
      },
      {
        id: 406,
        name: 'Presidential Sky Suite',
        description: 'Ən yüksək mərtəbədə ultra-lüks prezident suite',
        capacity: 6,
        bedType: '2 King yataq + Qonaq otağı',
        size: '180 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Premium minibar', '360° panorama', 'Sky terras', 'Infinity jakuzzi', 'Private cinema', '24/7 Butler', 'Helicopter transfer', 'Personal trainer'],
        images: [theme9, theme10],
        pricePerNight: 4200,
        available: false
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
        description: 'Ailə üçün geniş və rahat otaq, all-inclusive',
        capacity: 4,
        bedType: '2 Twin yataq + 1 Sofa',
        size: '40 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Minibar', 'All-inclusive', 'Balkon', 'Safe', 'Uşaq yatağı'],
        images: [theme5, theme6],
        pricePerNight: 280,
        available: true
      },
      {
        id: 502,
        name: 'Deluxe Family Room',
        description: 'Geniş balkonlu deluxe ailə otağı',
        capacity: 4,
        bedType: '1 King + 2 Twin yataq',
        size: '48 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Minibar', 'All-inclusive', 'Geniş balkon', 'Safe', 'Uşaq mərkəzi girişi', 'Animasiya'],
        images: [theme8, theme9],
        pricePerNight: 380,
        available: true
      },
      {
        id: 503,
        name: 'Executive Family Room',
        description: 'Aquapark mənzərəli premium ailə otağı',
        capacity: 5,
        bedType: '1 King + 3 Twin yataq',
        size: '55 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Premium minibar', 'All-inclusive', 'Aquapark mənzərəsi', 'Balkon', 'PlayStation', 'VIP aquapark girişi'],
        images: [theme10, theme1],
        pricePerNight: 480,
        available: true
      },
      {
        id: 504,
        name: 'Family Suite',
        description: 'İki otaqlı ailə suite, ayrı uşaq otağı',
        capacity: 6,
        bedType: '1 King + 2 Twin yataq',
        size: '75 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Minibar', 'All-inclusive', 'Balkon', 'Ayrı otaqlar', 'Uşaq oyun sahəsi', '2 Hamam'],
        images: [theme2, theme3],
        pricePerNight: 620,
        available: true
      },
      {
        id: 505,
        name: 'Villa Suite',
        description: 'Şəxsi bağçalı villa, birbaşa plaj girişi',
        capacity: 6,
        bedType: '2 King yataq + Qonaq otağı',
        size: '95 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Premium minibar', 'All-inclusive', 'Şəxsi bağça', 'Terras', 'BBQ', 'Plaj girişi', 'Butler'],
        images: [theme4, theme5],
        pricePerNight: 880,
        available: true
      },
      {
        id: 506,
        name: 'Presidential Family Villa',
        description: 'Ultra-lüks ailə villası, şəxsi hovuz və plaj',
        capacity: 8,
        bedType: '3 King yataq',
        size: '140 m²',
        amenities: ['Wi-Fi', 'Smart TV', 'Premium minibar', 'All-inclusive', 'Şəxsi hovuz', 'Şəxsi plaj', 'BBQ sahəsi', 'Butler', 'Private chef', 'VIP transfer'],
        images: [theme6, theme8],
        pricePerNight: 1450,
        available: false
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
