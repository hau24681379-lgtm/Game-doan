import jwt from 'jsonwebtoken';

export const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: 'Access Denied: Invalid or Missing API Key' });
  }
  next();
};

export const protectAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Không tìm thấy Token xác thực' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') {
      console.warn(`[Admin Access Denied] User: ${decoded.username}, Role: ${decoded.role}`);
      return res.status(403).json({ error: 'Bạn không có quyền truy cập chức năng này. Vui lòng đăng xuất và đăng nhập lại.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};
