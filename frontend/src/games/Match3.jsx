<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Box, Paper, IconButton } from '@mui/material';
=======
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Paper, Typography, Zoom } from '@mui/material';
>>>>>>> 80fe5ea

const WIDTH = 8;
const CANDIES = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'];

export default function Match3({ gameState, setGameState, onWin }) {
<<<<<<< HEAD
  const [board, setBoard] = useState(gameState.board || Array.from({ length: WIDTH * WIDTH }, () => CANDIES[Math.floor(Math.random() * CANDIES.length)]));
  const [selected, setSelected] = useState(null);

  const swap = (i1, i2) => {
    const newBoard = [...board];
    const temp = newBoard[i1];
    newBoard[i1] = newBoard[i2];
    newBoard[i2] = temp;
    
    // Simple logic check for match (horizontal/vertical)
    if (checkMatches(newBoard)) {
        setBoard(newBoard);
        onWin(30);
    } else {
        // Swap back if no match
        setBoard([...board]);
    }
  };

  const checkMatches = (squares) => {
    let matched = false;
    // Simple 3-in-a-row check
    for (let i = 0; i < squares.length; i++) {
        // Horizontal
        if (i % WIDTH < WIDTH - 2 && squares[i] === squares[i+1] && squares[i] === squares[i+2]) matched = true;
        // Vertical
        if (i < WIDTH * (WIDTH - 2) && squares[i] === squares[i+WIDTH] && squares[i] === squares[i+WIDTH*2]) matched = true;
    }
    return matched;
  };

  const handleTileClick = (i) => {
    if (selected === null) setSelected(i);
    else {
      const isAdjacent = Math.abs(selected - i) === 1 || Math.abs(selected - i) === WIDTH;
      if (isAdjacent) swap(selected, i);
=======
  const [board, setBoard] = useState(gameState.board || []);
  const [selected, setSelected] = useState(null);

  // Initialize board if empty
  useEffect(() => {
    if (board.length === 0) {
      const initialBoard = Array.from({ length: WIDTH * WIDTH }, () => CANDIES[Math.floor(Math.random() * CANDIES.length)]);
      setBoard(initialBoard);
    }
  }, []);

  const checkForMatches = useCallback(() => {
    let matchedIndices = new Set();
    const newBoard = [...board];

    for (let i = 0; i < WIDTH * WIDTH; i++) {
      // Horizontal check
      if (i % WIDTH < WIDTH - 2) {
        if (board[i] && board[i] === board[i+1] && board[i] === board[i+2]) {
          matchedIndices.add(i); matchedIndices.add(i+1); matchedIndices.add(i+2);
        }
      }
      // Vertical check
      if (i < WIDTH * (WIDTH - 2)) {
        if (board[i] && board[i] === board[i+WIDTH] && board[i] === board[i+WIDTH*2]) {
          matchedIndices.add(i); matchedIndices.add(i+WIDTH); matchedIndices.add(i+WIDTH*2);
        }
      }
    }

    if (matchedIndices.size > 0) {
      matchedIndices.forEach(idx => newBoard[idx] = null);
      setBoard(newBoard);
      onWin(matchedIndices.size * 10);
      return true;
    }
    return false;
  }, [board, onWin]);

  const moveIntoSquareBelow = useCallback(() => {
    const newBoard = [...board];
    let moved = false;

    // Fill empty spaces from top
    for (let i = 0; i < WIDTH * (WIDTH - 1); i++) {
        const firstRow = Array.from({ length: WIDTH }, (_, k) => k);
        const isFirstRow = firstRow.includes(i);

        if (isFirstRow && newBoard[i] === null) {
            newBoard[i] = CANDIES[Math.floor(Math.random() * CANDIES.length)];
            moved = true;
        }

        if (newBoard[i + WIDTH] === null) {
            newBoard[i + WIDTH] = newBoard[i];
            newBoard[i] = null;
            moved = true;
        }
    }

    if (moved) {
        setBoard(newBoard);
    }
  }, [board]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!checkForMatches()) {
        moveIntoSquareBelow();
      }
    }, 150);
    return () => clearInterval(timer);
  }, [checkForMatches, moveIntoSquareBelow]);

  const handleTileClick = (i) => {
    if (selected === null) {
      setSelected(i);
    } else {
      const row1 = Math.floor(selected / WIDTH);
      const col1 = selected % WIDTH;
      const row2 = Math.floor(i / WIDTH);
      const col2 = i % WIDTH;

      const isAdjacent = (Math.abs(row1 - row2) === 1 && col1 === col2) || 
                        (Math.abs(col1 - col2) === 1 && row1 === row2);

      if (isAdjacent) {
        const newBoard = [...board];
        const temp = newBoard[selected];
        newBoard[selected] = newBoard[i];
        newBoard[i] = temp;
        setBoard(newBoard);
      }
>>>>>>> 80fe5ea
      setSelected(null);
    }
  };

  useEffect(() => {
<<<<<<< HEAD
    setGameState({ board });
  }, [board, setGameState]);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${WIDTH}, 1fr)`, gap: '4px' }}>
      {board.map((candy, i) => (
        <Paper
          key={i}
          onClick={() => handleTileClick(i)}
          sx={{
            width: 45, height: 45,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            bgcolor: selected === i ? 'primary.light' : 'background.paper',
            fontSize: '1.5rem',
            border: '2px solid transparent',
            transition: 'all 0.2s',
            '&:hover': { transform: 'scale(1.1)', bgcolor: 'rgba(255,255,255,0.05)' }
          }}
        >
          {candy}
        </Paper>
=======
    if (board.length > 0) setGameState({ board });
  }, [board, setGameState]);

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: `repeat(${WIDTH}, 1fr)`, 
      gap: '6px', 
      p: 2, 
      bgcolor: 'rgba(0,0,0,0.2)', 
      borderRadius: 4,
      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
    }}>
      {board.map((candy, i) => (
        <Zoom in={true} key={i}>
          <Paper
            onClick={() => handleTileClick(i)}
            sx={{
              width: 48, height: 48,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              bgcolor: selected === i ? 'rgba(33, 150, 243, 0.3)' : 'background.paper',
              fontSize: '1.8rem',
              borderRadius: 2,
              border: selected === i ? '2px solid #2196f3' : '1px solid rgba(255,255,255,0.1)',
              boxShadow: selected === i ? '0 0 15px #2196f3' : 'none',
              transform: selected === i ? 'scale(0.9)' : 'none',
              transition: 'all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              opacity: candy === null ? 0 : 1,
              '&:hover': { transform: 'scale(1.1)', zIndex: 2, boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }
            }}
          >
            {candy}
          </Paper>
        </Zoom>
>>>>>>> 80fe5ea
      ))}
    </Box>
  );
}
