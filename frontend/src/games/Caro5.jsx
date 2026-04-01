import React, { useEffect, useState } from 'react';
import { Box, Paper, Grid, Button, Typography, IconButton } from '@mui/material';

const GRID_SIZE = 15;
const WIN_COUNT = 5;

export default function Caro5({ gameState, setGameState, onWin, setTimerActive, setIsGameOver }) {
  const board = gameState.board || Array(GRID_SIZE * GRID_SIZE).fill(null);
  const isXNext = gameState.isXNext ?? true;
  const [winner, setWinner] = useState(null);

  const checkWinner = (squares) => {
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) continue;
      const x = i % GRID_SIZE;
      const y = Math.floor(i / GRID_SIZE);

      const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
      for (const [dx, dy] of directions) {
        let count = 1;
        for (let step = 1; step < WIN_COUNT; step++) {
          const nx = x + dx * step;
          const ny = y + dy * step;
          if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) break;
          if (squares[ny * GRID_SIZE + nx] === squares[i]) count++;
          else break;
        }
        if (count === WIN_COUNT) return squares[i];
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (winner || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = 'X';
    setGameState({ board: newBoard, isXNext: false });
    
    const win = checkWinner(newBoard);
    if (win) {
       setWinner(win);
       onWin(100);
       setTimerActive(false);
       setIsGameOver(true);
       return;
    }

    // AI Move
    setTimeout(() => {
      const available = newBoard.map((v, idx) => v === null ? idx : null).filter(v => v !== null);
      if (available.length === 0) return;
      const rand = available[Math.floor(Math.random() * available.length)];
      newBoard[rand] = 'O';
      setGameState({ board: newBoard, isXNext: true });
      const winO = checkWinner(newBoard);
      if (winO) {
         setWinner(winO);
         onWin(-50);
         setTimerActive(false);
         setIsGameOver(true);
      }
    }, 500);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" align="center" sx={{ mb: 2 }}>
        {winner ? (winner === 'X' ? 'Bạn thắng!' : 'Máy thắng!') : 'Lượt của bạn (X)'}
      </Typography>
      <Paper elevation={0} variant="outlined" sx={{ bgcolor: 'rgba(255,255,255,0.05)', p: 1 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 30px)`, gap: '2px' }}>
          {board.map((cell, i) => (
            <Box
              key={i}
              onClick={() => handleClick(i)}
              sx={{
                width: 30, height: 30,
                border: '1px solid #444',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: winner ? 'default' : 'pointer',
                bgcolor: cell === 'X' ? 'rgba(25, 118, 210, 0.2)' : cell === 'O' ? 'rgba(220, 0, 78, 0.2)' : 'transparent',
                '&:hover': { bgcolor: !cell && !winner ? 'rgba(255,255,255,0.1)' : '' }
              }}
            >
              <Typography sx={{ fontWeight: 'bold', color: cell === 'X' ? 'primary.main' : 'secondary.main' }}>
                {cell}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
