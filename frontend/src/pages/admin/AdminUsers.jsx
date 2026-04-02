import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Chip, Button, CircularProgress, Alert, Snackbar, Stack, Avatar,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../utils/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Edit State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUsername, setNewUsername] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (e) {
      console.error(e);
      setSnackbar({ open: true, message: 'Lỗi nạp danh sách thành viên.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    if (currentRole === 'admin') return; // Double safety
    try {
      await api.put(`/admin/users/${userId}/role`, { role: 'admin' });
      setSnackbar({ open: true, message: 'Thăng cấp Admin thành công!', severity: 'success' });
      fetchUsers();
    } catch (e) {
      setSnackbar({ open: true, message: 'Lỗi khi cập nhật quyền hạn.', severity: 'error' });
    }
  };

  const handleDelete = async (userId, role) => {
    if (role === 'admin') {
      setSnackbar({ open: true, message: 'Không thể xóa tài khoản Quản trị!', severity: 'error' });
      return;
    }
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      setSnackbar({ open: true, message: 'Xóa người dùng thành công.', severity: 'success' });
      fetchUsers();
    } catch (e) {
      setSnackbar({ open: true, message: 'Lỗi khi xóa người dùng.', severity: 'error' });
    }
  };

  const handleOpenEdit = (user) => {
    setCurrentUser(user);
    setNewUsername(user.username);
    setEditDialogOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      await api.put(`/admin/users/${currentUser.id}`, { username: newUsername });
      setSnackbar({ open: true, message: 'Cập nhật thông tin thành công.', severity: 'success' });
      setEditDialogOpen(false);
      fetchUsers();
    } catch (e) {
      setSnackbar({ open: true, message: 'Lỗi khi cập nhật thông tin.', severity: 'error' });
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" fontWeight={900}>Thành Viên Hệ Thống</Typography>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 6, bgcolor: 'background.paper', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', py: 2.5 }}>THÀNH VIÊN</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>VAI TRÒ</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>NGÀY THAM GIA</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>HÀNH ĐỘNG</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: u.role === 'admin' ? 'secondary.main' : 'primary.main' }}>{u.username[0].toUpperCase()}</Avatar>
                    <Box>
                       <Typography fontWeight="bold">{u.username}</Typography>
                       <Typography variant="caption" color="text.secondary">ID: #{u.id}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                   <Chip 
                     icon={u.role === 'admin' ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                     label={u.role.toUpperCase()} 
                     color={u.role === 'admin' ? 'secondary' : 'default'}
                     variant="outlined"
                   />
                </TableCell>
                <TableCell>{new Date(u.created_at).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {u.role !== 'admin' && (
                      <>
                        <IconButton size="small" color="primary" onClick={() => handleOpenEdit(u)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(u.id, u.role)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                    <Button 
                      variant="contained" 
                      size="small"
                      disabled={u.role === 'admin'}
                      onClick={() => handleRoleToggle(u.id, u.role)}
                      sx={{ borderRadius: 2, background: u.role === 'admin' ? '#555' : '#3b82f6' }}
                    >
                      {u.role === 'admin' ? 'ADMIN' : 'Thăng Admin'}
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold' }}>Chỉnh sửa người dùng</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Tên đăng nhập mới"
              variant="outlined"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveUser}>Lưu thay đổi</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 3 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
