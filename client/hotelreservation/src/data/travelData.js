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

// Hotel prices are stored and shown in AZN.
export const formatPrice = (aznAmount) => `₼${Math.round(aznAmount)}`;
