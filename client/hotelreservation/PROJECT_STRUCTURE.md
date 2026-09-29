# OtelBurada - Premium Hotel Reservation System
## Layihə Strukturu

```
src/
├── pages/
│   ├── Home/
│   │   ├── Home.jsx
│   │   └── Home.css
│   ├── Rooms/
│   │   ├── Rooms.jsx
│   │   └── Rooms.css
│   ├── RoomDetails/
│   │   ├── RoomDetails.jsx
│   │   └── RoomDetails.css
│   ├── Booking/
│   │   ├── Booking.jsx
│   │   └── Booking.css
│   ├── About/
│   ├── Restaurant/
│   ├── Spa/
│   ├── Gallery/
│   ├── Contact/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ForgotPassword.jsx
│   ├── Dashboard/
│   │   ├── Dashboard.jsx
│   │   ├── MyReservations.jsx
│   │   ├── ReservationDetails.jsx
│   │   └── Profile.jsx
│   └── Admin/
│       ├── AdminDashboard.jsx
│       ├── AdminRooms.jsx
│       ├── AdminBookings.jsx
│       └── OccupancyCalendar.jsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar/
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.css
│   │   └── Footer/
│   │       ├── Footer.jsx
│   │       └── Footer.css
│   ├── home/
│   │   ├── Hero/
│   │   ├── FeaturedRooms/
│   │   ├── Services/
│   │   ├── Testimonials/
│   │   └── Gallery/
│   ├── common/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Loading/
│   │   ├── Modal/
│   │   └── DatePicker/
│   └── booking/
│       ├── BookingForm/
│       ├── RoomCard/
│       └── SearchBar/
│
├── layouts/
│   ├── MainLayout.jsx
│   ├── AuthLayout.jsx
│   └── AdminLayout.jsx
│
├── routes/
│   └── AppRoutes.jsx
│
├── context/
│   ├── ThemeContext.jsx
│   └── AuthContext.jsx
│
├── data/
│   ├── rooms.js
│   ├── services.js
│   └── testimonials.js
│
├── assets/
│   └── images/
│
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

## Səhifələr (Azərbaycan dilində)

### İctimai Səhifələr:
- Ana Səhifə (Home)
- Otaqlar (Rooms)
- Otaq Detalları (Room Details)
- Rezervasiya (Booking)
- Haqqımızda (About)
- Restoran (Restaurant)
- SPA
- Qalereya (Gallery)
- Əlaqə (Contact)

### Autentifikasiya:
- Daxil Ol (Login)
- Qeydiyyat (Register)
- Şifrəni Unutdum (Forgot Password)

### İstifadəçi Paneli:
- İdarə Paneli (Dashboard)
- Rezervasiyalarım (My Reservations)
- Rezervasiya Detalları (Reservation Details)
- Profil (Profile)

### Admin Paneli:
- Admin İdarə Paneli (Admin Dashboard)
- Otaq İdarəetməsi (Room Management)
- Rezervasiya İdarəetməsi (Booking Management)
- Doluluk Təqvimi (Occupancy Calendar)
