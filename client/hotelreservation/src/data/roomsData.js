// Room availability and booking utilities

// Mock unavailable dates for rooms
export const UNAVAILABLE_DATES = {
  101: ['2024-11-25', '2024-11-26', '2024-12-24', '2024-12-25', '2024-12-31', '2025-01-01'],
  102: ['2024-12-01', '2024-12-02', '2024-12-15'],
  103: ['2024-11-20', '2024-11-21', '2024-12-10'],
  201: ['2024-12-20', '2024-12-21', '2024-12-22'],
  301: ['2024-11-28', '2024-11-29', '2024-11-30'],
  401: ['2024-12-05', '2024-12-06'],
  501: ['2024-12-24', '2024-12-25', '2024-12-26']
};

/**
 * Check if room is available for given date range
 * @param {number} roomId - Room ID
 * @param {string} checkIn - Check-in date (YYYY-MM-DD)
 * @param {string} checkOut - Check-out date (YYYY-MM-DD)
 * @returns {boolean} - Is available
 */
export const checkRoomAvailability = (roomId, checkIn, checkOut) => {
  if (!checkIn || !checkOut) return true;
  
  const unavailableDates = UNAVAILABLE_DATES[roomId] || [];
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  
  // Check each date in range
  let currentDate = new Date(start);
  while (currentDate < end) {
    const dateString = currentDate.toISOString().split('T')[0];
    if (unavailableDates.includes(dateString)) {
      return false;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return true;
};

/**
 * Calculate number of nights between two dates
 * @param {string} checkIn - Check-in date (YYYY-MM-DD)
 * @param {string} checkOut - Check-out date (YYYY-MM-DD)
 * @returns {number} - Number of nights
 */
export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Calculate total price for room booking
 * @param {number} pricePerNight - Price per night
 * @param {string} checkIn - Check-in date (YYYY-MM-DD)
 * @param {string} checkOut - Check-out date (YYYY-MM-DD)
 * @param {number} guests - Number of guests
 * @returns {object} - Price breakdown
 */
export const calculateRoomPrice = (pricePerNight, checkIn, checkOut, guests = 1) => {
  const nights = calculateNights(checkIn, checkOut);
  
  if (nights === 0) {
    return {
      nights: 0,
      basePrice: 0,
      extraGuestFee: 0,
      subtotal: 0,
      taxRate: 0.18,
      tax: 0,
      total: 0
    };
  }
  
  const basePrice = pricePerNight * nights;
  
  // Extra guest fee: ₼50 per night for each guest beyond capacity of 2
  const extraGuests = Math.max(0, guests - 2);
  const extraGuestFee = extraGuests * 50 * nights;
  
  const subtotal = basePrice + extraGuestFee;
  const taxRate = 0.18; // 18% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  
  return {
    nights,
    basePrice,
    extraGuestFee,
    subtotal,
    taxRate,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100
  };
};

/**
 * Get available dates for room (next 90 days excluding unavailable)
 * @param {number} roomId - Room ID
 * @returns {Array<string>} - Available dates
 */
export const getAvailableDates = (roomId) => {
  const unavailableDates = UNAVAILABLE_DATES[roomId] || [];
  const availableDates = [];
  const today = new Date();
  
  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    
    if (!unavailableDates.includes(dateString)) {
      availableDates.push(dateString);
    }
  }
  
  return availableDates;
};

/**
 * Format date for display
 * @param {string} dateString - Date string (YYYY-MM-DD)
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
    'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
};

/**
 * Get minimum check-in date (today)
 * @returns {string} - Date string (YYYY-MM-DD)
 */
export const getMinCheckInDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Get minimum check-out date (tomorrow or day after check-in)
 * @param {string} checkInDate - Check-in date
 * @returns {string} - Date string (YYYY-MM-DD)
 */
export const getMinCheckOutDate = (checkInDate) => {
  if (!checkInDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }
  
  const date = new Date(checkInDate);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
};
