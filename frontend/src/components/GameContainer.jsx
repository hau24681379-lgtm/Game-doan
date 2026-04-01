import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Divider, Rating, TextField, Stack } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import SaveIcon from '@mui/icons-material/Save';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export default function GameContainer({ game, user, onBack, children, score, setScore, gameState, setGameState }) {
  const [timeLeft, setTimeLeft] = useState(60); // Default 60 seconds
  const [timerActive, setTimerActive] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);

  // Timer logic
  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      alert('Hết thời gian!');
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  // Fetch reviews
  useEffect(() => {
    fetchReviews();
  }, [game]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/interactions/reviews/${game.id}`);
      setReviews(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post(`${API_BASE_URL}/interactions/sessions`, {
        user_id: user.id,
        game_id: game.id,
        score,
        game_state: gameState,
        seconds_left: timeLeft
      });
      alert('Đã lưu ván game!');
    } catch (e) {
      alert('Lưu game thất bại: ' + e.message);
    }
  };

  const handleLoad = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/interactions/sessions`, {
        params: { user_id: user.id, game_id: game.id }
      });
      const data = res.data;
      setScore(data.score);
      setGameState(JSON.parse(data.game_state));
      setTimeLeft(data.seconds_left);
      alert('Đã tải lại ván game cũ!');
    } catch (e) {
      alert('Không tìm thấy ván game đã lưu.');
    }
  };

  const submitReview = async () => {
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
      alert('Cảm ơn bạn đã đánh giá!');
    } catch (e) {
      alert('Lỗi khi gửi đánh giá');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        {/* Header Stats */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <TimerIcon color="primary" />
            <Typography variant="h6">Thời gian: {timeLeft}s</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <ScoreboardIcon color="secondary" />
            <Typography variant="h6">Điểm: {score}</Typography>
          </Stack>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Game Content */}
        <Box sx={{ minHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {children}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Global Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
          <Button variant="outlined" startIcon={<SaveIcon />} onClick={handleSave}>Lưu Game</Button>
          <Button variant="outlined" startIcon={<RestorePageIcon />} onClick={handleLoad}>Tải Lại</Button>
          <Button variant="contained" color="error" onClick={onBack}>Thoát Game</Button>
        </Box>

        {/* Reviews Section */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" gutterBottom>Đánh giá trò chơi</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
            <Rating value={rating} onChange={(e, val) => setRating(val)} />
            <TextField 
              fullWidth 
              multiline 
              rows={2} 
              placeholder="Nhận xét của bạn..." 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button variant="contained" sx={{ alignSelf: 'flex-start' }} onClick={submitReview}>Gửi đánh giá</Button>
          </Box>

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Nhận xét từ người chơi khác:</Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {reviews.map(rev => (
              <Paper key={rev.id} variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{rev.username}</Typography>
                <Rating value={rev.rating} size="small" readOnly />
                <Typography variant="body2">{rev.comment}</Typography>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
