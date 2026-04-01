import React, { useState, useEffect } from 'react';
import { Box, Paper, Avatar, Typography, Grid, Divider, List, ListItem, ListItemText, Stack, Chip, Button } from '@mui/material';
import axios from 'axios';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LogoutIcon from '@mui/icons-material/Logout';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      axios.get(`${API_BASE_URL}/social/profile/${user.id}`)
        .then(res => setProfile(res.data))
        .catch(e => console.error(e));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return <Typography sx={{ p: 5 }}>Vui lòng đăng nhập để xem hồ sơ.</Typography>;
  if (!profile) return <Typography sx={{ p: 5 }}>Đang tải hồ sơ...</Typography>;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 6, bgcolor: 'background.paper' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item>
            <Avatar src={profile.avatar_url} sx={{ width: 120, height: 120, border: '4px solid #2196f3' }} />
          </Grid>
          <Grid item xs={12} sm>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{profile.username}</Typography>
            <Typography variant="subtitle1" color="text.secondary">Thành viên từ: {new Date(profile.created_at).toLocaleDateString('vi-VN')}</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Chip icon={<EmojiEventsIcon />} label={`Tổng điểm: ${profile.totalScore}`} color="primary" />
              <Chip label={user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'} color="secondary" variant="outlined" />
            </Stack>
          </Grid>
          <Grid item>
             <Button variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>Đăng xuất</Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          {user.role === 'admin' ? 'Hoạt động quản trị gần đây' : 'Lịch sử trò chơi'}
        </Typography>
        <Grid container spacing={3}>
           {profile.sessions.length > 0 ? profile.sessions.map((s, i) => (
             <Grid item xs={12} md={6} key={i}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{s.game_name}</Typography>
                            <Typography variant="body2" color="text.secondary">Ngày chơi: {new Date(s.updated_at).toLocaleDateString('vi-VN')}</Typography>
                        </Box>
                        <Typography variant="h4" color="primary.main">+{s.score}</Typography>
                    </Box>
                </Paper>
             </Grid>
           )) : (
             <Grid item xs={12}>
                <Typography color="text.secondary">Chưa có lịch sử hoạt động.</Typography>
             </Grid>
           )}
        </Grid>
      </Paper>
    </Box>
  );
}
