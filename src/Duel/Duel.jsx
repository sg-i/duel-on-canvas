import React, { useRef, useState, useEffect } from 'react';
import HeroMenu from '../ColorPicker/ColorPicker';
import './Duel.style.css';
import { Menu } from '../Menu/Menu';
import ColorPicker from '../ColorPicker/ColorPicker';

// Ширина полотна
const WIDTH = 800;
// Высота полотна
const HEIGHT = 550;
// Размер героя
const HERO_SIZE = 25;
// Размер заклинания
const SPELL_SIZE = HERO_SIZE / 4;

export const Duel = () => {
  // Открытие выбора цвета героя
  const [colorPickerPosition, setColorPickerPosition] = useState({ x: 0, y: 0 });
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  // Текущий выбранный герой
  const [selectedHero, setSelectedHero] = useState(null);
  // Очки попаданий
  const [scores, setScores] = useState([0, 0]);

  // Refs для canvas и координат курсора
  const canvasRef = useRef(null);
  const cursorX = useRef(0);
  const cursorY = useRef(0);
  const lastToggleTime = useRef(0);
  const intervalIdsRef = useRef([]);
  // Ref с героями
  const heroesRef = useRef([
    {
      id: 0,
      x: HERO_SIZE,
      y: HEIGHT / 2,
      direction: 1,
      speed: 2,
      attackSpeed: 7,
      color: '#4410c7',
      spells: [],
    },
    {
      id: 1,
      x: WIDTH - HERO_SIZE,
      y: HEIGHT / 2,
      direction: -1,
      speed: 2,
      attackSpeed: 7,
      color: '#ff0000',
      spells: [],
    },
  ]);
  // Функция для создания заклинания
  const shootSpell = (hero, index) => {
    const spell = {
      x: hero.x + (index === 0 ? HERO_SIZE : -HERO_SIZE),
      y: hero.y,
      direction: index === 0 ? 1 : -1,
      color: hero.color,
    };
    hero.spells.push(spell);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Обработчик движения мыши для обновления координат курсора
    const handleMouseMove = (e) => {
      cursorX.current = e.clientX;
      cursorY.current = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Функция для рисования героя
    const drawHero = (hero) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const clickX = cursorX.current - rect.left;
      const clickY = cursorY.current - rect.top;
      const distance = Math.sqrt((hero.x - clickX) ** 2 + (hero.y - clickY) ** 2);
      // Создание градиента для отображения области вокруг героя, если на него можно кликнуть
      if (distance < HERO_SIZE * 3 + 40) {
        const gradient = ctx.createRadialGradient(
          hero.x,
          hero.y,
          HERO_SIZE,
          hero.x,
          hero.y,
          HERO_SIZE * 3 + 40,
        );

        gradient.addColorStop(0, hero.color + '80');
        gradient.addColorStop(1, hero.color + '00');

        ctx.beginPath();
        ctx.arc(hero.x, hero.y, HERO_SIZE * 3 + 40, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
      }
      // Рисование самого героя
      ctx.beginPath();
      ctx.arc(hero.x, hero.y, HERO_SIZE, 0, 2 * Math.PI);
      ctx.fillStyle = hero.color;
      ctx.fill();
      ctx.closePath();
    };
    // Функция для рисования заклинания
    const drawSpell = (spell) => {
      ctx.beginPath();
      ctx.arc(spell.x, spell.y, SPELL_SIZE, 0, 2 * Math.PI);
      ctx.fillStyle = spell.color;
      ctx.fill();
      ctx.closePath();
    };
    // Функция для обновления состояния и позиции объектов
    const updatePositions = () => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.closePath();
      ctx.restore();

      const heroes = heroesRef.current;

      heroes.forEach((hero, index) => {
        // Обновление позиции героя
        hero.y += hero.speed * hero.direction;

        // Изменение направления, если герой достигает границ
        if (hero.y - HERO_SIZE <= 0 || hero.y + HERO_SIZE >= HEIGHT) {
          hero.direction *= -1;
        }

        // Отталкивание героя от курсора
        const rect = canvas.getBoundingClientRect();
        const mouseX = cursorX.current - rect.left;
        const mouseY = cursorY.current - rect.top;
        const COOLDOWN = 50;
        if (Date.now() - lastToggleTime.current >= COOLDOWN) {
          if (Math.abs(hero.y - mouseY) <= HERO_SIZE && Math.abs(hero.x - mouseX) <= HERO_SIZE) {
            hero.direction *= -1;
            hero.direction = mouseY < hero.y ? 1 : -1;
            lastToggleTime.current = Date.now();
          }
        }
        // Обновление позиции заклинания и проверка на попадание по сопернику
        hero.spells = hero.spells.filter((spell) => {
          spell.x += spell.direction * 7;

          const enemy = heroes[(index + 1) % 2];
          if (checkCollision(spell, enemy)) {
            setScores((prevScores) => {
              const newScores = [...prevScores];
              newScores[index]++;
              return newScores;
            });
            return false;
          }

          drawSpell(spell);
          return spell.x > 0 && spell.x < WIDTH;
        });

        drawHero(hero);
      });

      requestAnimationFrame(updatePositions);
    };
    // Запуск обновления позиций и стрельбы
    updatePositions();
    startShooting();

    return () => {
      stopShooting();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const startShooting = () => {
    // Останавливаем предыдущие интервалы перед запуском новых
    stopShooting();

    intervalIdsRef.current = heroesRef.current.map((hero, index) =>
      setInterval(() => shootSpell(hero, index), 3500 / hero.attackSpeed),
    );
  };

  // Функция для остановки стрельбы
  const stopShooting = () => {
    intervalIdsRef.current.forEach(clearInterval);
  };

  // Обработчик клика по герою
  const handleHeroClick = (hero, clickX, clickY) => {
    setSelectedHero(hero);
    setColorPickerPosition({ x: clickX, y: clickY });
    setColorPickerVisible(true);
  };

  // Обработчик изменения цвета
  const handleColorChange = (heroId, color) => {
    // Обновляем цвет героя в heroesRef
    const updatedHeroes = heroesRef.current.map((h) => (h.id === heroId ? { ...h, color } : h));
    heroesRef.current = updatedHeroes;
    startShooting(); // Перезапуск стрельбы
  };

  // Обработчик изменения скорости передвижения
  const handleSpeedChange = (heroId, speed) => {
    // Обновляем скорость передвижения героя в heroesRef
    const updatedHeroes = heroesRef.current.map((h) => (h.id === heroId ? { ...h, speed } : h));
    heroesRef.current = updatedHeroes;
    startShooting(); // Перезапуск стрельбы
  };

  // Обработчик изменения скорости атаки
  const handleAttackSpeedChange = (heroId, attackSpeed) => {
    // Обновляем скорость атаки героя в heroesRef
    const updatedHeroes = heroesRef.current.map((h) =>
      h.id === heroId ? { ...h, attackSpeed } : h,
    );
    heroesRef.current = updatedHeroes;
    startShooting(); // Перезапуск стрельбы с новой скоростью атаки
  };
  // Функция для проверки столкновения заклинания с героем
  const checkCollision = (spell, hero) => {
    const distance = Math.sqrt((spell.x - hero.x) ** 2 + (spell.y - hero.y) ** 2);
    return distance < HERO_SIZE + SPELL_SIZE;
  };
  return (
    <div className="wrap-duel" style={{ width: WIDTH }}>
      <canvas
        ref={canvasRef}
        className="duel-canvas"
        width={WIDTH}
        height={HEIGHT}
        onClick={(e) => {
          const rect = canvasRef.current.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const clickY = e.clientY - rect.top;

          heroesRef.current.forEach((hero) => {
            const distance = Math.sqrt((hero.x - clickX) ** 2 + (hero.y - clickY) ** 2);
            if (distance < HERO_SIZE * 3 + 40) {
              handleHeroClick(hero, e.clientX, e.clientY);
            }
          });
        }}
      />
      {/* Меню со счетом, а также с выбором скорости передвижения и стрельбы */}
      <Menu
        heroes={heroesRef.current}
        scores={scores}
        handleSpeedChange={handleSpeedChange}
        handleAttackSpeedChange={handleAttackSpeedChange}
      />
      {/* Окно выбора цвета героя */}
      {colorPickerVisible && (
        <ColorPicker
          hero={selectedHero}
          x={colorPickerPosition.x}
          y={colorPickerPosition.y}
          onClose={() => setColorPickerVisible(false)}
          onColorChange={(color) => handleColorChange(selectedHero.id, color)}
        />
      )}
    </div>
  );
};
