import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Fade } from '@mui/material';

const ICONS = ['🍎', '🍌', '🍒', '🥑', '🍍', '🍑', '🍇', '🍉'];
const CARDS = [...ICONS, ...ICONS];

export default function MemoryGame({ gameState, setGameState, onWin }) {
  const [cards, setCards] = useState(gameState.cards || shuffle(CARDS));
  const [flipped, setFlipped] = useState(gameState.flipped || []);
  const [matched, setMatched] = useState(gameState.matched || []);
  const [disabled, setDisabled] = useState(false);

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const handleFlip = (i) => {
    if (disabled || flipped.includes(i) || matched.includes(i)) return;
    const newFlipped = [...flipped, i];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped]);
        onWin(20);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
     setGameState({ cards, matched });
     if (matched.length === CARDS.length) {
        alert('Chúc mừng! Bạn đã hoàn thành cờ trí nhớ.');
     }
  }, [matched, cards, setGameState]);

  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
        {cards.map((icon, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(i);
          return (
            <Paper
              key={i}
              onClick={() => handleFlip(i)}
              sx={{
                width: 80, height: 80,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: matched.includes(i) ? 'default' : 'pointer',
                bgcolor: isFlipped ? 'primary.main' : 'background.paper',
                border: '2px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s'
              }}
            >
              {isFlipped ? (
                <Fade in={isFlipped}>
                   <Typography variant="h3">{icon}</Typography>
                </Fade>
              ) : null}
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
