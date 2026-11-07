import { getAuthToken } from "./auth";

// Shown only when the server has no picture for an item, so an <img> is never left broken.
export const IMAGE_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#2a1d12"/>' +
      '<text x="50%" y="50%" fill="#c9ac89" font-family="sans-serif" font-size="28" text-anchor="middle">AE Hotel</text></svg>',
  );

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5080";

const imageModules = import.meta.glob("../assets/images/*", { eager: true, import: "default" });

export function resolveImage(fileName) {
  if (!fileName) return "";
  if (fileName.startsWith("http") || fileName.startsWith("blob:")) return fileName;
  if (fileName.startsWith("/uploads") || fileName.startsWith("/api")) {
    return `${API_BASE_URL}${fileName}`;
  }
  if (fileName.startsWith("/")) return fileName;
  const match = Object.entries(imageModules).find(([path]) => path.endsWith(`/${fileName}`));
  return match ? match[1] : `${API_BASE_URL}/uploads/${fileName}`;
}

async function request(path, options = {}) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    // Enhanced error handling with specific status codes
    if (response.status === 400) {
      throw new Error(data.message || "Daxil edilmiş məlumatlar düzgün deyil.");
    }
    if (response.status === 401) {
      throw new Error(data.message || "Daxil olmaq lazımdır.");
    }
    if (response.status === 403) {
      throw new Error(data.message || "Bu əməliyyat üçün icazəniz yoxdur.");
    }
    if (response.status === 404) {
      throw new Error(data.message || "Axtarılan məlumat tapılmadı.");
    }
    if (response.status === 409) {
      throw new Error(data.message || "Bu əməliyyat mövcud məlumatlarla ziddiyyət təşkil edir.");
    }
    if (response.status === 500) {
      throw new Error(data.message || "Server xətası baş verdi. Zəhmət olmasa dəstək ilə əlaqə saxlayın.");
    }
    throw new Error(data.message || `Sorğu alınmadı (${response.status})`);
  }
  return data;
}

export function mapRoom(room) {
  const image = resolveImage(room.imageFile);
  return {
    ...room,
    hotelName: room.hotelName || "",
    images: image ? [image] : [],
    amenities: room.amenities || [],
    available: room.available,
    isAvailable: room.isAvailable,
  };
}

export function mapHotel(hotel) {
  // Every picture comes from the server: the saved gallery, or else the hotel's main image.
  const saved = (hotel.galleryImages || []).map(resolveImage).filter(Boolean);
  const main = resolveImage(hotel.imageFile);
  const images = saved.length ? [...new Set(saved)] : [main || IMAGE_PLACEHOLDER];
  const image = images[0];
  return {
    ...hotel,
    reviews: hotel.reviewCount,
    mainImage: image,
    images,
    amenities: hotel.amenities || [],
    checkIn: hotel.checkInTime,
    checkOut: hotel.checkOutTime,
    rooms: (hotel.rooms || []).map(mapRoom),
  };
}

export function mapTour(tour) {
  const image = resolveImage(tour.imageFile) || IMAGE_PLACEHOLDER;
  return {
    ...tour,
    reviews: tour.reviewCount,
    image,
    images: image ? [image] : [],
    highlights: tour.highlights || [],
    included: tour.included || [],
    excluded: tour.excluded || [],
    itinerary: tour.itinerary || [],
    availableDates: tour.availableDates || [],
  };
}

export function mapFlight(flight) {
  const depart = new Date(flight.departureAt);
  const arrive = new Date(flight.arrivalAt);
  const time = (value) => value.toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" });
  const stops = flight.stops <= 0 ? "Birbaşa" : flight.stops === 1 ? "1 dayanacaq" : "2+ dayanacaq";
  const cabin = flight.cabinClass === "business" ? "Biznes" : flight.cabinClass === "first" ? "Birinci" : "Ekonom";
  return {
    ...flight,
    logo: "✈️",
    departTime: time(depart),
    departLocation: flight.originCode,
    departCity: `${flight.originCity}, ${flight.originCountry}`,
    arriveTime: time(arrive),
    arriveLocation: flight.destinationCode,
    arriveCity: `${flight.destinationCity}, ${flight.destinationCountry}`,
    stops,
    class: cabin,
    seatsLeft: flight.seatsAvailable,
    price: Number(flight.price),
  };
}

