import { MOCK_RESERVATIONS } from '../data/reservationsData';

const STORAGE_KEY = 'otelburada_bookings';
const SEEDED_KEY = 'otelburada_bookings_seeded_v3';

export const STATUS_LABELS = {
  confirmed: 'Təsdiqlənib',
  'checked-in': 'Giriş edilib',
  'checked-out': 'Çıxış edilib',
  cancelled: 'Ləğv edilib',
};

export const NEXT_STATUSES = {
  confirmed: ['checked-in', 'cancelled'],
  'checked-in': ['checked-out'],
  'checked-out': [],
  cancelled: [],
};

const toISO = (date) => date.toISOString().split('T')[0];

export const generateConfirmationNumber = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `OB-${code}`;
};

const mapLegacyStatus = (status) => {
  if (status === 'upcoming' || status === 'pending') return 'confirmed';
  if (status === 'completed') return 'checked-out';
  return status || 'confirmed';
};

const shiftRange = (offsetDays, nights) => {
  const start = new Date();
  start.setHours(12, 0, 0, 0);
  start.setDate(start.getDate() + offsetDays);
  const end = new Date(start);
  end.setDate(end.getDate() + nights);
  return { checkIn: toISO(start), checkOut: toISO(end), nights };
};

export const normalizeBooking = (booking) => {
  if (!booking) return null;
  const status = mapLegacyStatus(booking.status);
  const hotel = booking.hotel || {
    id: booking.hotelId,
    name: booking.hotelName,
    location: booking.location,
  };
  const room = booking.room || {
    id: booking.roomId,
    name: booking.roomType,
    pricePerNight: booking.pricePerNight,
  };
  const nights = booking.nights || 1;
  const total = booking.totalPrice ?? booking.priceBreakdown?.total ?? 0;

  return {
    ...booking,
    id: String(booking.id),
    confirmationNumber: booking.confirmationNumber || String(booking.id),
    status,
    hotelId: hotel.id,
    hotelName: hotel.name || hotel.title || booking.hotelName,
    hotelImage: booking.hotelImage,
    location: hotel.location || booking.location,
    roomId: room.id,
    roomType: room.name || booking.roomType,
    hotel: {
      id: hotel.id,
      name: hotel.name || hotel.title || booking.hotelName,
      title: hotel.title || hotel.name || booking.hotelName,
      location: hotel.location || booking.location,
    },
    room: {
      id: room.id,
      name: room.name || booking.roomType,
      pricePerNight: room.pricePerNight || booking.pricePerNight,
    },
    nights,
    totalPrice: total,
    priceBreakdown: booking.priceBreakdown || {
      nights,
      basePrice: total,
      extraGuestFee: 0,
      subtotal: total,
      taxRate: 0,
      tax: 0,
      total,
    },
    guestName: booking.guestName || 'Qonaq',
    guestEmail: booking.guestEmail || '',
    guestPhone: booking.guestPhone || '',
    bookingDate: booking.bookingDate,
    statusHistory: booking.statusHistory || [],
  };
};

const seedOffsets = {
  confirmed: { offset: 10, nights: 4 },
  upcoming: { offset: 18, nights: 6 },
  'checked-in': { offset: -1, nights: 4 },
  completed: { offset: -20, nights: 5 },
  cancelled: { offset: 7, nights: 3 },
};

