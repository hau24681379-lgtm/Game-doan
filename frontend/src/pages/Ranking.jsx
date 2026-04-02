import React, { useState, useEffect, useCallback } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Chip, Tabs, Tab, TablePagination, CircularProgress } from '@mui/material';
import axios from 'axios';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { useUser } from '../context/UserContext';

const API_BASE_URL = 'http://localhost:3000/api';

export default function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const fetchRanking = useCallback(() => {
    setLoading(true);
    const userIdParam = user ? `&user_id=${user.id}` : '';
    axios.get(`${API_BASE_URL}/social/ranking?type=${tab}${userIdParam}&page=${page + 1}&limit=${rowsPerPage}`)
      .then(res => {
        setRanking(res.data.data || []);
        setTotal(res.data.pagination?.total || res.data.total || 0);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [tab, user, page, rowsPerPage]);

  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);

  const getMedalColor = (index) => {
    if (index === 0) return '#ffd700'; // Gold
    if (index === 1) return '#c0c0c0'; // Silver
    if (index === 2) return '#cd7f32'; // Bronze
    return 'transparent';
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 4, textAlign: 'center' }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, background: 'linear-gradient(45deg, #FFD700 30%, #FF8C00 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Huyền thoại Game Store
      </Typography>
      
      <Tabs 
        value={tab} 
        onChange={(e, v) => setTab(v)} 
        centered 
        sx={{ mt: 3, '& .MuiTab-root': { fontWeight: 'bold', fontSize: '1rem' } }}
      >
        <Tab label="Toàn hệ thống" value="all" />
        <Tab label="Bạn bè" value="friends" disabled={!user} />
        <Tab label="Cá nhân" value="personal" disabled={!user} />
      </Tabs>

      <TableContainer component={Paper} elevation={6} sx={{ mt: 4, borderRadius: 6, overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Hạng</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Người chơi</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Tổng điểm</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <CircularProgress sx={{ my: 4 }} />
                </TableCell>
              </TableRow>
            ) : ranking.map((row, index) => (
              <TableRow 
                key={index} 
                sx={{ 
                  bgcolor: user?.username === row.username ? 'rgba(33, 150, 243, 0.08)' : 'inherit',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }, 
                  transition: 'all 0.2s' 
                }}
              >
                <TableCell align="center">
                  {(() => {
                    const globalIndex = index + (page * rowsPerPage);
                    return globalIndex < 3 && tab === 'all' ? (
                      <MilitaryTechIcon sx={{ color: getMedalColor(globalIndex), fontSize: '2rem' }} />
                    ) : (
                      <Typography variant="h6" sx={{ color: 'text.secondary' }}>#{globalIndex + 1}</Typography>
                    );
                  })()}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={row.avatar_url} />
                    <Typography variant="h6" sx={{ fontWeight: row.username === user?.username ? 'bold' : 'normal' }}>
                      {row.username} {row.username === user?.username && "(Bạn)"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                   <Chip label={row.total_score} color="primary" sx={{ fontWeight: 'bold', fontSize: '1rem' }} />
                </TableCell>
              </TableRow>
            ))}
            {!loading && ranking.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography sx={{ py: 3 }} color="text.secondary">
                    {tab === 'friends' ? 'Kết bạn thêm để so tài cùng họ nhé!' : 'Chưa có dữ liệu nào.'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Số dòng mỗi trang:"
          sx={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
        />
      </TableContainer>
    </Box>
  );
}
