import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Tabs, Tab, TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, Stack, Divider, IconButton, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const API_BASE_URL = 'http://localhost:3000/api';

export default function Social() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchMessages();
      fetchReceivedRequests();
    }
  }, [user]);

  const fetchFriends = () => {
    axios.get(`${API_BASE_URL}/social/friends/${user.id}`).then(res => setFriends(res.data));
  };

  const fetchMessages = () => {
    axios.get(`${API_BASE_URL}/social/messages/inbox/${user.id}`).then(res => setMessages(res.data));
  };

  const fetchReceivedRequests = () => {
    axios.get(`${API_BASE_URL}/social/friends/received/${user.id}`).then(res => setReceivedRequests(res.data));
  };

  const handleSearch = () => {
    axios.get(`${API_BASE_URL}/social/users/search?q=${search}`).then(res => setSearchResults(res.data));
  };

  const addFriend = (id) => {
    axios.post(`${API_BASE_URL}/social/friends/request`, { user_id: user.id, friend_id: id })
      .then(() => {
        alert('Đã gửi lời mời!');
        handleSearch();
      })
      .catch(e => alert(e.response?.data?.error || 'Lỗi'));
  };

  const respondRequest = (id, status) => {
    axios.post(`${API_BASE_URL}/social/friends/respond`, { id, status })
      .then(() => {
        fetchReceivedRequests();
        fetchFriends();
      });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 6, minHeight: 600 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="fullWidth">
          <Tab label="Tìm kiếm" />
          <Tab label="Bạn bè" />
          <Tab label="Lời mời" icon={receivedRequests.length > 0 ? <Chip label={receivedRequests.length} size="small" color="error" /> : null} iconPosition="end" />
          <Tab label="Hộp thư" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {!user && <Typography color="error">Vui lòng đăng nhập để sử dụng tính năng này.</Typography>}
          
          {user && tab === 0 && (
            <Box>
              <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
                <TextField fullWidth placeholder="Tìm theo tên..." value={search} onChange={e => setSearch(e.target.value)} />
                <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch}>Tìm</Button>
              </Stack>
              <List>
                {searchResults.map(u => (
                  <ListItem key={u.id}>
                    <ListItemAvatar><Avatar src={u.avatar_url} /></ListItemAvatar>
                    <ListItemText primary={u.username} />
                    {u.id !== user.id && (
                      <Button variant="outlined" size="small" onClick={() => addFriend(u.id)}>Kết bạn</Button>
                    )}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {user && tab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Danh sách bạn bè ({friends.length})</Typography>
              <List>
                {friends.map(f => (
                  <ListItem key={f.id}>
                    <ListItemAvatar><Avatar src={f.avatar_url} /></ListItemAvatar>
                    <ListItemText primary={f.username} secondary="Trực tuyến" />
                    <IconButton color="primary"><SendIcon /></IconButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {user && tab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>Lời mời đã nhận ({receivedRequests.length})</Typography>
              <List>
                {receivedRequests.map(r => (
                  <ListItem key={r.id}>
                    <ListItemAvatar><Avatar src={r.avatar_url} /></ListItemAvatar>
                    <ListItemText primary={r.username} secondary={new Date(r.created_at).toLocaleDateString()} />
                    <Stack direction="row" spacing={1}>
                      <Button variant="contained" color="success" size="small" startIcon={<CheckIcon />} onClick={() => respondRequest(r.id, 'accepted')}>Chấp nhận</Button>
                      <Button variant="outlined" color="error" size="small" startIcon={<CloseIcon />} onClick={() => respondRequest(r.id, 'rejected')}>Từ chối</Button>
                    </Stack>
                  </ListItem>
                ))}
                {receivedRequests.length === 0 && <Typography color="text.secondary">Không có lời mời nào đang chờ.</Typography>}
              </List>
            </Box>
          )}

          {user && tab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>Tin nhắn đến</Typography>
              <List>
                {messages.map(m => (
                  <ListItem key={m.id} alignItems="flex-start" sx={{ mb: 1, bgcolor: m.is_read ? '' : 'rgba(33, 150, 243, 0.05)', borderRadius: 2 }}>
                    <ListItemAvatar><Avatar src={m.sender_avatar} /></ListItemAvatar>
                    <ListItemText 
                      primary={m.sender_name} 
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" color="text.primary">{m.content}</Typography>
                          {" — " + new Date(m.created_at).toLocaleString()}
                        </React.Fragment>
                      } 
                    />
                  </ListItem>
                ))}
                {messages.length === 0 && <Typography color="text.secondary">Không có tin nhắn nào.</Typography>}
              </List>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
