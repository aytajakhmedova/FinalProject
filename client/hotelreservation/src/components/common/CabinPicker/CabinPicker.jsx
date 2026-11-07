import React from 'react';
import './CabinPicker.css';

// The travel classes of a flight (economy, business, first) with their prices; the guest picks one.
const CabinPicker = ({ cabins = [], value, onChange, party = 1 }) => {
  if (cabins.length === 0) return null;
  return (
    <div className="cabin-picker" role="radiogroup" aria-label="Səyahət sinfi">
      {cabins.map((item) => {
        const full = item.seatsAvailable < party;
        return (
          <button
            type="button"
            key={item.cabinClass}
            role="radio"
            aria-checked={item.cabinClass === value}
            disabled={full}
            className={`cabin-chip ${item.cabinClass === value ? 'active' : ''}`}
            onClick={() => onChange(item.cabinClass)}
          >
            <strong>{item.label}</strong>
            <span>₼{item.price}</span>
            <small>{full ? 'Yer yoxdur' : `${item.seatsAvailable} yer`}</small>
          </button>
        );
      })}
    </div>
  );
};

export default CabinPicker;
