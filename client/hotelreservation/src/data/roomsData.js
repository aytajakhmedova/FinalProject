// Date helpers for room booking pages. Availability and prices come from the server.

const MONTHS = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
  'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr',
];

export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

export const getMinCheckInDate = () => new Date().toISOString().split('T')[0];

export const getMinCheckOutDate = (checkInDate) => {
  const date = checkInDate ? new Date(checkInDate) : new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
};
