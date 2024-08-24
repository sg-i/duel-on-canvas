import React, { useEffect, useState } from 'react';
import './ElementMenu.style.css';
export const ElementMenu = ({ hero, onSpeedChange, onAttackSpeedChange }) => {
  // Локальные состояния для хранения значений параметров героя
  const [speed, setSpeed] = useState(hero.speed);
  const [attackSpeed, setAttackSpeed] = useState(hero.attackSpeed);

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
    setAttackSpeed(hero.attackSpeed);
    setSpeed(hero.speed);
  }, [hero]);

  return (
    <div className="inputs">
      <label>
        Скорость передвижения
        <input type="range" min="1" max="10" value={speed} onChange={handleSpeedChange} />
      </label>
      <label>
        Скорость атаки
        <input
          type="range"
          min="1"
          max="35"
          value={attackSpeed}
          onChange={handleAttackSpeedChange}
        />
      </label>
    </div>
  );
};
