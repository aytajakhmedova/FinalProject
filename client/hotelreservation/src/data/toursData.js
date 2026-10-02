import img1 from '../assets/images/img1.jpg';
import img2 from '../assets/images/img2.jpg';
import img3 from '../assets/images/img3.jpg';
import img4 from '../assets/images/img4.jpg';
import img5 from '../assets/images/img5.png';

export const TOURS_DATA = [
  {
    id: 1,
    name: 'Bakı Şəhər Turu',
    destination: 'Bakı, Azərbaycan',
    rating: 4.9,
    reviews: 342,
    duration: '3 gün / 2 gecə',
    price: 850,
    image: img1,
    images: [img1, img2, img3],
    description: 'Qədim İçərişəhərdən müasir Flame Towers-ə qədər Bakının ən gözəl yerlərini kəşf edin. Tarix, mədəniyyət və müasir memarlıq bir arada.',
    highlights: [
      'İçərişəhər və Qız Qalası',
      'Flame Towers panorama mənzərəsi',
      'Dəniz kənarı bulvarı',
      'Heydər Əliyev Mərkəzi',
      'Qobustan Qədim Daş Rəsmləri'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Tarixi Bakı',
        activities: [
          'Hava limanından qarşılanma və hotelə transfer',
          'İçərişəhər və Qız Qalası ekskursiyası',
          'Şirvanşahlar Sarayı kompleksi',
          'Dəniz kənarı bulvarında gəzinti',
          'Hotelə qayıdış'
        ]
      },
      {
        day: 2,
        title: 'Müasir Bakı',
        activities: [
          'Heydər Əliyev Mərkəzi',
          'Flame Towers-də panorama mənzərə',
          'Nizami küçəsində sərbəst vaxt',
          'Milli mətbəxdən dad alma',
          'Gecə Bakı şəhər turu'
        ]
      },
      {
        day: 3,
        title: 'Qobustan və Yekun',
        activities: [
          'Qobustan Milli Parkı ekskursiyası',
          'Palçıq vulkanları',
          'Suvenir alış-verişi',
          'Hava limanına transfer'
        ]
      }
    ],
    included: [
      'Otel yerləşdirmə (2 gecə)',
      'Gündəlik səhər yeməyi',
      'Bütün transfer xidmətləri',
      'Professional bələdçi xidməti',
      'Giriş biletləri',
      'Sığorta'
    ],
    excluded: [
      'Beynəlxalq uçuş biletləri',
      'Nahar və şam yeməyi',
      'Şəxsi xərclər',
      'Əlavə ekskursiyalar'
    ],
    availableDates: [
      '2026-10-15',
      '2026-10-22',
      '2026-11-01',
      '2026-11-10',
      '2026-11-20',
      '2026-12-05'
    ],
    maxGuests: 15,
    minGuests: 2,
    category: 'Şəhər Turu',
    difficulty: 'Asan'
  },
  {
    id: 2,
    name: 'Qəbələ Təbiət Turu',
    destination: 'Qəbələ, Azərbaycan',
    rating: 4.8,
    reviews: 218,
    duration: '2 gün / 1 gecə',
    price: 620,
    image: img2,
    images: [img2, img3, img4],
    description: 'Qəbələnin təbiət gözəlliklərini, Nohur gölünü, Tufandağ dağlarını və tarixi abidələri kəşf edin.',
    highlights: [
      'Nohur gölü panorama mənzərəsi',
      'Tufandağ dağ kurort kompleksi',
      'Yeddi Gözəl şəlaləsi',
      'Qədim Qəbələ qalası',
      'Yerli mətbəx təcrübəsi'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Qəbələyə səfər',
        activities: [
          'Bakıdan səhər yola düşmə',
          'Nohur gölü və mənzərə',
          'Yerli restoranda nahar',
          'Hotelə yerləşmə',
          'Yeddi Gözəl şəlaləsi gəzintisi'
        ]
      },
      {
        day: 2,
        title: 'Tufandağ və Qayıdış',
        activities: [
          'Tufandağ teleferik safari',
          'Qədim Qəbələ qalası',
          'Suvenir alış-verişi',
          'Bakıya qayıdış'
        ]
      }
    ],
    included: [
      'Otel (1 gecə)',
      'Səhər yeməyi',
      'Transfer (Bakı-Qəbələ-Bakı)',
      'Bələdçi xidməti',
      'Teleferik biletləri'
    ],
    excluded: [
      'Nahar və şam',
      'Şəxsi xərclər',
      'Əlavə aktivliklər'
    ],
    availableDates: [
      '2026-10-18',
      '2026-10-25',
      '2026-11-05',
      '2026-11-15',
      '2026-12-01'
    ],
    maxGuests: 12,
    minGuests: 2,
    category: 'Təbiət Turu',
    difficulty: 'Orta'
  },
  {
    id: 3,
    name: 'Şəki-Lahıc Tarixi Marşrutu',
    destination: 'Şəki və Lahıc',
    rating: 4.9,
    reviews: 187,
    duration: '4 gün / 3 gecə',
    price: 1150,
    image: img3,
    images: [img3, img4, img5],
    description: 'Şəkinin məşhur Xan Sarayı, Lahıcın mis sənətkarlığı və Qafqazın gözəl təbiəti ilə tanış olun.',
    highlights: [
      'Şəki Xan Sarayı',
      'Lahıc kəndi və mis ustalarının emalatxanaları',
      'Qax çayı vadisi',
      'Yerli xalçaçılıq emalatxanası',
      'Dağ kəndlərində milli mətbəx'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Şəkiyə gediş',
        activities: [
          'Bakıdan yola düşmə',
          'Şamaxı Cümə məscidi',
          'Şəkiyə gəliş və hotelə yerləşmə',
          'Şəki bazarı gəzintisi'
        ]
      },
      {
        day: 2,
        title: 'Şəki tarixi',
        activities: [
          'Şəki Xan Sarayı ekskursiyası',
          'Karvansara',
          'Xalçaçılıq emalatxanası',
          'Yerli şirniyyat sexində'
        ]
      },
      {
        day: 3,
        title: 'Lahıc kəndi',
        activities: [
          'Lahıc kəndinə səfər',
          'Mis ustalarının emalatxanaları',
          'Dağ mənzərəsi gəzintisi',
          'Şəkiyə qayıdış'
        ]
      },
      {
        day: 4,
        title: 'Qayıdış',
        activities: [
          'Suvenir alış-verişi',
          'Bakıya qayıdış'
        ]
      }
    ],
    included: [
      'Otel (3 gecə)',
      'Səhər yeməyi',
      'Transfer və nəqliyyat',
      'Bələdçi xidməti',
      'Giriş biletləri',
      'Şəki paxtası dadma'
    ],
    excluded: [
      'Nahar və şam',
      'Şəxsi xərclər',
      'Suvenirlər'
    ],
    availableDates: [
      '2026-10-20',
      '2026-11-05',
      '2026-11-18',
      '2026-12-03'
    ],
    maxGuests: 10,
    minGuests: 4,
    category: 'Tarixi Tur',
    difficulty: 'Orta'
  },
  {
    id: 4,
    name: 'Qobustan və Abşeron Turu',
    destination: 'Bakı ətrafı',
    rating: 4.7,
    reviews: 294,
    duration: '1 gün',
    price: 280,
    image: img4,
    images: [img4, img5, img1],
    description: 'Qobustanın qədim daş rəsmləri, palçıq vulkanları və Abşeronun tarixi abidələrini bir gündə kəşf edin.',
    highlights: [
      'Qobustan Milli Parkı',
      'Qədim daş rəsmləri (40,000 il)',
      'Palçıq vulkanları',
      'Yanardağ təbii qaz yanması',
      'Atəşgah məbədi'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Qobustan və Abşeron',
        activities: [
          'Hoteldən səhər qalxma',
          'Qobustan Milli Parkı',
          'Palçıq vulkanları',
          'Yerli restoranda nahar',
          'Yanardağ',
          'Atəşgah məbədi',
          'Bakıya qayıdış'
        ]
      }
    ],
    included: [
      'Transfer (Bakı)',
      'Bələdçi xidməti',
      'Giriş biletləri',
      'Su'
    ],
    excluded: [
      'Nahar',
      'Şəxsi xərclər'
    ],
    availableDates: [
      '2026-10-16',
      '2026-10-23',
      '2026-10-30',
      '2026-11-07',
      '2026-11-14',
      '2026-11-21',
      '2026-12-05'
    ],
    maxGuests: 20,
    minGuests: 1,
    category: 'Ekskursiya',
    difficulty: 'Asan'
  },
  {
    id: 5,
    name: 'Xınalıq Dağ Kəndi Macərası',
    destination: 'Xınalıq, Quba',
    rating: 5.0,
    reviews: 142,
    duration: '3 gün / 2 gecə',
    price: 920,
    image: img5,
    images: [img5, img1, img2],
    description: 'Qafqazın ən yüksək və qədim yaşayış məntəqələrindən biri olan Xınalıq kəndində əsl dağ həyatını yaşayın.',
    highlights: [
      'Xınalıq kəndi (2350m hündürlük)',
      'Dağ gəzintisi və trekkinq',
      'Yerli ailədə qonaq',
      'Xınalıq mətbəxindən dad alma',
      'Quba xalçaları və alma bağları'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Qubaya səfər',
        activities: [
          'Bakıdan yola düşmə',
          'Quba şəhəri gəzintisi',
          'Qırmızı Qəsəbə',
          'Hotelə yerləşmə',
          'Yerli bazar'
        ]
      },
      {
        day: 2,
        title: 'Xınalıq macərası',
        activities: [
          'Xınalıq kəndinə səfər',
          'Dağ gəzintisi',
          'Kənd həyatı ilə tanışlıq',
          'Yerli ailədə qonaq',
          'Milli yeməklər'
        ]
      },
      {
        day: 3,
        title: 'Qayıdış',
        activities: [
          'Səhər dağ mənzərəsi',
          'Qubada suvenir alış-verişi',
          'Bakıya qayıdış'
        ]
      }
    ],
    included: [
      'Otel və ev qonaq (2 gecə)',
      'Səhər və şam yeməyi',
      'Transfer və 4x4 dağ nəqliyyatı',
      'Yerli bələdçi',
      'Trekkinq avadanlığı'
    ],
    excluded: [
      'Nahar',
      'Şəxsi xərclər',
      'Professional trekkinq avadanlıqları'
    ],
    availableDates: [
      '2026-10-21',
      '2026-11-03',
      '2026-11-12',
      '2026-12-01'
    ],
    maxGuests: 8,
    minGuests: 4,
    category: 'Macəra Turu',
    difficulty: 'Çətin'
  }
];

export const getTourById = (id) => {
  return TOURS_DATA.find(tour => tour.id === parseInt(id));
};

export const getToursByCategory = (category) => {
  if (!category) return TOURS_DATA;
  return TOURS_DATA.filter(tour => tour.category === category);
};

export const getTourCategories = () => {
  return [...new Set(TOURS_DATA.map(tour => tour.category))];
};
