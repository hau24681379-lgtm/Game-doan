import React, { useState } from 'react';
<<<<<<< HEAD
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
=======
import { Box, Button, TextField, Typography, Paper, Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const API_BASE_URL = 'http://localhost:3000/api';
>>>>>>> 80fe5ea

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
<<<<<<< HEAD
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
=======
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/users/login`, { username, password });
      const userData = res.data.user;
      
      login(userData);
      setAlert({ open: true, message: 'Đăng nhập thành công!', severity: 'success' });
      
      // Delay navigation to show success alert
      setTimeout(() => {
        if (userData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1500);
    } catch (err) {
      setAlert({ open: true, message: err.response?.data?.error || 'Đăng nhập thất bại!', severity: 'error' });
    } finally {
      setLoading(false);
>>>>>>> 80fe5ea
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
<<<<<<< HEAD
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Đăng nhập hệ thống
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
=======
      <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 4 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
          Chào mừng trở lại
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Tên đăng nhập"
            margin="normal"
            required
            disabled={loading}
>>>>>>> 80fe5ea
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
<<<<<<< HEAD
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 3 }}>
            Đăng nhập
          </Button>
        </form>
      </Paper>
=======
            label="Mật khẩu"
            type="password"
            margin="normal"
            required
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button 
            fullWidth 
            variant="contained" 
            size="large"
            type="submit" 
            disabled={loading}
            sx={{ mt: 4, py: 1.5, fontWeight: 'bold', borderRadius: 2 }}
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>
        </form>
      </Paper>

      <Snackbar 
        open={alert.open} 
        autoHideDuration={4000} 
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={alert.severity} sx={{ width: '100%', boxShadow: 3 }}>
          {alert.message}
        </Alert>
      </Snackbar>
>>>>>>> 80fe5ea
    </Box>
  );
}
