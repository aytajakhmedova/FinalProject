import img1 from '../assets/images/img1.jpg';
import img2 from '../assets/images/img2.jpg';
import img3 from '../assets/images/img3.jpg';
import img4 from '../assets/images/img4.jpg';
import img5 from '../assets/images/img5.png';

export const MOCK_RESERVATIONS = [
  {
    id: 'RES001',
    status: 'confirmed',
    hotelId: 1,
    hotelName: 'Çendu Corinthia',
    hotelImage: img1,
    location: 'Çendu, Çin',
    roomType: 'Deluxe Otaq',
    checkIn: '2024-02-15',
    checkOut: '2024-02-20',
    guests: 2,
    nights: 5,
    pricePerNight: 420,
    totalPrice: 2100,
    bookingDate: '2024-01-10',
  },
  {
    id: 'RES002',
    status: 'upcoming',
    hotelId: 3,
    hotelName: 'Maldiv Manta Resort',
    hotelImage: img3,
    location: 'Maldiv, Maldiv adaları',
    roomType: 'Water Villa',
    checkIn: '2024-03-05',
    checkOut: '2024-03-12',
    guests: 2,
    nights: 7,
    pricePerNight: 890,
    totalPrice: 6230,
    bookingDate: '2024-01-15',
  },
  {
    id: 'RES003',
    status: 'checked-in',
    hotelId: 2,
    hotelName: 'Corinthia Oasis',
    hotelImage: img2,
    location: 'Malta, Malta',
    roomType: 'Dəniz Mənzərəli Otaq',
    checkIn: '2024-01-25',
    checkOut: '2024-01-30',
    guests: 3,
    nights: 5,
    pricePerNight: 510,
    totalPrice: 2550,
    bookingDate: '2023-12-20',
  },
  {
    id: 'RES004',
    status: 'completed',
    hotelId: 4,
    hotelName: 'Grand Luxury Resort',
    hotelImage: img4,
    location: 'Dubay, BƏƏ',
    roomType: 'Ocean Suite',
    checkIn: '2023-12-10',
    checkOut: '2023-12-15',
    guests: 2,
    nights: 5,
    pricePerNight: 950,
    totalPrice: 4750,
    bookingDate: '2023-11-05',
  },
  {
    id: 'RES005',
    status: 'completed',
    hotelId: 5,
    hotelName: 'Paradise Beach Hotel',
    hotelImage: img5,
    location: 'Antalya, Türkiyə',
    roomType: 'Family Suite',
    checkIn: '2023-11-20',
    checkOut: '2023-11-27',
    guests: 4,
    nights: 7,
    pricePerNight: 480,
    totalPrice: 3360,
    bookingDate: '2023-10-15',
  },
  {
    id: 'RES006',
    status: 'cancelled',
    hotelId: 1,
    hotelName: 'Çendu Corinthia',
    hotelImage: img1,
    location: 'Çendu, Çin',
    roomType: 'Standart Otaq',
    checkIn: '2024-02-01',
    checkOut: '2024-02-05',
    guests: 2,
    nights: 4,
    pricePerNight: 420,
    totalPrice: 1680,
    bookingDate: '2023-12-28',
    cancelledDate: '2024-01-05',
  },
];

export const getReservationsByStatus = (status) => {
  return MOCK_RESERVATIONS.filter(res => res.status === status);
};

export const getUpcomingReservations = () => {
  return MOCK_RESERVATIONS.filter(res => 
    res.status === 'confirmed' || res.status === 'upcoming'
  );
};

export const getCompletedReservations = () => {
  return MOCK_RESERVATIONS.filter(res => res.status === 'completed');
};

export const getCancelledReservations = () => {
  return MOCK_RESERVATIONS.filter(res => res.status === 'cancelled');
};

export const getDashboardStats = () => {
  return {
    upcoming: getUpcomingReservations().length,
    completed: getCompletedReservations().length,
    total: MOCK_RESERVATIONS.filter(r => r.status !== 'cancelled').length,
    cancelled: getCancelledReservations().length,
  };
};
