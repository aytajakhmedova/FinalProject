import { getAuthToken } from "./auth";

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
    if (response.status === 401) {
      throw new Error(data.message || "Daxil olmaq lazımdır.");
    }
    if (response.status === 403) {
      throw new Error(data.message || "Bu əməliyyat üçün admin hüququ lazımdır.");
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
  const image = resolveImage(hotel.imageFile);
  return {
    ...hotel,
    reviews: hotel.reviewCount,
    mainImage: image,
    images: image ? [image] : [],
    amenities: hotel.amenities || [],
    checkIn: hotel.checkInTime,
    checkOut: hotel.checkOutTime,
    rooms: (hotel.rooms || []).map(mapRoom),
  };
}

export function mapTour(tour) {
  const image = resolveImage(tour.imageFile);
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
export const updateBookingDetails = (id, booking) => request(`/api/bookings/${id}`, { method: "PUT", body: JSON.stringify(booking) }).then(mapBooking);
export const updateBookingStatus = (id, status) => request(`/api/bookings/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }).then(mapBooking);

export const getPayments = () => request("/api/payments");
export const updatePaymentStatus = (id, status) => request(`/api/payments/${id}`, { method: "PUT", body: JSON.stringify({ status }) });

export const getSiteContent = () => request("/api/site");
export const getSiteCities = () => request("/api/site/cities");
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
