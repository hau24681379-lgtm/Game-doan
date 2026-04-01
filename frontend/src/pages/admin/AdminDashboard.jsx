import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, Stack, CircularProgress, Alert } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import GamesIcon from '@mui/icons-material/Games';
import RateReviewIcon from '@mui/icons-material/RateReview';
import api from '../../utils/api';

const StatCard = ({ title, value, icon, gradient }) => (
  <Card sx={{ 
    height: '100%', 
    borderRadius: 6, 
    position: 'relative', 
    overflow: 'hidden',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
    background: gradient || 'rgba(255, 255, 255, 0.03)',
  }}>
    <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1, transform: 'scale(3)', color: 'white' }}>{icon}</Box>
    <CardContent sx={{ p: 4 }}>
      <Stack direction="row" spacing={3} alignItems="center">
        <Box sx={{ p: 2, borderRadius: 4, bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>{React.cloneElement(icon, { sx: { fontSize: 32 } })}</Box>
        <Box>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 'bold', textTransform: 'uppercase' }}>{title}</Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, color: 'white' }}>{value}</Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api.get('/admin/stats');
      setData(res.data);
    } catch (e) {
      console.error(e);
      setData({ error: e.response?.data?.error || 'Lỗi hệ thống khi nạp dữ liệu.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>;
  if (!data || data.error) return <Box sx={{ p: 4 }}><Alert severity="error" variant="filled" sx={{ borderRadius: 4 }}>{data?.error || 'Lỗi kết nối máy chủ.'}</Alert></Box>;

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 900 }}>Thống Kê Hệ Thống</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Thành Viên" value={data.stats.users} icon={<PeopleIcon />} gradient="linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Trò Chơi" value={data.stats.games} icon={<SportsEsportsIcon />} gradient="linear-gradient(135deg, #064e3b 0%, #10b981 100%)" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Phiên Chơi" value={data.stats.sessions} icon={<GamesIcon />} gradient="linear-gradient(135deg, #78350f 0%, #f59e0b 100%)" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Đánh Giá" value={data.stats.reviews} icon={<RateReviewIcon />} gradient="linear-gradient(135deg, #7f1d1d 0%, #ef4444 100%)" /></Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 4, borderRadius: 6, bgcolor: 'rgba(255,255,255,0.02)' }}>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 'bold' }}>Thành viên mới nhất</Typography>
            <Stack spacing={2}>
              {data.recentUsers.map(u => (
                <Box key={u.id} sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 4 }}>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Box sx={{ width: 45, height: 45, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{u.username[0].toUpperCase()}</Box>
                    <Box>
                      <Typography fontWeight="bold">{u.username}</Typography>
                      <Typography variant="caption" color="text.secondary">{u.role} • ID: {u.id}</Typography>
                    </Box>
                  </Stack>
                  <Typography variant="caption" sx={{ opacity: 0.6 }}>{new Date(u.created_at).toLocaleDateString('vi-VN')}</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </Box>
  );
}
