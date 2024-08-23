import React, { useRef, useState, useEffect } from 'react';
import HeroMenu from './HeroMenu';

const WIDTH = 800;
const HEIGHT = 600;
const HERO_SIZE = 20;
const SPELL_SIZE = 5;

export const Duel = () => {
  const canvasRef = useRef(null);
  const cursorX = useRef(0);
  const cursorY = useRef(0);
  const lastToggleTime = useRef(0);

  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedHero, setSelectedHero] = useState(null);
  const [scores, setScores] = useState([0, 0]);
  const [heroes, setHeroes] = useState([
    {
      x: HERO_SIZE,
      y: HEIGHT / 2,
      direction: 1,
      speed: 2,
      color: 'blue',
      spells: [],
    },
    {
      x: WIDTH - HERO_SIZE,
      y: HEIGHT / 2,
      direction: -1,
      speed: 2,
      color: 'red',
      spells: [],
    },
  ]);

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

    const handleMouseMove = (e) => {
      cursorX.current = e.clientX;
      cursorY.current = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const drawHero = (hero) => {
      // Определяем расстояние между героем и курсором
      const rect = canvasRef.current.getBoundingClientRect();
      const clickX = cursorX.current - rect.left;
      const clickY = cursorY.current - rect.top;
      const distance = Math.sqrt((hero.x - clickX) ** 2 + (hero.y - clickY) ** 2);

      // Рисуем большой круг вокруг героя, если расстояние меньше HERO_SIZE*3+40
      if (
        cursorX.current > rect.left &&
        cursorX.current < rect.right &&
        cursorY.current < rect.bottom &&
        cursorY.current > rect.top
      ) {
        if (distance < HERO_SIZE * 3 + 40) {
          const gradient = ctx.createRadialGradient(
            hero.x,
            hero.y,
            HERO_SIZE,
            hero.x,
            hero.y,
            HERO_SIZE * 3 + 40,
          );

          gradient.addColorStop(0, 'rgba(0, 255, 0, 0.5)'); // Центр градиента (полупрозрачный зеленый)
          gradient.addColorStop(1, 'rgba(0, 255, 0, 0)'); // Края градиента (полностью прозрачный)

          ctx.beginPath();
          ctx.arc(hero.x, hero.y, HERO_SIZE * 3 + 40, 0, 2 * Math.PI); // Рисуем круг с градиентом
          ctx.fillStyle = gradient;
          ctx.fill();
          ctx.closePath();
        }
      }

      // Рисуем основной круг героя
      ctx.beginPath();
      ctx.arc(hero.x, hero.y, HERO_SIZE, 0, 2 * Math.PI);
      ctx.fillStyle = hero.color;
      ctx.fill();
      ctx.closePath();
    };

    const drawSpell = (spell) => {
      ctx.beginPath();
      ctx.arc(spell.x, spell.y, SPELL_SIZE, 0, 2 * Math.PI);
      ctx.fillStyle = spell.color;
      ctx.fill();
      ctx.closePath();
    };

    const updatePositions = () => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      heroes.forEach((hero, index) => {
        // Двигаем героя
        hero.y += hero.speed * hero.direction;

        // Проверка на столкновение с границей поля
        if (hero.y - HERO_SIZE <= 0 || hero.y + HERO_SIZE >= HEIGHT) {
          hero.direction *= -1;
        }

        // Столкновение с курсором
        {
          const rect = canvas.getBoundingClientRect();
          const mouseX = cursorX.current - rect.left;
          const mouseY = cursorY.current - rect.top;
          const COOLDOWN = 50;
          if (Date.now() - lastToggleTime.current >= COOLDOWN) {
            if (Math.abs(hero.y - mouseY) <= HERO_SIZE && Math.abs(hero.x - mouseX) <= HERO_SIZE) {
              hero.direction *= -1;
              if (mouseY < hero.y) {
                hero.direction = 1; // Курсор выше героя - герой движется вниз
              } else {
                hero.direction = -1; // Курсор ниже героя - герой движется вверх
              }
              lastToggleTime.current = Date.now(); // Обновляем время последнего срабатывания
            }
          }
        }

        // Двигаем заклинания
        hero.spells = hero.spells.filter((spell) => {
          spell.x += spell.direction * 5;

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

        // Рисуем героя
        drawHero(hero);
      });

      requestAnimationFrame(updatePositions);
    };

    updatePositions();

    // Устанавливаем стрельбу
    const intervalIds = heroes.map((hero, index) =>
      setInterval(() => shootSpell(hero, index), 1000),
    );
    return () => {
      intervalIds.forEach(clearInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [heroes]);

  const handleHeroClick = (hero) => {
    setSelectedHero(hero);
    setMenuVisible(true);
  };

  const handleColorChange = (hero, color) => {
    setHeroes(heroes.map((h) => (h === hero ? { ...h, color } : h)));
  };

  const handleSpeedChange = (hero, speed) => {
    setHeroes(heroes.map((h) => (h === hero ? { ...h, speed } : h)));
  };
  const checkCollision = (spell, hero) => {
    const distance = Math.sqrt((spell.x - hero.x) ** 2 + (spell.y - hero.y) ** 2);
    return distance < HERO_SIZE + SPELL_SIZE;
  };
  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid black' }}
        width={WIDTH}
        height={HEIGHT}
        onClick={(e) => {
          const rect = canvasRef.current.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const clickY = e.clientY - rect.top;

          heroes.forEach((hero) => {
            const distance = Math.sqrt((hero.x - clickX) ** 2 + (hero.y - clickY) ** 2);
            if (distance < HERO_SIZE * 3 + 40) {
              handleHeroClick(hero);
            }
          });
        }}
      />
      {menuVisible && (
        <HeroMenu
          hero={selectedHero}
          onClose={() => setMenuVisible(false)}
          onColorChange={handleColorChange}
          onSpeedChange={handleSpeedChange}
        />
      )}
      <div className="scoreboard">
        Счет: {scores[0]} - {scores[1]}
      </div>
      <button onClick={() => handleColorChange(heroes[0], 'brown')}>click</button>
    </>
  );
};
