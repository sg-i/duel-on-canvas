import React, { useState } from 'react';

const HeroMenu = ({ hero, onClose, onColorChange, onSpeedChange }) => {
  const [color, setColor] = useState(hero.color);
  const [speed, setSpeed] = useState(hero.speed);

  const handleColorChange = (e) => {
    setColor(e.target.value);
    onColorChange(hero, e.target.value);
  };

  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);
    onSpeedChange(hero, newSpeed);
  };

  return (
    <div className="menu">
      <h3>Настройки Героя</h3>
      <label>
        Цвет заклинаний:
        <input type="color" value={color} onChange={handleColorChange} />
      </label>
      <br />
      <label>
        Скорость передвижения:
        <input type="range" min="1" max="10" value={speed} onChange={handleSpeedChange} />
      </label>
      <br />
      <button onClick={onClose}>Закрыть</button>
    </div>
  );
};

export default HeroMenu;
