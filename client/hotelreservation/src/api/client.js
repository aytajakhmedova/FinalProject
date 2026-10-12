const API_BASE_URL = "http://localhost:5080";

const imageModules = import.meta.glob("../assets/images/*", { eager: true, import: "default" });

export function resolveImage(fileName) {
  if (!fileName) return "";
  if (fileName.startsWith("http") || fileName.startsWith("/") || fileName.startsWith("blob:")) return fileName;
  const match = Object.entries(imageModules).find(([path]) => path.endsWith(`/${fileName}`));
  return match ? match[1] : "";
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Sorğu alınmadı (${response.status})`);
  }
  return data;
}

export function mapRoom(room) {
  const image = resolveImage(room.imageFile);
  return {
    ...room,
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
export const getTours = () => request("/api/tours").then((items) => items.map(mapTour));
export const getTour = (id) => request(`/api/tours/${id}`).then(mapTour);

export const getBookings = () => request("/api/bookings").then((items) => items.map(mapBooking));
export const getBooking = (id) => request(`/api/bookings/${id}`).then(mapBooking);
export const createBooking = (booking) => request("/api/bookings", { method: "POST", body: JSON.stringify(booking) }).then(mapBooking);
export const updateBookingDetails = (id, booking) => request(`/api/bookings/${id}`, { method: "PUT", body: JSON.stringify(booking) }).then(mapBooking);
export const updateBookingStatus = (id, status) => request(`/api/bookings/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }).then(mapBooking);

export const getPayments = () => request("/api/payments");
export const updatePaymentStatus = (id, status) => request(`/api/payments/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
