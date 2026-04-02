import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Paper, Typography, Tabs, Tab, TextField, List, ListItem, 
  ListItemAvatar, Avatar, ListItemText, Button, Stack, 
  IconButton, Chip, TablePagination, CircularProgress, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const API_BASE_URL = 'http://localhost:3000/api';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ p: 0, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Social() {
  const { user } = useUser();
  const [tab, setTab] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [msgsLoading, setMsgsLoading] = useState(false);
  
  // Search
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Friends
  const [friends, setFriends] = useState([]);
  const [friendPage, setFriendPage] = useState(0);
  const [totalFriends, setTotalFriends] = useState(0);

  // Messages
  const [messages, setMessages] = useState([]);
  const [msgPage, setMsgPage] = useState(0);
  const [totalMsgs, setTotalMsgs] = useState(0);

  // Requests
  const [receivedRequests, setReceivedRequests] = useState([]);

  // Compose Message Dialog
  const [msgDialog, setMsgDialog] = useState({ open: false, friend: null, content: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const fetchFriends = useCallback(async () => {
    if (!user) return;
    setFriendsLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/social/friends/${user.id}?page=${friendPage + 1}&limit=5`);
      setFriends(res.data.data || []);
      setTotalFriends(res.data.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setFriendsLoading(false);
    }
  }, [user, friendPage]);

  const fetchMessages = useCallback(async () => {
    if (!user) return;
    setMsgsLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/social/messages/inbox/${user.id}?page=${msgPage + 1}&limit=5`);
      setMessages(res.data.data || []);
      setTotalMsgs(res.data.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setMsgsLoading(false);
    }
  }, [user, msgPage]);

  const fetchReceivedRequests = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/social/friends/received/${user.id}`);
      setReceivedRequests(res.data || []);
    } catch (e) { console.error(e); }
  }, [user]);

  useEffect(() => {
    if (user) {
      if (tab === 1) fetchFriends();
      if (tab === 2) fetchReceivedRequests();
      if (tab === 3) fetchMessages();
    }
  }, [tab, user, fetchFriends, fetchMessages, fetchReceivedRequests]);

  const handleSearch = async () => {
    if (!search) return;
    setSearchLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/social/users/search?q=${search}`);
      setSearchResults(res.data.data || res.data);
    } catch (e) { console.error(e); }
    setSearchLoading(false);
  };

  const addFriend = (id) => {
    axios.post(`${API_BASE_URL}/social/friends/request`, { user_id: user.id, friend_id: id })
      .then(() => alert('Đã gửi lời mời kết bạn!'))
      .catch(e => alert(e.response?.data?.error || 'Lỗi gửi lời mời'));
  };

  const respondRequest = (id, status) => {
    axios.post(`${API_BASE_URL}/social/friends/respond`, { id, status })
      .then(() => {
        fetchReceivedRequests();
        if (status === 'accepted') fetchFriends();
      });
  };

  const openMessageDialog = (friend) => {
    setMsgDialog({ open: true, friend, content: '' });
  };

  const handleSendMessage = async () => {
    if (!msgDialog.content.trim()) return;
    try {
      await axios.post(`${API_BASE_URL}/social/messages/send`, {
        sender_id: user.id,
        receiver_id: msgDialog.friend.id,
        content: msgDialog.content
      });
      setSnackbar({ open: true, message: 'Đã gửi tin nhắn!', severity: 'success' });
      setMsgDialog({ open: false, friend: null, content: '' });
    } catch (e) {
      setSnackbar({ open: true, message: 'Lỗi khi gửi tin nhắn', severity: 'error' });
    }
  };

  if (!user) return <Typography sx={{ p: 5 }}>Vui lòng đăng nhập để sử dụng tính năng Mạng xã hội.</Typography>;

  return (
    <Box sx={{ maxWidth: 850, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Paper elevation={6} sx={{ borderRadius: 6, overflow: 'hidden', minHeight: 650, display: 'flex', flexDirection: 'column' }}>
        <Tabs 
          value={tab} 
          onChange={(e, v) => setTab(v)} 
          variant="fullWidth" 
          indicatorColor="primary" 
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'rgba(255,255,255,0.02)' }}
        >
          <Tab label="Khám phá" sx={{ fontWeight: 'bold' }} />
          <Tab label="Bạn bè" sx={{ fontWeight: 'bold' }} />
          <Tab label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Lời mời {receivedRequests.length > 0 && <Chip label={receivedRequests.length} size="small" color="error" />}
            </Box>
          } sx={{ fontWeight: 'bold' }} />
          <Tab label="Tin nhắn" sx={{ fontWeight: 'bold' }} />
        </Tabs>

        <Box sx={{ flexGrow: 1, position: 'relative' }}>
          {/* Tab 0: Search */}
          <TabPanel value={tab} index={0}>
            <Box sx={{ p: 3 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
                <TextField 
                  fullWidth 
                  variant="outlined" 
                  placeholder="Tìm kiếm người chơi mới..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  sx={{ bgcolor: 'background.default', borderRadius: 2 }}
                />
                <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch} sx={{ px: 4, borderRadius: 2 }}>Tìm</Button>
              </Stack>
              {searchLoading ? <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} /> : (
                <List>
                  {searchResults.map(u => (
                    <ListItem key={u.id} sx={{ bgcolor: 'rgba(255,255,255,0.03)', mb: 1.5, borderRadius: 3, p: 2 }}>
                      <ListItemAvatar><Avatar src={u.avatar_url} sx={{ width: 50, height: 50 }} /></ListItemAvatar>
                      <ListItemText primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{u.username}</Typography>} />
                      {u.id !== user.id && (
                        <Button variant="outlined" size="small" onClick={() => addFriend(u.id)} sx={{ borderRadius: 2 }}>Gửi lời mời</Button>
                      )}
                    </ListItem>
                  ))}
                  {search && searchResults.length === 0 && <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>Không tìm thấy người chơi nào.</Typography>}
                </List>
              )}
            </Box>
          </TabPanel>

          {/* Tab 1: Friends List */}
          <TabPanel value={tab} index={1}>
            <Box sx={{ p: 3, flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>Danh sách bạn bè ({totalFriends})</Typography>
              {friendsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
              ) : (
                <List sx={{ width: '100%' }}>
                  {friends.length > 0 ? friends.map(f => (
                    <ListItem key={f.id} sx={{ bgcolor: 'rgba(255,255,255,0.03)', mb: 1.5, borderRadius: 3, p: 2 }}>
                      <ListItemAvatar><Avatar src={f.avatar_url} sx={{ width: 50, height: 50 }} /></ListItemAvatar>
                      <ListItemText primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{f.username}</Typography>} secondary={<Typography variant="caption" color="success.main">Đang trực tuyến</Typography>} />
                      <IconButton color="primary" onClick={() => openMessageDialog(f)} sx={{ bgcolor: 'rgba(33, 150, 243, 0.1)' }}><SendIcon /></IconButton>
                    </ListItem>
                  )) : (
                    <Typography align="center" color="text.secondary" sx={{ py: 8 }}>Bạn chưa có người bạn nào. Hãy đi kết bạn nhé!</Typography>
                  )}
                </List>
              )}
            </Box>
            <Divider />
            <TablePagination
              component="div"
              count={totalFriends}
              page={friendPage}
              onPageChange={(e, p) => setFriendPage(p)}
              rowsPerPage={5}
              rowsPerPageOptions={[5]}
              labelRowsPerPage=""
              sx={{ bgcolor: 'rgba(255,255,255,0.01)' }}
            />
          </TabPanel>

          {/* Tab 2: Invitations */}
          <TabPanel value={tab} index={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>Lời mời đã nhận ({receivedRequests.length})</Typography>
              <List>
                {receivedRequests.map(r => (
                  <ListItem key={r.id} sx={{ bgcolor: 'rgba(255,255,255,0.03)', mb: 1.5, borderRadius: 3, p: 2 }}>
                    <ListItemAvatar><Avatar src={r.avatar_url} sx={{ width: 50, height: 50 }} /></ListItemAvatar>
                    <ListItemText primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{r.username}</Typography>} secondary={`Gửi lúc: ${new Date(r.created_at).toLocaleDateString()}`} />
                    <Stack direction="row" spacing={1}>
                      <Button variant="contained" color="success" size="small" startIcon={<CheckIcon />} onClick={() => respondRequest(r.id, 'accepted')} sx={{ borderRadius: 2 }}>Đồng ý</Button>
                      <Button variant="outlined" color="error" size="small" startIcon={<CloseIcon />} onClick={() => respondRequest(r.id, 'rejected')} sx={{ borderRadius: 2 }}>Từ chối</Button>
                    </Stack>
                  </ListItem>
                ))}
                {receivedRequests.length === 0 && <Typography align="center" color="text.secondary" sx={{ py: 8 }}>Không có lời mời nào đang chờ.</Typography>}
              </List>
            </Box>
          </TabPanel>

          {/* Tab 3: Messages */}
          <TabPanel value={tab} index={3}>
            <Box sx={{ p: 3, flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>Hộp thư đến ({totalMsgs})</Typography>
              {msgsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
              ) : (
                <List>
                  {messages.length > 0 ? messages.map(m => (
                    <ListItem key={m.id} sx={{ bgcolor: 'rgba(255,255,255,0.03)', mb: 1.5, borderRadius: 3, p: 2 }}>
                      <ListItemAvatar><Avatar src={m.sender_avatar} sx={{ width: 50, height: 50 }} /></ListItemAvatar>
                      <ListItemText 
                        primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{m.sender_name}</Typography>} 
                        secondary={
                          <Box component="span" sx={{ display: 'block', mt: 0.5 }}>
                            <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>{m.content}</Typography>
                            <Typography variant="caption" color="text.secondary">{new Date(m.created_at).toLocaleString()}</Typography>
                          </Box>
                        } 
                      />
                    </ListItem>
                  )) : (
                    <Typography align="center" color="text.secondary" sx={{ py: 8 }}>Hộp thư đến của bạn đang trống.</Typography>
                  )}
                </List>
              )}
            </Box>
            <Divider />
            <TablePagination
              component="div"
              count={totalMsgs}
              page={msgPage}
              onPageChange={(e, p) => setMsgPage(p)}
              rowsPerPage={5}
              rowsPerPageOptions={[5]}
              labelRowsPerPage=""
              sx={{ bgcolor: 'rgba(255,255,255,0.01)' }}
            />
          </TabPanel>
        </Box>
      </Paper>

      {/* Message Dialog */}
      <Dialog open={msgDialog.open} onClose={() => setMsgDialog({ ...msgDialog, open: false })} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold' }}>Nhắn tin cho {msgDialog.friend?.username}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nội dung"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={msgDialog.content}
            onChange={(e) => setMsgDialog({ ...msgDialog, content: e.target.value })}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setMsgDialog({ ...msgDialog, open: false })}>Hủy</Button>
          <Button onClick={handleSendMessage} variant="contained" endIcon={<SendIcon />}>Gửi</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
