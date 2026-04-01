import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

export default function Caro4({ game, gameState, setGameState, onWin, setTimerActive, setIsGameOver }) {
  const config = typeof game?.config === 'string' ? JSON.parse(game.config || '{}') : (game?.config || {});
  const GRID_SIZE = config.grid_size || 10;
  const WIN_COUNT = 4;

  // Khởi tạo bàn cờ với kích thước động
  const board = gameState.board || Array(GRID_SIZE * GRID_SIZE).fill(null);
  const [winner, setWinner] = React.useState(null);

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
    setGameState({ board: newBoard });

    const winX = checkWinner(newBoard);
    if (winX) {
      setWinner('X');
      onWin(50);
      setTimerActive(false);
      setIsGameOver(true);
      return;
    }

    // AI move
    setTimeout(() => {
        const available = newBoard.map((v, idx) => v === null ? idx : null).filter(v => v !== null);
        if (available.length === 0) return;
        const rand = available[Math.floor(Math.random() * available.length)];
        newBoard[rand] = 'O';
        setGameState({ board: newBoard });
        if (checkWinner(newBoard)) {
           setWinner('O');
           onWin(-20);
           setTimerActive(false);
           setIsGameOver(true);
        }
    }, 500);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" align="center" sx={{ mb: 2 }}>
        {winner ? (winner === 'X' ? 'Bạn thắng!' : 'Máy thắng!') : 'Lượt của bạn (X) - Caro 4'}
      </Typography>
      <Paper elevation={0} variant="outlined" sx={{ bgcolor: 'rgba(255,255,255,0.05)', p: 1 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 40px)`, gap: '3px' }}>
          {board.map((cell, i) => (
            <Box
              key={i}
              onClick={() => handleClick(i)}
              sx={{
                width: 40, height: 40,
                border: '1px solid #555',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: winner ? 'default' : 'pointer',
                bgcolor: cell === 'X' ? 'rgba(56, 142, 60, 0.2)' : cell === 'O' ? 'rgba(211, 47, 47, 0.2)' : 'transparent',
                '&:hover': { bgcolor: !cell && !winner ? 'rgba(255,255,255,0.1)' : '' }
              }}
            >
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: cell === 'X' ? 'success.main' : 'error.main' }}>
                {cell}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
