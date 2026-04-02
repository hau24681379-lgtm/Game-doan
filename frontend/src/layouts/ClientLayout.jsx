import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, useTheme, Stack, Avatar } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PeopleIcon from '@mui/icons-material/People';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useUser } from '../context/UserContext';

export default function ClientLayout({ toggleColorMode }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper', color: 'text.primary' }}>
        <Toolbar>
          <Typography 
            variant="h5" 
            sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 'bold', letterSpacing: 1, color: 'primary.main' }} 
            onClick={() => navigate('/')}
          >
            🎮 GAME CENTER
          </Typography>
          
          <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
            <Button color="inherit" startIcon={<LeaderboardIcon />} onClick={() => navigate('/ranking')}>Bảng điểm</Button>
            <Button color="inherit" startIcon={<PeopleIcon />} onClick={() => navigate('/social')}>Cộng đồng</Button>
            {user && (
              <Button color="inherit" startIcon={<AccountCircleIcon />} onClick={() => navigate('/profile')}>Hồ sơ</Button>
            )}
            {user?.role === 'admin' && (
              <Button color="secondary" variant="contained" startIcon={<AdminPanelSettingsIcon />} onClick={() => navigate('/admin')} sx={{ ml: 1 }}>Admin</Button>
            )}
          </Stack>

          {!user ? (
            <Button variant="outlined" color="inherit" onClick={() => navigate('/login')} sx={{ mr: 2 }}>Đăng nhập</Button>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2, bgcolor: 'action.hover', px: 2, py: 0.5, borderRadius: 10 }}>
              <Avatar src={user.avatar_url} sx={{ width: 32, height: 32 }} />
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{user.username}</Typography>
            </Box>
          )}
          
          <IconButton onClick={toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 4, maxWidth: '1200px !important' }}>
        <Outlet />
      </Container>
      <Box component="footer" sx={{ py: 3, textAlign: 'center', opacity: 0.5, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
        <Typography variant="body2">© 2026 Game Store Platform - Advanced Final Project</Typography>
      </Box>
    </Box>
  );
}
