export const getYoutubeId = (url = '') => {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return match ? match[1] : '';
};

// A country is pictured by the first of its hotels that has a photo, so the picture comes from the server.
export const countryImages = (hotels = []) => {
  const images = {};
  hotels.forEach((hotel) => {
    if (hotel.country && !images[hotel.country] && hotel.mainImage) images[hotel.country] = hotel.mainImage;
  });
  return images;
};

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
