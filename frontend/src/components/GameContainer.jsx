import React, { useState, useEffect, useCallback } from 'react';
import { Box, Paper, Typography, Button, Divider, Rating, TextField, Stack, Snackbar, Alert, CircularProgress } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import SaveIcon from '@mui/icons-material/Save';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export default function GameContainer({ game, user, onBack, children, score, setScore, gameState, setGameState }) {
  const [timeLeft, setTimeLeft] = useState(60); 
  const [timerActive, setTimerActive] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [resetKey, setResetKey] = useState(0); // For hard reset of child components
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [lastSaved, setLastSaved] = useState(null);

  // Timer logic
  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      setIsGameOver(true);
      setSnackbar({ open: true, message: 'Hết thời gian chơi rồi!', severity: 'warning' });
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  // Auto-save logic
  useEffect(() => {
    if (!user || isGameOver) return;
    const autoSaveTimer = setInterval(() => {
      handleSave(true);
    }, 60000);
    return () => clearInterval(autoSaveTimer);
  }, [user, score, gameState, timeLeft, isGameOver]);

  // Fetch reviews logic
  const fetchReviews = useCallback(async () => {
    if (!game?.id) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/interactions/reviews/${game.id}`);
      setReviews(res.data);
    } catch (e) {
      console.error('Failed to fetch reviews:', e);
    }
  }, [game?.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleReset = () => {
    setTimeLeft(60);
    setScore(0);
    setGameState({});
    setTimerActive(true);
    setIsGameOver(false);
    setResetKey(prev => prev + 1); // This remounts children and clears their internal state
  };

  const handleSave = async (isAuto = false) => {
    if (!user) return;
    try {
      await axios.post(`${API_BASE_URL}/interactions/sessions`, {
        user_id: user.id,
        game_id: game.id,
        score,
        game_state: gameState,
        seconds_left: timeLeft
      });
      setLastSaved(new Date().toLocaleTimeString());
      setSnackbar({ 
        open: true, 
        message: isAuto ? 'Hệ thống đã tự động lưu ván game' : 'Đã lưu ván game thành công!', 
        severity: 'success' 
      });
    } catch (e) {
      if (!isAuto) setSnackbar({ open: true, message: 'Lưu game thất bại: ' + e.message, severity: 'error' });
    }
  };

  const handleLoad = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/interactions/sessions`, {
        params: { user_id: user.id, game_id: game.id }
      });
      const data = res.data;
      setScore(data.score);
      const parsedState = typeof data.game_state === 'string' ? JSON.parse(data.game_state) : data.game_state;
      setGameState(parsedState);
      setTimeLeft(data.seconds_left);
      setIsGameOver(false);
      setTimerActive(true);
      setResetKey(prev => prev + 1); // Remount with loaded state
      setSnackbar({ open: true, message: 'Đã tải lại ván game cũ thành công!', severity: 'info' });
    } catch (e) {
      setSnackbar({ open: true, message: 'Không tìm thấy ván game đã lưu.', severity: 'error' });
    }
  };

  const submitReview = async () => {
    if (!user) return;
    try {
      await axios.post(`${API_BASE_URL}/interactions/reviews`, {
        user_id: user.id,
        game_id: game.id,
        rating,
        comment
      });
      setRating(0);
      setComment('');
      fetchReviews();
      setSnackbar({ open: true, message: 'Cảm ơn bạn đã đánh giá!', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: 'Lỗi khi gửi đánh giá', severity: 'error' });
    }
  };

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { setTimerActive, setIsGameOver });
    }
    return child;
  });

  return (
    <Box sx={{ maxWidth: 850, mx: 'auto', mt: 2 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
        
        {/* Header Stats */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, px: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ bgcolor: 'rgba(33, 150, 243, 0.1)', px: 2, py: 1, borderRadius: 3 }}>
            <TimerIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{timeLeft}s</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)', px: 2, py: 1, borderRadius: 3 }}>
            <ScoreboardIcon color="warning" />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{score}</Typography>
          </Stack>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Game Content Box */}
        <Box sx={{ 
          minHeight: 450, 
          display: 'flex', justifyContent: 'center', alignItems: 'center', 
          bgcolor: 'background.default', borderRadius: 4, 
          p: 2, mb: 3, 
          position: 'relative', // CRITICAL for centering overlay
          overflow: 'hidden'
        }}>
          {/* Overlay centered in Game Box ONLY */}
          {isGameOver && (
            <Box sx={{ 
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
              bgcolor: 'rgba(0,0,0,0.85)', zIndex: 10,
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              backdropFilter: 'blur(4px)'
            }}>
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 4, textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>KẾT THÚC!</Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" size="large" onClick={handleReset} sx={{ px: 6, py: 2, fontSize: '1.2rem', borderRadius: 4 }}>CHƠI LẠI</Button>
                <Button variant="outlined" color="inherit" size="large" onClick={onBack} sx={{ borderRadius: 4 }}>THOÁT</Button>
              </Stack>
            </Box>
          )}

          <Box key={resetKey} sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {childrenWithProps}
          </Box>
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 4 }}>
          <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
            <Button variant="outlined" color="warning" onClick={handleReset}>Làm lại</Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={() => handleSave(false)}>Lưu Game</Button>
            <Button variant="outlined" startIcon={<RestorePageIcon />} onClick={handleLoad}>Tải Lại</Button>
            <Button variant="contained" color="error" onClick={onBack}>Thoát</Button>
          </Stack>
          {lastSaved && (
            <Typography variant="caption" color="text.secondary">Vừa lưu lúc: {lastSaved}</Typography>
          )}
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Reviews Section */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>Đánh giá trò chơi</Typography>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Rating value={rating} onChange={(e, val) => setRating(val)} size="large" />
              <TextField 
                fullWidth 
                multiline 
                rows={3} 
                placeholder="Trò chơi này thế nào? Hãy xẻ chia cảm nhận của bạn..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ bgcolor: 'background.paper' }}
              />
              <Button variant="contained" size="large" sx={{ alignSelf: 'flex-start', px: 4 }} onClick={submitReview}>Gửi đánh giá</Button>
            </Box>
          </Paper>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Nhận xét từ cộng đồng:</Typography>
          <Stack spacing={2}>
            {reviews.length > 0 ? reviews.map(rev => (
              <Paper key={rev.id} variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{rev.username}</Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(rev.created_at).toLocaleDateString()}</Typography>
                </Box>
                <Rating value={rev.rating} size="small" readOnly />
                <Typography variant="body2" sx={{ mt: 1 }}>{rev.comment}</Typography>
              </Paper>
            )) : (
              <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>Chưa có đánh giá nào. Hãy là người đầu tiên!</Typography>
            )}
          </Stack>
        </Box>
      </Paper>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: 3 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