export function mapBooking(booking) {
  return {
    ...booking,
    confirmationNumber: booking.code,
    hotelName: booking.hotelName || booking.itemName,
    roomType: booking.roomName || booking.itemName,
    roomId: booking.roomId,
    hotel: {
      id: booking.hotelId,
      name: booking.hotelName,
      title: booking.hotelName,
      location: booking.location,
    },
    room: {
      id: booking.roomId,
      name: booking.roomName,
      pricePerNight: booking.pricePerNight,
    },
    paymentMethod: booking.paymentMethod,
    totalPrice: Number(booking.totalPrice),
    depositPercent: Number(booking.depositPercent) || 0,
    depositAmount: Number(booking.depositAmount) || 0,
    remainingAmount: Number(booking.remainingAmount) || 0,
  };
}

function withQuery(path, params) {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") query.set(key, value);
  });
  const text = query.toString();
  return text ? `${path}?${text}` : path;
}

export const getHotels = (params) => request(withQuery("/api/hotels", params)).then((items) => items.map(mapHotel));
export const quoteHotelStay = (id, stay) => request(`/api/hotels/${id}/quote`, {
  method: "POST", body: JSON.stringify(stay),
});
export const getHotel = (id, params) => request(withQuery(`/api/hotels/${id}`, params)).then(mapHotel);
export const createHotel = (hotel) => request("/api/hotels", { method: "POST", body: JSON.stringify(hotel) }).then(mapHotel);
export const updateHotel = (id, hotel) => request(`/api/hotels/${id}`, { method: "PUT", body: JSON.stringify(hotel) }).then(mapHotel);
export const deleteHotel = (id) => request(`/api/hotels/${id}`, { method: "DELETE" });

export const getRooms = () => request("/api/rooms").then((items) => items.map(mapRoom));
export const getHotelRooms = (hotelId) => request(`/api/hotels/${hotelId}/rooms`).then((items) => items.map(mapRoom));
export const createRoom = (room) => request("/api/rooms", { method: "POST", body: JSON.stringify(room) }).then(mapRoom);
export const updateRoom = (id, room) => request(`/api/rooms/${id}`, { method: "PUT", body: JSON.stringify(room) }).then(mapRoom);
export const deleteRoom = (id) => request(`/api/rooms/${id}`, { method: "DELETE" });
export const quoteRoom = (id, params) => request(withQuery(`/api/rooms/${id}/quote`, params));

export const getFlights = (params) => request(withQuery("/api/flights", params)).then((items) => items.map(mapFlight));
export const listFlights = (params) => request(withQuery("/api/flights", params));
export const createFlight = (flight) => request("/api/flights", { method: "POST", body: JSON.stringify(flight) });
export const updateFlight = (id, flight) => request(`/api/flights/${id}`, { method: "PUT", body: JSON.stringify(flight) });
export const deleteFlight = (id) => request(`/api/flights/${id}`, { method: "DELETE" });
export const getTours = (params) => request(withQuery("/api/tours", params)).then((items) => items.map(mapTour));
export const getTour = (id) => request(`/api/tours/${id}`).then(mapTour);
export const listTours = () => request("/api/tours");
export const createTour = (tour) => request("/api/tours", { method: "POST", body: JSON.stringify(tour) });
export const updateTour = (id, tour) => request(`/api/tours/${id}`, { method: "PUT", body: JSON.stringify(tour) });
export const deleteTour = (id) => request(`/api/tours/${id}`, { method: "DELETE" });

