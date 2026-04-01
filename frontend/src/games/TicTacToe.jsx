import React from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';

export default function TicTacToe({ gameState, setGameState, onWin }) {
  const board = gameState.board || Array(9).fill(null);
  const isXNext = gameState.isXNext ?? true;

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6],           // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);

  const handleClick = (i) => {
    if (winner || board[i]) return;
    const newBoard = board.slice();
    newBoard[i] = 'X';
    
    // User move
    const updatedState = { board: newBoard, isXNext: false };
    setGameState(updatedState);

    // Mini delay for Computer move
    if (!calculateWinner(newBoard)) {
        setTimeout(() => computerMove(newBoard), 500);
    }
  };

  const computerMove = (currentBoard) => {
    const available = currentBoard.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (available.length === 0) return;
    
    const randomIdx = available[Math.floor(Math.random() * available.length)];
    const nextBoard = currentBoard.slice();
    nextBoard[randomIdx] = 'O';
    
    const finalState = { board: nextBoard, isXNext: true };
    setGameState(finalState);

    const win = calculateWinner(nextBoard);
    if (win) {
       onWin(win === 'X' ? 10 : -5);
       alert(win === 'X' ? 'Bạn thắng!' : 'Máy thắng!');
    }
  };

  useEffect(() => {
    if (winner) {
        onWin(winner === 'X' ? 10 : -10);
    }
  }, [winner]);

  return (
    <Box sx={{ width: 300 }}>
      <Typography variant="h6" align="center" gutterBottom>
        {winner ? `Người thắng: ${winner}` : `Lượt của: ${isXNext ? 'Bạn (X)' : 'Máy (O)'}`}
      </Typography>
      <Grid container spacing={1}>
        {board.map((cell, i) => (
          <Grid item xs={4} key={i}>
            <Button
              fullWidth
              variant="outlined"
              sx={{ height: 80, fontSize: '2rem', fontWeight: 'bold' }}
              onClick={() => handleClick(i)}
            >
              {cell}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// Add useEffect import
import { useEffect } from 'react';
