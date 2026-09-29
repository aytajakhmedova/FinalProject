import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
import Home from '../pages/Home/Home';
import Rooms from '../pages/Rooms/Rooms';
import RoomDetails from '../pages/RoomDetails/RoomDetails';
import Booking from '../pages/Booking/Booking';
import About from '../pages/About/About';
import Restaurant from '../pages/Restaurant/Restaurant';
import Spa from '../pages/Spa/Spa';
import Gallery from '../pages/Gallery/Gallery';
import Contact from '../pages/Contact/Contact';

// Auth Pages
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword';

// User Dashboard
import Dashboard from '../pages/Dashboard/Dashboard';
import MyReservations from '../pages/Dashboard/MyReservations';
import ReservationDetails from '../pages/Dashboard/ReservationDetails';
import Profile from '../pages/Dashboard/Profile';

// Admin Pages
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminRooms from '../pages/Admin/AdminRooms';
import AdminBookings from '../pages/Admin/AdminBookings';
import OccupancyCalendar from '../pages/Admin/OccupancyCalendar';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/otaqlar" element={<Rooms />} />
        <Route path="/otaq/:id" element={<RoomDetails />} />
        <Route path="/rezervasiya" element={<Booking />} />
        <Route path="/haqqimizda" element={<About />} />
        <Route path="/restoran" element={<Restaurant />} />
        <Route path="/spa" element={<Spa />} />
        <Route path="/qalereya" element={<Gallery />} />
        <Route path="/elaqe" element={<Contact />} />
      </Route>

      {/* Auth Routes with AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/daxil-ol" element={<Login />} />
        <Route path="/qeydiyyat" element={<Register />} />
        <Route path="/sifreni-unut" element={<ForgotPassword />} />
      </Route>

      {/* User Dashboard Routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/hesab" element={<Dashboard />} />
        <Route path="/rezervasiyalarim" element={<MyReservations />} />
        <Route path="/rezervasiya/:id" element={<ReservationDetails />} />
        <Route path="/profil" element={<Profile />} />
      </Route>

      {/* Admin Routes with AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="otaqlar" element={<AdminRooms />} />
        <Route path="rezervasiyalar" element={<AdminBookings />} />
        <Route path="teqvim" element={<OccupancyCalendar />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