export const getBookings = () => request("/api/bookings").then((items) => items.map(mapBooking));
export const getMyBookings = () => request("/api/bookings/mine").then((items) => items.map(mapBooking));
export const getReservations = () => request("/api/reservations");
export const getBooking = (id) => request(`/api/bookings/${id}`).then(mapBooking);
export const deleteBooking = (id) => request(`/api/bookings/${id}`, { method: "DELETE" });
export const createBooking = (booking) => request("/api/bookings", { method: "POST", body: JSON.stringify(booking) }).then(mapBooking);
export const getTripSuggestions = (params) => request(withQuery("/api/trip-suggestions", params));
export const getActiveDiscounts = () => request("/api/discounts/active");
export const applyCouponCode = (code) => request(`/api/discounts/coupon/${encodeURIComponent(String(code || "").trim())}`);
export const getDiscounts = () => request("/api/discounts");
export const createDiscount = (item) => request("/api/discounts", { method: "POST", body: JSON.stringify(item) });
export const updateDiscount = (id, item) => request(`/api/discounts/${id}`, { method: "PUT", body: JSON.stringify(item) });
export const deleteDiscount = (id) => request(`/api/discounts/${id}`, { method: "DELETE" });
export const getUsers = () => request("/api/users");
export const updateUserRole = (id, role, assignedHotelId) =>
  request(`/api/users/${id}/role`, { method: "PUT", body: JSON.stringify({ role, assignedHotelId }) });
export const getHotelReviews = (hotelId) => request(`/api/hotels/${hotelId}/reviews`);
export const getMyReviews = () => request("/api/reviews/mine");
export const getAdminReviews = () => request("/api/reviews");
export const createReview = (review) => request("/api/reviews", { method: "POST", body: JSON.stringify(review) });
export const approveReview = (id) => request(`/api/reviews/${id}/approve`, { method: "PUT" });
export const deleteReview = (id) => request(`/api/reviews/${id}`, { method: "DELETE" });
export const updateBookingDetails = (id, booking) => request(`/api/bookings/${id}`, { method: "PUT", body: JSON.stringify(booking) }).then(mapBooking);
export const updateBookingStatus = (id, status) => request(`/api/bookings/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }).then(mapBooking);
export const emailBookingReceipt = (id) => request(`/api/bookings/${id}/email-receipt`, { method: "POST" }).then(mapBooking);

export const getPayments = () => request("/api/payments");
export const updatePaymentStatus = (id, status) => request(`/api/payments/${id}`, { method: "PUT", body: JSON.stringify({ status }) });

export const getSiteContent = () => request("/api/site");
export const getSiteCities = () => request("/api/site/cities");
export const getSiteCountries = () => request("/api/site/countries");
export const getSiteLocations = (city) => request(withQuery("/api/site/locations", { city }));
export const getLocationCountries = () => request("/api/locations/countries");
export const getLocationCities = (countryId) => request(`/api/locations/countries/${countryId}/cities`);
export const getLocationTouristPlaces = (cityId) => request(`/api/locations/cities/${cityId}/tourist-places`);
export const updateSiteSettings = (settings) => request("/api/site/settings", { method: "PUT", body: JSON.stringify(settings) });
export const getSiteMenuItems = () => request("/api/site/menu-items");
export const createSiteMenuItem = (item) => request("/api/site/menu-items", { method: "POST", body: JSON.stringify(item) });
export const updateSiteMenuItem = (id, item) => request(`/api/site/menu-items/${id}`, { method: "PUT", body: JSON.stringify(item) });
export const deleteSiteMenuItem = (id) => request(`/api/site/menu-items/${id}`, { method: "DELETE" });
export const getSiteSlides = () => request("/api/site/slides");
export const createSiteSlide = (item) => request("/api/site/slides", { method: "POST", body: JSON.stringify(item) });
export const updateSiteSlide = (id, item) => request(`/api/site/slides/${id}`, { method: "PUT", body: JSON.stringify(item) });
export const deleteSiteSlide = (id) => request(`/api/site/slides/${id}`, { method: "DELETE" });
export const getSiteAdvantages = () => request("/api/site/advantages");
export const createSiteAdvantage = (item) => request("/api/site/advantages", { method: "POST", body: JSON.stringify(item) });
export const updateSiteAdvantage = (id, item) => request(`/api/site/advantages/${id}`, { method: "PUT", body: JSON.stringify(item) });
export const deleteSiteAdvantage = (id) => request(`/api/site/advantages/${id}`, { method: "DELETE" });

export const getSeasonalPrices = () => request("/api/seasonal-prices");
export const createSeasonalPrice = (item) => request("/api/seasonal-prices", { method: "POST", body: JSON.stringify(item) });
export const updateSeasonalPrice = (id, item) => request(`/api/seasonal-prices/${id}`, { method: "PUT", body: JSON.stringify(item) });
export const deleteSeasonalPrice = (id) => request(`/api/seasonal-prices/${id}`, { method: "DELETE" });

export async function uploadMedia(file) {
  const token = getAuthToken();
  const body = new FormData();
  body.append("file", file);
  const response = await fetch(`${API_BASE_URL}/api/uploads`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Şəkil yüklənmədi (${response.status})`);
  }
  return data;
}

