import React, { useEffect, useState } from 'react';
import './HeroMenu.style.css';
const HeroMenu = ({ hero, onClose, onColorChange, onSpeedChange, onAttackSpeedChange }) => {
  // Локальные состояния для хранения значений параметров героя
  const [color, setColor] = useState(hero.color);
  const [speed, setSpeed] = useState(hero.speed);
  const [attackSpeed, setAttackSpeed] = useState(hero.attackSpeed);

  // Обработчик изменения цвета
  const handleColorChange = (e) => {
    setColor(e.target.value);
    onColorChange(hero.id, e.target.value);
  };

  // Обработчик изменения скорости передвижения
  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);
    onSpeedChange(hero.id, newSpeed);
  };

  // Обработчик изменения скорости атаки
  const handleAttackSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setAttackSpeed(newSpeed);
    onAttackSpeedChange(hero.id, newSpeed);
  };

  // Обновление локальных состояний при изменении данных героя
  useEffect(() => {
    setColor(hero.color);
    setAttackSpeed(hero.attackSpeed);
    setSpeed(hero.speed);
  }, [hero]);

  return (
    <div className="menu">
      <div className="inputs">
        <label>
          Цвет
          <input type="color" value={color} onChange={handleColorChange} />
        </label>
        <label>
          Скорость передвижения
          <input type="range" min="1" max="10" value={speed} onChange={handleSpeedChange} />
        </label>
        <label>
          Скорость атаки
          <input
            type="range"
            min="5"
            max="25"
            value={attackSpeed}
            onChange={handleAttackSpeedChange}
          />
        </label>
      </div>
      {/* Кнопка для закрытия меню */}
      <button onClick={onClose} className="close-button">
        <svg width="100%" height="100%" viewBox="0 0 1024 1024">
          <path
            fill="white"
            d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"
          />
        </svg>
      </button>
    </div>
  );
};

export default HeroMenu;