const buildSeed = () => {
  const fromMock = MOCK_RESERVATIONS.map((item) => {
    const range = seedOffsets[item.status] || seedOffsets.confirmed;
    const dates = shiftRange(range.offset, item.nights || range.nights);
    return normalizeBooking({
      ...item,
      ...dates,
      confirmationNumber: item.id.startsWith('OB-') ? item.id : `OB-${item.id}`,
      id: item.id.startsWith('OB-') ? item.id : `OB-${item.id}`,
      guestName: 'Aytac Qonaq',
      guestEmail: 'qonaq@aehotel.com',
      guestPhone: '+994 50 123 45 67',
      priceBreakdown: {
        nights: dates.nights,
        basePrice: item.pricePerNight * dates.nights,
        extraGuestFee: 0,
        subtotal: item.pricePerNight * dates.nights,
        taxRate: 0.18,
        tax: Math.round(item.pricePerNight * dates.nights * 0.18 * 100) / 100,
        total: item.totalPrice,
      },
    });
  });

  const extra = [
    normalizeBooking({
      id: 'OB-OCC101',
      confirmationNumber: 'OB-OCC101',
      status: 'confirmed',
      hotelId: 1,
      hotelName: 'Çendu Corinthia',
      hotelImage: MOCK_RESERVATIONS[0].hotelImage,
      location: 'Çendu, Çin',
      roomId: 101,
      roomType: 'Standart Otaq',
      pricePerNight: 420,
      guests: 2,
      ...shiftRange(2, 3),
      totalPrice: 1260,
      guestName: 'Leyla Əliyeva',
      guestEmail: 'leyla@mail.com',
      guestPhone: '+994 55 111 22 33',
      bookingDate: new Date().toISOString(),
    }),
    normalizeBooking({
      id: 'OB-OCC102',
      confirmationNumber: 'OB-OCC102',
      status: 'checked-in',
      hotelId: 1,
      hotelName: 'Çendu Corinthia',
      hotelImage: MOCK_RESERVATIONS[0].hotelImage,
      location: 'Çendu, Çin',
      roomId: 102,
      roomType: 'Deluxe Room',
      pricePerNight: 580,
      guests: 2,
      ...shiftRange(-2, 5),
      totalPrice: 2900,
      guestName: 'Rəşad Məmmədov',
      guestEmail: 'reshad@mail.com',
      guestPhone: '+994 70 444 55 66',
      bookingDate: new Date().toISOString(),
    }),
  ];

  return [...fromMock, ...extra];
};

const ensureSeed = () => {
  if (typeof localStorage === 'undefined') return;
  if (localStorage.getItem(SEEDED_KEY) === '1') return;
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (!existing.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buildSeed()));
  }
  localStorage.setItem(SEEDED_KEY, '1');
};

export const getAllBookings = () => {
  ensureSeed();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').map(normalizeBooking);
  } catch {
    return [];
  }
};

export const saveAllBookings = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  localStorage.setItem('userBookings', JSON.stringify(list));
};

export const getBookingById = (id) =>
  getAllBookings().find(
    (booking) => String(booking.id) === String(id) || booking.confirmationNumber === String(id)
  );

export const addBooking = (booking) => {
  const list = getAllBookings();
  const next = normalizeBooking(booking);
  list.unshift(next);
  saveAllBookings(list);
  return next;
};

export const updateBooking = (id, patch) => {
  const list = getAllBookings();
  const index = list.findIndex((booking) => String(booking.id) === String(id));
  if (index === -1) return null;
  list[index] = normalizeBooking({ ...list[index], ...patch });
  saveAllBookings(list);
  return list[index];
};

export const datesOverlap = (startA, endA, startB, endB) => {
  const aStart = new Date(startA);
  const aEnd = new Date(endA);
  const bStart = new Date(startB);
  const bEnd = new Date(endB);
  return aStart < bEnd && aEnd > bStart;
};

export const hasActiveBookingOverlap = (roomId, checkIn, checkOut, exceptId) => {
  if (!roomId || !checkIn || !checkOut) return false;
  return getAllBookings().some((booking) => {
    if (exceptId && String(booking.id) === String(exceptId)) return false;
    if (booking.status === 'cancelled' || booking.status === 'checked-out') return false;
    if (String(booking.roomId) !== String(roomId)) return false;
    return datesOverlap(booking.checkIn, booking.checkOut, checkIn, checkOut);
  });
};

export const hasCompletedStay = (hotelId) =>
  getAllBookings().some(
    (booking) => String(booking.hotelId) === String(hotelId) && booking.status === 'checked-out'
  );

export const getBookingStats = (bookings = getAllBookings()) => ({
  upcoming: bookings.filter((b) => b.status === 'confirmed' || b.status === 'checked-in').length,
  completed: bookings.filter((b) => b.status === 'checked-out').length,
  cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  total: bookings.length,
});
