import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Fade } from '@mui/material';

const ICONS = ['🍎', '🍌', '🍒', '🥑', '🍍', '🍑', '🍇', '🍉'];
const CARDS = [...ICONS, ...ICONS];

export default function MemoryGame({ gameState, setGameState, onWin, setTimerActive, setIsGameOver }) {
  const [cards, setCards] = useState(gameState.cards || shuffle(CARDS));
  const [flipped, setFlipped] = useState([]);
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
        const newMatched = [...matched, ...newFlipped];
        setMatched(newMatched);
        onWin(20);
        setFlipped([]);
        setDisabled(false);
        setGameState({ cards, matched: newMatched });

        if (newMatched.length === CARDS.length) {
          setTimerActive(false);
          setIsGameOver(true);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matched.length > 0) setGameState({ cards, matched });
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
