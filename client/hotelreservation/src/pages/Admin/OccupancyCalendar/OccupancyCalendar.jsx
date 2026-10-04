import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaBed, FaCheckCircle } from 'react-icons/fa';
import './OccupancyCalendar.css';

const OccupancyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock room data
  const rooms = [
    { id: 1, number: '101', type: 'Standard Room', capacity: 2 },
    { id: 2, number: '102', type: 'Deluxe Room', capacity: 3 },
    { id: 3, number: '103', type: 'Suite', capacity: 4 },
    { id: 4, number: '201', type: 'Standard Room', capacity: 2 },
    { id: 5, number: '202', type: 'Deluxe Room', capacity: 3 },
    { id: 6, number: '203', type: 'Executive Suite', capacity: 5 },
    { id: 7, number: '301', type: 'Standard Room', capacity: 2 },
    { id: 8, number: '302', type: 'Presidential Suite', capacity: 6 },
  ];

  // Mock reservation data - [startDay, endDay]
  const reservations = {
    1: [[5, 8], [15, 18]],
    2: [[3, 7], [12, 15], [20, 25]],
    3: [[10, 14]],
    4: [[1, 5], [18, 22]],
    5: [[7, 10], [16, 20]],
    6: [[2, 6], [14, 18], [25, 28]],
    7: [[9, 12], [19, 23]],
    8: [[4, 8], [17, 21], [26, 30]],
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('az-AZ', { month: 'long', year: 'numeric' });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isRoomOccupied = (roomId, day) => {
    const roomReservations = reservations[roomId] || [];
    return roomReservations.some(([start, end]) => day >= start && day <= end);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const totalRooms = rooms.length;
  const occupiedRoomsPerDay = days.map(day => 
    rooms.filter(room => isRoomOccupied(room.id, day)).length
  );

  const averageOccupancy = (
    (occupiedRoomsPerDay.reduce((sum, count) => sum + count, 0) / (totalRooms * daysInMonth)) * 100
  ).toFixed(1);

  return (
    <div className="occupancy-calendar-page">
      <div className="calendar-header">
        <div className="header-title">
          <FaCalendarAlt />
          <h1>Doluluq Təqvimi</h1>
        </div>
        <p className="header-subtitle">Otaqların doluluğunu izləyin və rezervasiyaları idarə edin</p>
      </div>

      {/* Statistics */}
      <div className="calendar-stats">
        <div className="stat-card">
          <div className="stat-icon rooms">
            <FaBed />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalRooms}</div>
            <div className="stat-label">Cəmi Otaq</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon occupancy">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <div className="stat-value">{averageOccupancy}%</div>
            <div className="stat-label">Orta Doluluq</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon available">
            <FaBed />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {totalRooms - occupiedRoomsPerDay[new Date().getDate() - 1] || totalRooms}
            </div>
            <div className="stat-label">Bu gün Boş</div>
          </div>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="calendar-controls">
        <button className="btn-month-nav" onClick={previousMonth}>
          <FaChevronLeft />
        </button>
        <h2 className="current-month">{getMonthName(currentDate)}</h2>
        <button className="btn-month-nav" onClick={nextMonth}>
          <FaChevronRight />
        </button>
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-indicator available"></span>
          <span>Boş</span>
        </div>
        <div className="legend-item">
          <span className="legend-indicator occupied"></span>
          <span>Dolu</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid-container">
        <div className="calendar-grid">
          {/* Header - Days */}
          <div className="grid-header">
            <div className="room-column-header">Otaq</div>
            {days.map(day => (
              <div key={day} className="day-header">
                {day}
              </div>
            ))}
          </div>

          {/* Rows - Rooms */}
          {rooms.map(room => (
            <div key={room.id} className="grid-row">
              <div className="room-info">
                <div className="room-number">#{room.number}</div>
                <div className="room-type">{room.type}</div>
                <div className="room-capacity">{room.capacity} nəfər</div>
              </div>
              {days.map(day => (
                <div
                  key={day}
                  className={`day-cell ${isRoomOccupied(room.id, day) ? 'occupied' : 'available'}`}
                  title={isRoomOccupied(room.id, day) ? 'Dolu' : 'Boş'}
                >
                  {isRoomOccupied(room.id, day) && (
                    <span className="occupied-indicator">●</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Daily Occupancy Chart */}
      <div className="daily-occupancy-section">
        <h3>Gündəlik Doluluq</h3>
        <div className="occupancy-chart">
          {days.map(day => {
            const occupiedCount = occupiedRoomsPerDay[day - 1];
            const percentage = ((occupiedCount / totalRooms) * 100).toFixed(0);
            
            return (
              <div key={day} className="chart-bar">
                <div 
                  className="bar-fill" 
                  style={{ height: `${percentage}%` }}
                  title={`${day} - ${occupiedCount}/${totalRooms} otaq dolu (${percentage}%)`}
                ></div>
                <div className="bar-label">{day}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OccupancyCalendar;
