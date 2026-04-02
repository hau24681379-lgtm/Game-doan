import React from 'react';
import { Box, Paper, Typography, Grid, Divider, List, ListItem, ListItemText, Stack, Chip, Card, CardContent } from '@mui/material';

const endpoints = [
  {
    group: 'Người dùng & Xác thực (User & Auth)',
    items: [
      { method: 'POST', url: '/users/register', desc: 'Đăng ký tài khoản mới (vai trò client)' },
      { method: 'POST', url: '/users/login', desc: 'Đăng nhập và nhận JWT Token' },
      { method: 'GET', url: '/users/:user_id/achievements', desc: 'Lấy danh sách huy chương đã đạt được' }
    ]
  },
  {
    group: 'Trò chơi (Games)',
    items: [
      { method: 'GET', url: '/games', desc: 'Lấy danh sách tất cả trò chơi đang hoạt động' },
      { method: 'GET', url: '/games/:id', desc: 'Lấy thông tin chi tiết và cấu hình của một game' }
    ]
  },
  {
    group: 'Tương tác & Lưu trữ (Interactions)',
    items: [
      { method: 'POST', url: '/interactions/sessions', desc: 'Lưu hoặc cập nhật ván game hiện tại (Save Game)' },
      { method: 'GET', url: '/interactions/sessions', desc: 'Tải lại ván game cũ của người dùng (Load Game)' },
      { method: 'POST', url: '/interactions/reviews', desc: 'Gửi đánh giá và bình luận cho trò chơi' },
      { method: 'GET', url: '/interactions/reviews/:game_id', desc: 'Lấy danh sách bình luận cộng đồng' }
    ]
  },
  {
    group: 'Mạng xã hội & Xếp hạng (Social & Ranking)',
    items: [
      { method: 'GET', url: '/ranking?page=1&limit=5', desc: 'Lấy BXH toàn hệ thống (Hỗ trợ Phân trang)' },
      { method: 'GET', url: '/social/friends/:user_id', desc: 'Lấy danh sách bạn bè (Hỗ trợ Phân trang)' },
      { method: 'POST', url: '/social/friends/request', desc: 'Gửi lời mời kết bạn' },
      { method: 'GET', url: '/social/messages/inbox/:user_id', desc: 'Lấy hộp thư đến (Hỗ trợ Phân trang)' }
    ]
  },
  {
    group: 'Quản trị (Admin)',
    items: [
      { method: 'GET', url: '/admin/users', desc: 'Quản lý danh sách người dùng hệ thống' },
      { method: 'DELETE', url: '/admin/users/:id', desc: 'Xóa hoặc gỡ tài khoản người chơi' },
      { method: 'PUT', url: '/admin/games/:id', desc: 'Cập nhật cấu hình game (Grid size, Speed...)' }
    ]
  }
];

export default function ApiDocs() {
  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h3" sx={{ fontWeight: 'black', mb: 1, color: 'primary.main' }}>
        Tài liệu API Hệ thống
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Danh sách các RESTful API được xây dựng bằng Express.js & Knex (MVC Architecture)
      </Typography>

      <Divider sx={{ mb: 5 }} />

      <Stack spacing={6}>
        {endpoints.map((group, idx) => (
          <Box key={idx}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
               <Box sx={{ width: 4, height: 24, bgcolor: 'primary.main', borderRadius: 2 }} />
               {group.group}
            </Typography>
            <Grid container spacing={2}>
              {group.items.map((api, i) => (
                <Grid item xs={12} key={i}>
                  <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: 'background.paper', '&:hover': { boxShadow: 4, transition: '0.3s' } }}>
                    <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Chip 
                          label={api.method} 
                          color={api.method === 'GET' ? 'success' : api.method === 'POST' ? 'primary' : api.method === 'DELETE' ? 'error' : 'warning'} 
                          sx={{ fontWeight: 'bold', width: 80 }} 
                        />
                        <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold', flexGrow: 1 }}>
                          {api.url}
                        </Typography>
                        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
                        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 2 }}>
                          {api.desc}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Stack>

      <Paper elevation={0} sx={{ mt: 10, p: 4, textAlign: 'center', bgcolor: 'rgba(33, 150, 243, 0.05)', borderRadius: 6 }}>
         <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>Hệ thống Web Game Board - 2026</Typography>
         <Typography variant="caption" color="text.secondary">Project môn học Lập trình ứng dụng Web</Typography>
      </Paper>
    </Box>
  );
}
