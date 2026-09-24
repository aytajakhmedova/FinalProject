import React, { useState, useEffect, useRef } from 'react';
import { FaHotel, FaUsers, FaGlobeAmericas, FaStar } from 'react-icons/fa';
import './Stats.css';

const Stats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

  const stats = [
    { icon: <FaHotel />, value: 2500, suffix: '+', label: 'Luxury Hotels', color: '#667eea' },
    { icon: <FaUsers />, value: 15000, suffix: '+', label: 'Happy Customers', color: '#f43f5e' },
    { icon: <FaGlobeAmericas />, value: 180, suffix: '+', label: 'Countries', color: '#4ade80' },
    { icon: <FaStar />, value: 98, suffix: '%', label: 'Satisfaction Rate', color: '#fbbf24' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  const Counter = ({ target, suffix }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      const duration = 2000;
      const steps = 60;
      const stepValue = target / steps;
      const stepDuration = duration / steps;

      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setCount(Math.floor(stepValue * currentStep));
        } else {
          setCount(target);
          clearInterval(timer);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }, [isVisible, target]);

    return (
      <span className="stat-value">
        {count.toLocaleString()}{suffix}
      </span>
    );
  };

  return (
    <section className="stats-section" ref={statsRef}>
      <div className="stats-container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                {stat.icon}
              </div>
              <Counter target={stat.value} suffix={stat.suffix} />
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
