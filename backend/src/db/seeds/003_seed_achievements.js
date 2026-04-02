export const seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('user_achievements').del();
  await knex('achievements').del();
  
  await knex('achievements').insert([
    { 
      id: 1, 
      name: 'Chiến Thần Snake', 
      description: 'Đạt trên 100 điểm trong trò chơi Rắn săn mồi', 
      threshold: 100, 
      category: 'score',
      icon_url: 'https://api.dicebear.com/7.x/icons/svg?seed=snake&icon=emoji-smile'
    },
    { 
      id: 2, 
      name: 'Bậc Thầy Caro', 
      description: 'Tham gia đấu trường trí tuệ Caro', 
      threshold: 1, 
      category: 'game_count',
      icon_url: 'https://api.dicebear.com/7.x/icons/svg?seed=caro&icon=trophy'
    },
    { 
      id: 3, 
      name: 'Thánh Ghép Hình', 
      description: 'Đạt trên 500 điểm trong Match-3', 
      threshold: 500, 
      category: 'score',
      icon_url: 'https://api.dicebear.com/7.x/icons/svg?seed=match3&icon=star'
    },
    { 
      id: 4, 
      name: 'Người Bạn Quốc Dân', 
      description: 'Kết bạn với ít nhất 3 người chơi khác', 
      threshold: 3, 
      category: 'social',
      icon_url: 'https://api.dicebear.com/7.x/icons/svg?seed=social&icon=people'
    }
  ]);
};
