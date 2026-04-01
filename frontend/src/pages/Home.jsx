import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import InfoIcon from '@mui/icons-material/Info';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import GameBoard from '../components/GameBoard';
import GameContainer from '../components/GameContainer';
import axios from 'axios';

// Import Games
import Caro5 from '../games/Caro5';
import Caro4 from '../games/Caro4';
import TicTacToe from '../games/TicTacToe';
import SnakeGame from '../games/SnakeGame';
import Match3 from '../games/Match3';
import MemoryGame from '../games/MemoryGame';
import FreeDraw from '../games/FreeDraw';

const API_BASE_URL = 'http://localhost:3000/api';

// Map slugs to components
const GameMap = {
  'caro-5': Caro5,
  'caro-4': Caro4,
  'tic-tac-toe': TicTacToe,
  'snake': SnakeGame,
  'match-3': Match3,
  'memory': MemoryGame,
  'draw': FreeDraw,
};

export default function Home() {
  const [games, setGames] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inGame, setInGame] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Game session states
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState({});

  // Dummy user for session saving (assuming player 1)
  const user = { id: 3, username: 'player1' };

  // Fetch games from Backend
  useEffect(() => {
    axios.get(`${API_BASE_URL}/games`)
      .then(res => {
        setGames(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching games:', err);
        setLoading(false);
      });
  }, []);
  
  const handleLeft = () => setSelectedIndex(prev => (prev > 0 ? prev - 1 : games.length - 1));
  const handleRight = () => setSelectedIndex(prev => (prev < games.length - 1 ? prev + 1 : 0));
  const handleEnter = () => {
    setScore(0);
    setGameState({});
    setInGame(true);
  };
  const handleBack = () => setInGame(false);
  const handleHint = () => {
    if (games[selectedIndex]) {
      alert(`Hướng dẫn chơi ${games[selectedIndex].name}:\n${games[selectedIndex].description}`);
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (inGame) {
        if (e.key === 'Escape' || e.key === 'Backspace') handleBack();
        return;
      }
      if (games.length === 0) return;

      switch(e.key) {
        case 'ArrowLeft': handleLeft(); break;
        case 'ArrowRight': handleRight(); break;
        case 'Enter': handleEnter(); break;
        case 'Escape': case 'Backspace': handleBack(); break;
        case 'h': case 'H': handleHint(); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inGame, selectedIndex, games]);

  if (inGame) {
    const gameData = games[selectedIndex];
    const Component = GameMap[gameData.slug];

    return (
      <GameContainer 
        game={gameData} 
        user={user} 
        onBack={handleBack}
        score={score}
        setScore={setScore}
        gameState={gameState}
        setGameState={setGameState}
      >
        {Component ? (
            <Component 
                gameState={gameState} 
                setGameState={setGameState} 
                onWin={(points) => setScore(prev => prev + points)} 
            />
        ) : (
            <Typography color="error">Trò chơi này đang được phát triển.</Typography>
        )}
      </GameContainer>
    );
  }

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Board Game Center
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Sử dụng các phím mũi tên hoặc bảng điều khiển để chọn trò chơi
      </Typography>
      
      {loading ? (
        <Typography sx={{ my: 10 }}>Đang tải danh sách game...</Typography>
      ) : (
        <GameBoard 
          games={games} 
          selectedIndex={selectedIndex} 
          onGameClick={(idx) => setSelectedIndex(idx)} 
        />
      )}

      {/* 5 Controller Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button color="inherit" variant="outlined" sx={{ borderRadius: 4, px: 4 }} onClick={handleLeft} startIcon={<ArrowBackIcon />}>Left</Button>
        <Button color="inherit" variant="outlined" sx={{ borderRadius: 4, px: 4 }} onClick={handleRight} endIcon={<ArrowForwardIcon />}>Right</Button>
        <Button size="large" variant="contained" sx={{ borderRadius: 4, px: 6, fontWeight: 'bold' }} onClick={handleEnter} endIcon={<KeyboardReturnIcon />}>ENTER</Button>
        <Button color="error" variant="outlined" sx={{ borderRadius: 4, px: 4 }} onClick={handleBack} startIcon={<SubdirectoryArrowLeftIcon />}>Back</Button>
        <Button color="info" variant="outlined" sx={{ borderRadius: 4, px: 4 }} onClick={handleHint} startIcon={<InfoIcon />}>Hint/Help</Button>
      </Box>
    </Box>
  );
}
