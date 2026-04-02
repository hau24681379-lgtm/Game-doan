import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Paper, Avatar, Typography, Grid, Divider, 
  Stack, Chip, Button, CircularProgress, Badge, Tooltip 
} from '@mui/material';
import axios from 'axios';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LogoutIcon from '@mui/icons-material/Logout';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [profRes, achRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/social/profile/${user.id}`),
        axios.get(`${API_BASE_URL}/users/${user.id}/achievements`)
      ]);
      setProfile(profRes.data);
      setAchievements(achRes.data);
    } catch (err) {
      console.error('Failed to fetch profile/achievements:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return <Typography sx={{ p: 5 }}>Vui lòng đăng nhập để xem hồ sơ.</Typography>;
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (!profile) return <Typography align="center" sx={{ mt: 10 }}>Không tìm thấy thông tin người dùng.</Typography>;

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Grid container spacing={4}>
        {/* Profile Info Side */}
        <Grid item xs={12} md={4}>
          <Paper elevation={4} sx={{ p: 4, textAlign: 'center', borderRadius: 4, height: '100%' }}>
            <Badge 
              overlap="circular" 
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box sx={{ 
                  bgcolor: 'gold', p: 0.5, borderRadius: '50%', 
                  border: '3px solid white', fontSize: '1.2rem',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}>🏆</Box>
              }
            >
              <Avatar 
                src={profile.avatar_url} 
                sx={{ 
                  width: 140, height: 140, mx: 'auto', mb: 2, 
                  border: '4px solid #edc948',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                }} 
              />
            </Badge>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 2 }}>{profile.username}</Typography>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              {user.role === 'admin' ? 'Quản trị viên Hệ thống' : 'Game thủ Chuyên nghiệp'}
            </Typography>
            
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
              <Chip icon={<EmojiEventsIcon />} label={`Tổng: ${profile.totalScore} pts`} color="primary" />
            </Stack>

            <Divider sx={{ my: 3 }} />
            
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
              Thành viên từ: {new Date(profile.created_at).toLocaleDateString()}
            </Typography>

            <Button 
                fullWidth 
                variant="outlined" 
                color="error" 
                startIcon={<LogoutIcon />} 
                onClick={handleLogout}
                sx={{ borderRadius: 3 }}
            >
                Đăng xuất
            </Button>
          </Paper>
        </Grid>

        {/* Content Side */}
        <Grid item xs={12} md={8}>
          <Stack spacing={4}>
            
            {/* Achievements Collection */}
            <Paper elevation={4} sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center' }}>
                 🏆 Huy chương & Thành tựu ({achievements.length})
              </Typography>
              <Grid container spacing={2}>
                {achievements.length > 0 ? achievements.map(ach => (
                  <Grid item xs={4} sm={3} key={ach.id}>
                    <Tooltip title={ach.description} arrow>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', 
                          borderRadius: 4, bgcolor: 'background.default',
                          border: '1px solid rgba(255,215,0,0.3)',
                          transition: '0.3s',
                          '&:hover': { 
                            bgcolor: 'rgba(255,215,0,0.1)', 
                            transform: 'translateY(-5px)',
                            borderColor: 'gold' 
                          }
                        }}
                      >
                        <Avatar src={ach.icon_url} sx={{ width: 50, height: 50, mb: 1, bgcolor: 'transparent' }} />
                        <Typography variant="caption" align="center" sx={{ fontWeight: 'bold' }}>{ach.name}</Typography>
                      </Paper>
                    </Tooltip>
                  </Grid>
                )) : (
                  <Box sx={{ p: 4, width: '100%', textAlign: 'center' }}>
                    <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      Chưa có thành tựu nào. Hãy tham gia trò chơi để thăng hạng!
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Paper>

            {/* Match History */}
            <Paper elevation={4} sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>📊 Lịch sử trò chơi</Typography>
              <Grid container spacing={2}>
                {profile.sessions && profile.sessions.length > 0 ? profile.sessions.map((s, i) => (
                  <Grid item xs={12} key={i}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{s.game_name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Ngày chơi: {new Date(s.updated_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'black' }}>
                                +{s.score}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">điểm số</Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                )) : (
                  <Box sx={{ p: 4, width: '100%', textAlign: 'center' }}>
                    <Typography color="text.secondary">Bạn chưa chơi trò chơi nào.</Typography>
                  </Box>
                )}
              </Grid>
            </Paper>

          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
