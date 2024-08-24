import React, { useState, useRef } from 'react';
import './ColorPicker.style.css'; // Убедитесь, что этот файл существует и содержит стили для ColorPicker

const ColorPicker = ({ hero, x, y, onClose, onColorChange }) => {
  const [color, setColor] = useState(hero.color); // Начальный цвет
  const colorInputRef = useRef(null);

  // Обработчик изменения цвета
  const handleChange = (e) => {
    setColor(e.target.value);
    onColorChange(e.target.value); // Передаем выбранный цвет родительскому компоненту
  };

  // Обработчик клика вне ColorPicker для закрытия
  const handleClickOutside = (e) => {
    if (colorInputRef.current && !colorInputRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Добавляем обработчик клика вне ColorPicker при монтировании компонента
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="color-picker" style={{ left: x, top: y }} ref={colorInputRef}>
      <input type="color" value={color} onChange={handleChange} />
      <button onClick={onClose}>Закрыть</button>
    </div>
  );
};

export default ColorPicker;
