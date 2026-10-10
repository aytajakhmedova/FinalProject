import { MOCK_REVIEWS } from '../data/reviewsData';
import { getAllBookings } from './bookingsStore';

const STORAGE_KEY = 'otelburada_reviews';
const SEEDED_KEY = 'otelburada_reviews_seeded_v1';

const seedReviews = () => Object.values(MOCK_REVIEWS).flat();

const ensureSeed = () => {
  if (typeof localStorage === 'undefined') return;
  if (localStorage.getItem(SEEDED_KEY) === '1') return;
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (!existing.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedReviews()));
  }
  localStorage.setItem(SEEDED_KEY, '1');
};

export const getAllReviews = () => {
  ensureSeed();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

export const getReviewsForHotel = (hotelId) =>
  getAllReviews().filter((review) => String(review.hotelId) === String(hotelId));

export const hasReviewForBooking = (bookingId) =>
  getAllReviews().some((review) => review.bookingId && String(review.bookingId) === String(bookingId));

export const getReviewableStays = (hotelId, email) => {
  const normalized = (email || '').trim().toLowerCase();
  if (!normalized || !hotelId) return [];
  return getAllBookings().filter((booking) => {
    const guest = (booking.guestEmail || '').trim().toLowerCase();
    return (
      String(booking.hotelId) === String(hotelId) &&
      booking.status === 'checked-out' &&
      guest === normalized &&
      !hasReviewForBooking(booking.id)
    );
  });
};

export const addStayReview = (review) => {
  if (!review?.bookingId) {
    throw new Error('Rəy tamamlanmış qalmaya bağlanmalıdır');
  }
  if (hasReviewForBooking(review.bookingId)) {
    throw new Error('Bu qalma üçün artıq rəy yazılıb');
  }
  const list = getAllReviews();
  const next = {
    ...review,
    id: review.id || Date.now(),
    verified: true,
    helpful: 0,
    date: review.date || new Date().toISOString(),
  };
  list.unshift(next);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return next;
};
