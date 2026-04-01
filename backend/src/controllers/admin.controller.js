import db from '../db/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [uCount, gCount, sCount, rCount] = await Promise.all([
      db('users').count('id as count').first(),
      db('games').count('id as count').first(),
      db('game_sessions').count('id as count').first(),
      db('game_reviews').count('id as count').first()
    ]);

    const recentUsers = await db('users')
      .select('id', 'username', 'role', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(5);

    res.json({
      stats: {
        users: Number(uCount?.count || 0),
        games: Number(gCount?.count || 0),
        sessions: Number(sCount?.count || 0),
        reviews: Number(rCount?.count || 0)
      },
      recentUsers
    });
  } catch (error) {
    console.error('[Admin Stats Error]:', error.message);
    res.status(500).json({ error: 'Lỗi hệ thống khi nạp thống kê.' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await db('users')
      .select('id', 'username', 'role', 'created_at')
      .orderBy('id', 'asc');
    res.json(users);
  } catch (error) {
    console.error('[Admin Users Error]:', error.message);
    res.status(500).json({ error: 'Lỗi hệ thống khi nạp người dùng.' });
  }
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const targetUser = await db('users').where({ id }).first();
    if (targetUser && targetUser.role === 'admin') {
      return res.status(403).json({ error: 'Không thể thay đổi quyền của tài khoản Quản trị viên.' });
    }
    await db('users').where({ id }).update({ role });
    res.json({ message: 'Cập nhật quyền thành công.' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi cập nhật quyền.' });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  try {
    const targetUser = await db('users').where({ id }).first();
    if (targetUser && targetUser.role === 'admin') {
      return res.status(403).json({ error: 'Không thể chỉnh sửa thông tin của Quản trị viên khác.' });
    }
    await db('users').where({ id }).update({ username });
    res.json({ message: 'Cập nhật thông tin thành công.' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi cập nhật thông tin.' });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const targetUser = await db('users').where({ id }).first();
    if (targetUser && targetUser.role === 'admin') {
      return res.status(403).json({ error: 'Không thể xóa tài khoản Quản trị viên.' });
    }
    await db('users').where({ id }).del();
    res.json({ message: 'Xóa người dùng thành công.' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi xóa người dùng.' });
  }
};

export const getAllGames = async (req, res) => {
  try {
    const games = await db('games').select('*').orderBy('id', 'asc');
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi nạp trò chơi.' });
  }
};

export const updateGame = async (req, res) => {
  const { id } = req.params;
  const { name, description, is_active, config } = req.body;
  try {
    // Config can be object or string, knex handles it
    await db('games').where({ id }).update({
      name,
      description,
      is_active,
      config: typeof config === 'string' ? config : JSON.stringify(config),
      updated_at: db.fn.now()
    });
    res.json({ message: 'Cập nhật trò chơi thành công.' });
  } catch (error) {
    console.error('[Admin Update Game Error]:', error.message);
    res.status(500).json({ error: 'Lỗi khi lưu cấu hình trò chơi.' });
  }
};
