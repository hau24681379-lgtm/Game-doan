import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/db.js';

export const register = async (req, res) => {
  const { username, password } = req.body;
  console.log('[Register Attempt]:', { username });
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Tên và mật khẩu không được để trống.' });
  }
  
  if (username.length < 3 || username.includes(' ')) {
    return res.status(400).json({ error: 'Tên đăng nhập phải lớn hơn 3 ký tự và không chứa khoảng trắng.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự.' });
  }

  try {
    const existingUser = await db('users').where({ username }).first();
    if (existingUser) {
      console.log('[Register Error]: Username already exists:', username);
      return res.status(400).json({ error: 'Tên đăng nhập này đã được sử dụng.' });
    }

    // Sửa lỗi lệch ID (PostgreSQL sequence sync)
    await db.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))").catch(() => {});

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('[Register]: Hashing password... Success.');

    const [newUser] = await db('users').insert({
      username,
      password: hashedPassword,
      role: 'client'
    }).returning(['id', 'username', 'role']);

    console.log('[Register Success]: New user created:', newUser);
    res.status(201).json({ message: 'Đăng ký thành công.', user: newUser });
  } catch (error) {
    console.error('[Register System Error]:', error);
    res.status(500).json({ error: 'Lỗi hệ thống khi đăng ký.', details: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(`Đang thử đăng nhập cho user: ${username}`);

  try {
    const user = await db('users').where({ username }).first();
    if (!user) {
      console.log(`User ${username} không tồn tại trong DB.`);
      return res.status(401).json({ error: 'Tài khoản không tồn tại' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Kết quả so khớp mật khẩu cho ${username}: ${isMatch}`);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Mật khẩu không chính xác' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'supersecret_jwt_key_here',
      { expiresIn: '1d' }
    );

    res.json({ message: 'Đăng nhập thành công', token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Lỗi login:', error);
    res.status(500).json({ error: 'Lỗi máy chủ khi đăng nhập', details: error.message });
  }
};
