// Mock Reviews Data
export const MOCK_REVIEWS = {
  1: [ // Reviews for Hotel ID 1
    {
      id: 1,
      hotelId: 1,
      userName: 'Leyla Əliyeva',
      userAvatar: null,
      rating: 5,
      title: 'Möhtəşəm təcrübə!',
      comment: 'Oteldə qaldığımız müddətdə hər şey mükəmməl idi. Otaqlar çox təmiz, xidmət əla, məkan gözəl. Ailə ilə gəlmişdik və hamı çox razı qaldı. Səhər yeməyi çox zəngin idi, dəniz mənzərəsi əlavə bonus.',
      pros: 'Təmizlik, xidmət, mənzərə, yeməklər',
      cons: null,
      stayDate: '2024-08-15',
      date: '2024-08-20',
      roomType: 'Deluxe Dəniz Mənzərəli Otaq',
      verified: true,
      helpful: 15,
    },
    {
      id: 2,
      hotelId: 1,
      userName: 'Rəşad Məmmədov',
      userAvatar: null,
      rating: 4,
      title: 'Çox gözəl otel',
      comment: 'Ümumiyyətlə çox bəyəndik. Otaqlar müasir və rahat. WiFi sürəti yaxşı idi, bu bizim üçün vacib idi. Hovuz sahəsi gözəl dizayn olunub. Restoran yeməkləri dadlı idi.',
      pros: 'Rahat otaqlar, yaxşı internet, gözəl hovuz',
      cons: 'Qiymət bir az yüksək',
      stayDate: '2024-07-22',
      date: '2024-07-25',
      roomType: 'Superior Otaq',
      verified: true,
      helpful: 8,
    },
    {
      id: 3,
      hotelId: 1,
      userName: 'Aysel Həsənova',
      userAvatar: null,
      rating: 5,
      title: 'Ailə üçün ideal',
      comment: 'Uşaqlarla gəlmişdik və hər şey əla idi. Uşaq hovuzu təhlükəsiz və əyləncəli. Animatorlar çox mehriban. Otaqlarda uşaqlar üçün əlavə yataq və ləvazimatlar hazırlamışdılar.',
      pros: 'Uşaqlar üçün əla şərait, mehriban personal, ailə dostu',
      cons: null,
      stayDate: '2024-06-10',
      date: '2024-06-15',
      roomType: 'Ailə Otağı',
      verified: true,
      helpful: 12,
    },
    {
      id: 4,
      hotelId: 1,
      userName: 'Cavid Quliyev',
      userAvatar: null,
      rating: 4,
      title: 'İş səfəri üçün rahat',
      comment: 'İş səfərində qaldım. Otaq rahat idi, iş masası və yaxşı işıqlandırma var. Resepsiyada çox kömək oldular. Yeganə problem parkda yer tapmaq çətinliyi idi.',
      pros: 'İşə yararlı şərait, peşəkar personal',
      cons: 'Parklama məhdud',
      stayDate: '2024-05-18',
      date: '2024-05-20',
      roomType: 'Business Otaq',
      verified: true,
      helpful: 5,
    },
  ],
  2: [ // Reviews for Hotel ID 2
    {
      id: 5,
      hotelId: 2,
      userName: 'Nigar Əhmədova',
      userAvatar: null,
      rating: 5,
      title: 'Lüks və rahatlıq',
      comment: 'Balayı səfərimiz üçün bu oteli seçdik və heç peşman olmadıq. Hər şey lüks və rahat. SPA mərkəzi möhtəşəm idi. Romantik şam yeməyi xidməti unutulmaz oldu.',
      pros: 'Romantik atmosfer, lüks xidmət, SPA',
      cons: null,
      stayDate: '2024-08-01',
      date: '2024-08-05',
      roomType: 'Honeymoon Suite',
      verified: true,
      helpful: 20,
    },
    {
      id: 6,
      hotelId: 2,
      userName: 'Elvin Sultanov',
      userAvatar: null,
      rating: 4,
      title: 'Yaxşı xidmət',
      comment: 'Qonaqpərvərlik səviyyəsi yüksək. Personal çox diqqətli. Otaqlar geniş. Bazarla yaxın məsafədə olması çox əlverişli.',
      pros: 'Mərkəzi məkan, diqqətli xidmət',
      cons: 'Səs-küy bəzən problem olur',
      stayDate: '2024-07-12',
      date: '2024-07-14',
      roomType: 'Standard Otaq',
      verified: true,
      helpful: 6,
    },
  ],
};

// Get reviews for a specific hotel
export const getHotelReviews = (hotelId) => {
  return MOCK_REVIEWS[hotelId] || [];
};

// Calculate average rating for a hotel
export const getAverageRating = (hotelId) => {
  const reviews = getHotelReviews(hotelId);
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
};

// Get total review count for a hotel
export const getTotalReviews = (hotelId) => {
  return getHotelReviews(hotelId).length;
};

// Add a new review (mock)
export const addReview = (hotelId, review) => {
  if (!MOCK_REVIEWS[hotelId]) {
    MOCK_REVIEWS[hotelId] = [];
  }
  MOCK_REVIEWS[hotelId].unshift(review);
  return review;
};
