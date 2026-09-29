import React from 'react';
import Hero from '../../components/home/Hero/Hero';
import FeaturedRooms from '../../components/home/FeaturedRooms/FeaturedRooms';
import Services from '../../components/home/Services/Services';
import About from '../../components/home/About/About';
import Testimonials from '../../components/home/Testimonials/Testimonials';
import Gallery from '../../components/home/Gallery/Gallery';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <About />
      <FeaturedRooms />
      <Services />
      <Gallery />
      <Testimonials />
    </div>
  );
};

export default Home;
