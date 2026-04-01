export const seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('games').del();
  
  await knex('games').insert([
    { 
      id: 1, name: 'Caro Hàng 5', slug: 'caro-5', 
      description: 'Luật chơi Caro 5 ô thắng liên tiếp.', 
      icon_color: '#f44336', position_x: 4, position_y: 3 
    },
    { 
      id: 2, name: 'Caro Hàng 4', slug: 'caro-4', 
      description: 'Luật chơi Caro 4 ô thắng liên tiếp.', 
      icon_color: '#e91e63', position_x: 6, position_y: 3 
    },
    { 
      id: 3, name: 'Tic-Tac-Toe', slug: 'tic-tac-toe', 
      description: 'Trò chơi 3x3 truyền thống.', 
      icon_color: '#9c27b0', position_x: 3, position_y: 4 
    },
    { 
      id: 4, name: 'Rắn Săn Mồi', slug: 'snake', 
      description: 'Điều khiển rắn ăn mồi và tránh đâm vào tường.', 
      icon_color: '#4caf50', position_x: 5, position_y: 4 
    },
    { 
      id: 5, name: 'Match 3', slug: 'match-3', 
      description: 'Tương tự Candy Crush, ghép 3 ô cùng loại.', 
      icon_color: '#ff9800', position_x: 7, position_y: 4 
    },
    { 
      id: 6, name: 'Cờ Trí Nhớ', slug: 'memory', 
      description: 'Tìm các cặp hình giống nhau.', 
      icon_color: '#2196f3', position_x: 4, position_y: 5 
    },
    { 
      id: 7, name: 'Bảng Vẽ Tự Do', slug: 'draw', 
      description: 'Sáng tạo với bảng vẽ tự do.', 
      icon_color: '#00bcd4', position_x: 6, position_y: 5 
    }
  ]);
};
