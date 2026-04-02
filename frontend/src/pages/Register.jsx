import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert, Snackbar, Stack, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.username.length < 3 || formData.username.includes(' ')) {
      setAlert({ open: true, message: 'Tên đăng nhập phải >= 3 ký tự và không chứa khoảng trắng!', severity: 'error' });
      return;
    }
    if (formData.password.length < 6) {
      setAlert({ open: true, message: 'Mật khẩu quá ngắn, phải từ 6 ký tự trở lên!', severity: 'error' });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setAlert({ open: true, message: 'Mật khẩu xác nhận không khớp!', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      console.log('[Registering]: Sending request to:', `${API_BASE_URL}/users/register`, { username: formData.username });
      const res = await axios.post(`${API_BASE_URL}/users/register`, { 
        username: formData.username, 
        password: formData.password 
      });
      
      console.log('[Register Success]:', res.data);
      setAlert({ open: true, message: 'Đăng ký thành công! Đang chuyển hướng...', severity: 'success' });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('[Register Error]:', err.response || err);
      setAlert({ 
        open: true, 
        message: err.response?.data?.error || `Lỗi kết nối: ${err.message}`, 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <Paper elevation={12} sx={{ 
        p: 5, 
        width: '100%', 
        maxWidth: 450, 
        borderRadius: 6, 
        bgcolor: 'background.paper',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
      }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 900, mb: 1, color: 'primary.main' }}>
          Gia Nhập Ngay
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Tạo tài khoản để tham gia đấu trường Board Game
        </Typography>

        <form onSubmit={handleRegister}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Tên đăng nhập"
              name="username"
              required
              disabled={loading}
              value={formData.username}
              onChange={handleChange}
              variant="filled"
              sx={{ '& .MuiFilledInput-root': { borderRadius: 3 } }}
            />
            <TextField
              fullWidth
              label="Mật khẩu"
              name="password"
              type="password"
              required
              disabled={loading}
              value={formData.password}
              onChange={handleChange}
              variant="filled"
              sx={{ '& .MuiFilledInput-root': { borderRadius: 3 } }}
            />
            <TextField
              fullWidth
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              type="password"
              required
              disabled={loading}
              value={formData.confirmPassword}
              onChange={handleChange}
              variant="filled"
              sx={{ '& .MuiFilledInput-root': { borderRadius: 3 } }}
            />
            
            <Button 
              fullWidth 
              variant="contained" 
              size="large"
              type="submit" 
              disabled={loading}
              sx={{ 
                py: 2, 
                fontWeight: 'bold', 
                borderRadius: 4, 
                fontSize: '1.1rem',
                boxShadow: '0 8px 16px rgba(33, 150, 243, 0.3)'
              }}
            >
              {loading ? 'Đang tạo tài khoản...' : 'Đăng Ký Miễn Phí'}
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Đã có tài khoản?{' '}
              <Link component={RouterLink} to="/login" sx={{ fontWeight: 'bold', textDecoration: 'none' }}>
                Đăng nhập tại đây
              </Link>
            </Typography>
          </Stack>
        </form>
      </Paper>

      <Snackbar 
        open={alert.open} 
        autoHideDuration={5000} 
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={alert.severity} variant="filled" sx={{ width: '100%', borderRadius: 3 }}>
          {alert.message}
        </Alert>
      </Snackbar>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}
