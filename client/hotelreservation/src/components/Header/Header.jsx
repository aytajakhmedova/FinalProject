import React, { useState } from 'react';
import { FaHotel, FaPlane, FaCar, FaTaxi } from 'react-icons/fa';
import { IoNotifications } from 'react-icons/io5';
import { MdKeyboardArrowDown, MdMoreHoriz, MdDarkMode, MdLightMode } from 'react-icons/md';
import logo from '../../assets/images/logo.png';
import './Header.css';

const Header = ({ darkMode, toggleDarkMode }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const menuItems = [
    { name: 'İlanlar', hasDropdown: true },
    { name: 'Sayfalar', hasDropdown: true },
    { name: 'Hesaplar', hasDropdown: true },
  ];

  const navItems = [
    { icon: <FaHotel />, text: 'Otel' },
    { icon: <FaPlane />, text: 'Uçuş' },
    { icon: <FaCar />, text: 'Tur' },
    { icon: <FaTaxi />, text: 'Taksi' }
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo">
            <img 
              src={logo} 
              alt="OtelBurada" 
              className="logo-image"
              onError={(e) => {
                console.log('Logo yüklənmədi!');
                e.target.style.border = '2px solid red';
              }}
              onLoad={() => console.log('Logo uğurla yükləndi!')}
            />
          </div>
          
          <nav className="main-nav">
            {menuItems.map((item, index) => (
              <div 
                key={index} 
                className="nav-item"
                onMouseEnter={() => setActiveMenu(item.name)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <span>{item.name}</span>
                {item.hasDropdown && <MdKeyboardArrowDown className="dropdown-arrow" />}
              </div>
            ))}
            <div className="nav-item more">
              <MdMoreHoriz />
            </div>
          </nav>
        </div>

        <div className="header-right">
          <div className="quick-nav">
            {navItems.map((item, index) => (
              <button key={index} className="quick-nav-btn">
                <span className="icon">{item.icon}</span>
                <span className="text">{item.text}</span>
              </button>
            ))}
          </div>

          <div className="user-actions">
            <button className="theme-toggle-btn" onClick={toggleDarkMode}>
              {darkMode ? <MdLightMode /> : <MdDarkMode />}
            </button>
            <button className="notification-btn">
              <IoNotifications />
            </button>
            <div className="user-profile">
              <img src="/avatar.png" alt="User" className="avatar" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
