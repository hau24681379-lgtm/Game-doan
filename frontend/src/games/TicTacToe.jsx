import React, { useEffect, useState } from 'react';
import { Box, Grid, Button, Typography, Paper } from '@mui/material';

export default function TicTacToe({ gameState, setGameState, onWin, setTimerActive, setIsGameOver }) {
  const board = gameState.board || Array(9).fill(null);
  const [winner, setWinner] = useState(null);

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a];
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
    <Box sx={{ width: 320, p: 1 }}>
      <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        {winner ? (winner === 'X' ? 'Bạn thắng!' : 'Máy thắng!') : 'Tic-Tac-Toe (X)'}
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '8px',
        bgcolor: 'rgba(255,255,255,0.05)',
        p: 1,
        borderRadius: 4
      }}>
        {board.map((cell, i) => (
          <Paper
            key={i}
            onClick={() => handleClick(i)}
            elevation={cell ? 4 : 0}
            sx={{
              height: 90,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              cursor: winner || cell ? 'default' : 'pointer',
              borderRadius: 3,
              bgcolor: cell === 'X' ? 'rgba(33, 150, 243, 0.15)' : cell === 'O' ? 'rgba(244, 67, 54, 0.15)' : 'rgba(255,255,255,0.02)',
              border: '1px solid',
              borderColor: cell === 'X' ? 'primary.main' : cell === 'O' ? 'error.main' : 'rgba(255,255,255,0.1)',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: !cell && !winner ? 'rgba(255,255,255,0.08)' : '',
                transform: !cell && !winner ? 'scale(1.05)' : 'none'
              }
            }}
          >
            <Typography sx={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold',
              color: cell === 'X' ? 'primary.main' : cell === 'O' ? 'error.main' : 'transparent',
              textShadow: cell ? '0 0 10px rgba(255,255,255,0.2)' : 'none'
            }}>
              {cell}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