const sameCountry = (left, right) =>
  String(left || "").trim().toLowerCase() === String(right || "").trim().toLowerCase();
const tourCountry = (tour) => String(tour.destination || "").split(",").slice(1).join(",").trim();

// Prefers the country-aware endpoint; falls back to the catalog lists so the checkout still works
// against an API build that does not expose /api/trip-suggestions yet.
export const getTripCountries = () =>
  request("/api/trip-suggestions/countries").catch(() =>
    Promise.all([listFlights(), listTours()]).then(([flights, tours]) => {
      const names = [...flights.map((item) => item.destinationCountry), ...tours.map(tourCountry)]
        .map((name) => String(name || "").trim())
        .filter(Boolean);
      return [...new Set(names)].sort((a, b) => a.localeCompare(b, "az")).map((name) => ({ name, isoCode: "" }));
    })
  );

export const getTripSuggestionsByCountry = ({ country, guests = 1 }) =>
  request(withQuery("/api/trip-suggestions/by-country", { country, guests }))
    .catch(() =>
      Promise.all([listFlights(), listTours()]).then(([flights, tours]) => ({
        flights: flights.filter((item) => sameCountry(item.destinationCountry, country) && item.seatsAvailable >= guests),
        tours: tours.filter((item) =>
          sameCountry(tourCountry(item), country) && guests >= (item.minGuests || 1) && guests <= (item.maxGuests || 99)),
      }))
    )
    .then((result) => ({
      flights: (result.flights || []).map(mapFlight),
      tours: (result.tours || []).map(mapTour),
    }));

export const getCustomers = () => request("/api/customers");
export const getCustomerBookings = (id) => request(`/api/customers/${encodeURIComponent(id)}/bookings`);
export const getStaff = () => request("/api/staff");
export const createStaff = (member) => request("/api/staff", { method: "POST", body: JSON.stringify(member) });
export const updateStaff = (id, member) => request(`/api/staff/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(member) });
export const deleteStaff = (id) => request(`/api/staff/${encodeURIComponent(id)}`, { method: "DELETE" });
export const getReport = (from, to) => {
  const query = new URLSearchParams();
  if (from) query.set("from", from);
  if (to) query.set("to", to);
  const suffix = query.toString();
  return request(`/api/reports${suffix ? `?${suffix}` : ""}`);
};

// City and Country Management
export const getAllCountries = () => request("/api/locations/countries");
export const getAllCities = () => request("/api/locations/cities");
export const getCitiesByCountry = (countryId) => request(`/api/locations/countries/${countryId}/cities`);
export const createCountry = (country) => request("/api/locations/countries", { method: "POST", body: JSON.stringify(country) });
export const updateCountry = (id, country) => request(`/api/locations/countries/${id}`, { method: "PUT", body: JSON.stringify(country) });
export const deleteCountry = (id) => {
  console.log('API deleteCountry called with id:', id);
  return request(`/api/locations/countries/${id}`, { method: "DELETE" })
    .then(result => {
      console.log('API deleteCountry success:', result);
      return result;
    })
    .catch(error => {
      console.error('API deleteCountry error:', error);
      throw error;
    });
};
export const createCity = (city) => request("/api/locations/cities", { method: "POST", body: JSON.stringify(city) });
export const updateCity = (id, city) => request(`/api/locations/cities/${id}`, { method: "PUT", body: JSON.stringify(city) });
export const deleteCity = (id) => {
  console.log('API deleteCity called with id:', id);
  return request(`/api/locations/cities/${id}`, { method: "DELETE" })
    .then(result => {
      console.log('API deleteCity success:', result);
      return result;
    })
    .catch(error => {
      console.error('API deleteCity error:', error);
      throw error;
    });
};
