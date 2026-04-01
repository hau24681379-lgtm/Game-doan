import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/db.js';

export const register = async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const existingUser = await db('users').where({ username }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await db('users').insert({
      username,
      password: hashedPassword,
      role: 'client'
    }).returning(['id', 'username', 'role']);

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
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
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({ message: 'Đăng nhập thành công', token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Lỗi login:', error);
    res.status(500).json({ error: 'Lỗi máy chủ khi đăng nhập', details: error.message });
  }
};
