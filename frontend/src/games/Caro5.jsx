import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, MenuItem, Select, FormControl, InputLabel, Stack } from '@mui/material';

const GRID_SIZE = 15;
const WIN_COUNT = 5;

export default function Caro5({ game, gameState, setGameState, onWin, setTimerActive, setIsGameOver }) {
  const config = typeof game?.config === 'string' ? JSON.parse(game.config || '{}') : (game?.config || {});
  const GRID_SIZE = config.grid_size || 15;
  const board = gameState.board || Array(GRID_SIZE * GRID_SIZE).fill(null);
  const isXNext = gameState.isXNext ?? true;
  const [winner, setWinner] = useState(null);
  const [aiLevel, setAiLevel] = useState(1); // Mặc định Cấp 1

  const playSound = (type) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === 'tick') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'win') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === 'lose') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch(e) {}
  };

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

  const calculateBestMove = (boardState, level) => {
    const available = boardState.map((v, idx) => v === null ? idx : null).filter(v => v !== null);
    if (available.length === 0) return -1;
    
    if (level === 1) {
       return available[Math.floor(Math.random() * available.length)];
    }

    const getCellScore = (idx, player) => {
        const x = idx % GRID_SIZE;
        const y = Math.floor(idx / GRID_SIZE);
        let score = 0;
        const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
        for (const [dx, dy] of directions) {
            let pCount = 0, eCount = 0;
            for (let dir = -1; dir <= 1; dir += 2) {
                for (let step = 1; step <= 4; step++) {
                    const nx = x + dx * step * dir;
                    const ny = y + dy * step * dir;
                    if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) break;
                    const cell = boardState[ny * GRID_SIZE + nx];
                    if (cell === player) pCount++;
                    else if (cell === null) eCount++;
                    else break;
                }
            }
            if (pCount >= 4) score += 10000;
            else if (pCount === 3 && eCount >= 1) score += 1000;
            else if (pCount === 2 && eCount >= 2) score += 100;
            else if (pCount === 1 && eCount >= 3) score += 10;
        }
        return score;
    };

    let bestScore = -1;
    let bestMoves = [];

    for (let i of available) {
        let attackScore = getCellScore(i, 'O');
        let defenseScore = getCellScore(i, 'X');
        
        let totalScore = level === 2 
              ? (defenseScore >= 1000 ? defenseScore * 2 : attackScore + defenseScore) + Math.random()*50
              : (attackScore * 1.1 + defenseScore);

        if (totalScore > bestScore) {
            bestScore = totalScore;
            bestMoves = [i];
        } else if (totalScore === bestScore) {
            bestMoves.push(i);
        }
    }
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  };

  const handleClick = (i) => {
    if (winner || board[i]) return;
    playSound('tick');
    const newBoard = [...board];
    newBoard[i] = 'X';
    setGameState({ board: newBoard, isXNext: false });
    
    const win = checkWinner(newBoard);
    if (win) {
       playSound('win');
       setWinner(win);
       onWin(100);
       setTimerActive(false);
       setIsGameOver(true);
       return;
    }

    // AI Move
    setTimeout(() => {
      const bestMove = calculateBestMove(newBoard, aiLevel);
      if (bestMove === -1) return;
      
      playSound('tick');
      newBoard[bestMove] = 'O';
      setGameState({ board: newBoard, isXNext: true });
      const winO = checkWinner(newBoard);
      if (winO) {
         playSound('lose');
         setWinner(winO);
         onWin(-50);
         setTimerActive(false);
         setIsGameOver(true);
      }
    }, 400);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          {winner ? (winner === 'X' ? 'Bạn thắng!' : 'Máy thắng!') : 'Lượt của bạn (X)'}
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Độ khó</InputLabel>
          <Select value={aiLevel} label="Độ khó" onChange={(e) => setAiLevel(e.target.value)}>
            <MenuItem value={1}>Cấp 1</MenuItem>
            <MenuItem value={2}>Cấp 2</MenuItem>
            <MenuItem value={3}>Cấp 3</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Paper elevation={0} variant="outlined" sx={{ bgcolor: 'rgba(255,255,255,0.05)', p: 1, display: 'inline-block' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 30px)`, gap: '2px', justifyContent: 'center' }}>
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
    </Box>
  );
}
