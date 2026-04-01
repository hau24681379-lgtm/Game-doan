import React, { useState, useEffect, useCallback } from 'react';
import { Box, Paper, Typography, Zoom } from '@mui/material';

export default function Match3({ game, gameState, setGameState, onWin }) {
  const config = typeof game?.config === 'string' ? JSON.parse(game.config || '{}') : (game?.config || {});
  const WIDTH = config.grid_size || 8;
  const CANDIES = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'];

  const [board, setBoard] = useState(gameState.board || []);
  const [selected, setSelected] = useState(null);

  // Initialize board if empty
  useEffect(() => {
    if (board.length !== WIDTH * WIDTH) {
      const initialBoard = Array.from({ length: WIDTH * WIDTH }, () => CANDIES[Math.floor(Math.random() * CANDIES.length)]);
      setBoard(initialBoard);
    }
  }, [WIDTH]);

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
  }, [board, onWin, WIDTH]);

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
  }, [board, WIDTH]);

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
      setSelected(null);
    }
  };

  useEffect(() => {
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
              width: WIDTH > 8 ? 35 : 48, 
              height: WIDTH > 8 ? 35 : 48,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              bgcolor: selected === i ? 'rgba(33, 150, 243, 0.3)' : 'background.paper',
              fontSize: WIDTH > 8 ? '1.2rem' : '1.8rem',
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
      ))}
    </Box>
  );
}
