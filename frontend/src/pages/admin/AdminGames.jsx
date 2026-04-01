import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  IconButton, Switch, TextField, CircularProgress, Alert, Snackbar, Stack 
} from '@mui/material';
import GamesIcon from '@mui/icons-material/Games';
import SaveIcon from '@mui/icons-material/Save';
import api from '../../utils/api';

export default function AdminGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingConfig, setEditingConfig] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchGames = async () => {
    try {
      const res = await api.get('/admin/games');
      setGames(res.data);
      const configs = {};
      res.data.forEach(g => {
        const parsed = typeof g.config === 'string' ? JSON.parse(g.config || '{}') : (g.config || {});
        configs[g.id] = parsed;
      });
      setEditingConfig(configs);
    } catch (e) {
      console.error(e);
      setSnackbar({ open: true, message: 'Lỗi nạp danh sách trò chơi.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGames(); }, []);

  const handleToggleActive = async (gameId, currentActive) => {
    try {
      const game = games.find(g => g.id === gameId);
      await api.put(`/admin/games/${gameId}`, {
        ...game,
        is_active: !currentActive,
        config: editingConfig[gameId]
      });
      setSnackbar({ open: true, message: 'Cập nhật thành công!', severity: 'success' });
      fetchGames();
    } catch (e) {
      setSnackbar({ open: true, message: 'Lỗi khi cập nhật trò chơi.', severity: 'error' });
    }
  };

  const handleSave = async (gameId) => {
    try {
      const game = games.find(g => g.id === gameId);
      await api.put(`/admin/games/${gameId}`, {
        ...game,
        config: editingConfig[gameId]
      });
      setSnackbar({ open: true, message: 'Lưu cấu hình thành công!', severity: 'success' });
      fetchGames();
    } catch (e) {
      setSnackbar({ open: true, message: 'Lỗi khi lưu cấu hình.', severity: 'error' });
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <GamesIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" fontWeight={900}>Kho Trò Chơi</Typography>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 6, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', py: 3, width: '25%' }}>TRÒ CHƠI</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>MÔ TẢ</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>TRẠNG THÁI</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>CỐ ĐỊNH SIZE</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>LƯU</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((g) => (
              <TableRow key={g.id} hover>
                <TableCell>
                  <Typography fontWeight="black">{g.name}</Typography>
                  <Typography variant="caption" color="text.secondary">SLUG: {g.slug}</Typography>
                </TableCell>
                <TableCell>
                   <Typography variant="body2" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.description}</Typography>
                </TableCell>
                <TableCell>
                   <Stack direction="row" spacing={1} alignItems="center">
                     <Switch checked={g.is_active} onChange={() => handleToggleActive(g.id, g.is_active)} color="success" />
                     <Typography variant="caption" sx={{ color: g.is_active ? 'success.main' : 'error.main', fontWeight: 'bold' }}>{g.is_active ? 'ON' : 'OFF'}</Typography>
                   </Stack>
                </TableCell>
                <TableCell>
                  {/* Caro 4, Caro 5 common grid_size config */}
                  {(g.slug === 'caro-5' || g.slug === 'caro-4') && (
                    <TextField 
                       size="small" type="number" label="Grid Size"
                       value={editingConfig[g.id]?.grid_size || (g.slug === 'caro-4' ? 10 : 15)}
                       onChange={(e) => setEditingConfig(prev => ({ ...prev, [g.id]: { ...prev[g.id], grid_size: parseInt(e.target.value) } }))}
                       sx={{ width: 120, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}
                    />
                  )}
                  {/* Snake config: speed */}
                  {g.slug === 'snake' && (
                    <TextField 
                       size="small" type="number" label="Speed (ms)"
                       value={editingConfig[g.id]?.speed || 150}
                       onChange={(e) => setEditingConfig(prev => ({ ...prev, [g.id]: { ...prev[g.id], speed: parseInt(e.target.value) } }))}
                       sx={{ width: 120, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}
                    />
                  )}
                  {/* Match 3 config: grid_size */}
                  {g.slug === 'match-3' && (
                    <TextField 
                       size="small" type="number" label="Grid Size"
                       value={editingConfig[g.id]?.grid_size || 8}
                       onChange={(e) => setEditingConfig(prev => ({ ...prev, [g.id]: { ...prev[g.id], grid_size: parseInt(e.target.value) } }))}
                       sx={{ width: 120, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}
                    />
                  )}
                  {/* Default fallback for TTT, Memory, Draw */}
                  {!['caro-5', 'caro-4', 'snake', 'match-3'].includes(g.slug) && (
                    <Typography variant="caption" color="text.secondary">Mặc định</Typography>
                  )}
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                   <IconButton onClick={() => handleSave(g.id)} color="primary" sx={{ bgcolor: 'rgba(33, 150, 243, 0.1)', borderRadius: 2 }}>
                     <SaveIcon />
                   </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 3 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
