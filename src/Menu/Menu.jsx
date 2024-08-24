import React from 'react';
import { ElementMenu } from './ElementMenu/ElementMenu';
import './Menu.style.css';
export const Menu = ({ heroes, scores, handleSpeedChange, handleAttackSpeedChange }) => {
  return (
    <div className="menu">
      <ElementMenu
        hero={heroes[0]}
        onSpeedChange={handleSpeedChange}
        onAttackSpeedChange={handleAttackSpeedChange}
      />
      {/* Отображение счета */}
      <div className="scoreboard">
        Счет: {scores[0]} - {scores[1]}
      </div>
      <ElementMenu
        hero={heroes[1]}
        onSpeedChange={handleSpeedChange}
        onAttackSpeedChange={handleAttackSpeedChange}
      />
    </div>
  );
};
