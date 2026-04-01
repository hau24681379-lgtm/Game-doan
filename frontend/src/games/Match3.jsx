import React, { useState, useEffect } from 'react';
import { Box, Paper, IconButton } from '@mui/material';

const WIDTH = 8;
const CANDIES = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'];

export default function Match3({ gameState, setGameState, onWin }) {
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
      setSelected(null);
    }
  };

  useEffect(() => {
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
      ))}
    </Box>
  );
}
