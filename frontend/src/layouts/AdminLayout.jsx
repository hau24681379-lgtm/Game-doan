import React from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Container, Box, IconButton, useTheme,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Stack 
} from '@mui/material';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import { useUser } from '../context/UserContext';

const DRAWER_WIDTH = 260;

export default function AdminLayout({ toggleColorMode }) {
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const menuItems = [
    { text: 'Tổng Quan', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Người Dùng', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Trò Chơi', icon: <SportsEsportsIcon />, path: '/admin/games' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      
      {/* Sidebar - Premium Design */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            background: 'linear-gradient(180deg, #111111 0%, #1a1a1a 100%)',
            color: 'white'
          },
        }}
      >
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 2, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
             🛡️ ADMIN
          </Typography>
        </Box>

        <List sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: 3,
                    bgcolor: active ? 'rgba(33, 150, 243, 0.15)' : 'transparent',
                    color: active ? '#2196f3' : 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      color: 'white'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: active ? '#2196f3' : 'inherit', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: active ? 'bold' : 'medium' }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ mt: 'auto', p: 2 }}>
          <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.05)' }} />
          <List>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton onClick={() => navigate('/')} sx={{ borderRadius: 3, color: 'rgba(255,255,255,0.7)' }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><HomeIcon /></ListItemIcon>
                <ListItemText primary="Quay lại Portal" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: 3, color: '#f44336' }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Đăng xuất" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, width: `calc(100% - ${DRAWER_WIDTH}px)` }}>
        {/* Header Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ opacity: 0.9 }}>
            {menuItems.find(m => m.path === location.pathname)?.text || 'Quản Trị'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <Typography variant="body2" color="text.secondary">Chào, <b>{user?.username}</b></Typography>
             <IconButton size="small"><SettingsIcon /></IconButton>
          </Box>
        </Box>

        {/* Page Content */}
        <Outlet />
      </Box>
    </Box>
  );
}
