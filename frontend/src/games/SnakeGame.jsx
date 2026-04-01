import React, { useState, useEffect, useCallback } from 'react';
import { Box, Paper } from '@mui/material';

const GRID_SIZE = 15;
const INITIAL_SNAKE = [[7, 7], [7, 8], [7, 9]];
const INITIAL_FOOD = [5, 5];

export default function SnakeGame({ gameState, setGameState, onWin, setTimerActive, setIsGameOver }) {
  const [snake, setSnake] = useState(gameState.snake || INITIAL_SNAKE);
  const [food, setFood] = useState(gameState.food || INITIAL_FOOD);
  const [direction, setDirection] = useState([0, -1]); // Up
  const [gameOver, setGameOver] = useState(false);

  const moveSnake = useCallback(() => {
    if (gameOver) return;
    const newHead = [snake[0][0] + direction[0], snake[0][1] + direction[1]];

    // Collision detection
    if (
      newHead[0] < 0 || newHead[0] >= GRID_SIZE ||
      newHead[1] < 0 || newHead[1] >= GRID_SIZE ||
      snake.some(seg => seg[0] === newHead[0] && seg[1] === newHead[1])
    ) {
      setGameOver(true);
      onWin(-10);
      setTimerActive(false);
      setIsGameOver(true);
      return;
    }

    const newSnake = [newHead, ...snake];
    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      // Eat food
      onWin(5);
      const newFood = [Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)];
      setFood(newFood);
      setGameState({ snake: newSnake, food: newFood });
    } else {
      newSnake.pop();
      setSnake(newSnake);
      setGameState({ snake: newSnake, food: food });
    }
  }, [snake, direction, food, gameOver, onWin, setGameState, setTimerActive, setIsGameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'ArrowUp': if (direction[1] !== 1) setDirection([0, -1]); break;
        case 'ArrowDown': if (direction[1] !== -1) setDirection([0, 1]); break;
        case 'ArrowLeft': if (direction[0] !== 1) setDirection([-1, 0]); break;
        case 'ArrowRight': if (direction[0] !== -1) setDirection([1, 0]); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [moveSnake]);

  return (
    <Box>
      <Paper elevation={0} variant="outlined" sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.05)' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 25px)`, gap: '1px' }}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(s => s[0] === x && s[1] === y);
            const isFood = food[0] === x && food[1] === y;
            return (
              <Box
                key={i}
                sx={{
                  width: 25, height: 25,
                  bgcolor: isSnake ? 'success.main' : isFood ? 'error.main' : 'rgba(255,255,255,0.05)'
                }}
              />
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
}
