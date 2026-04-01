import jwt from 'jsonwebtoken';

/**
 * Middleware: protectAdmin
 * 1. Checks Header: Authorization Bearer
 * 2. Verifies JWT Token
 * 3. Checks Role === 'admin'
 */
export const protectAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('[Auth Error]: No Auth Header or Bearer token');
    return res.status(401).json({ error: 'Không tìm thấy Token. Vui lòng đăng nhập.' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const secret = process.env.JWT_SECRET || 'supersecret_jwt_key_here'; // Hardcoded fallback for stability
    const decoded = jwt.verify(token, secret);
    
    if (decoded.role !== 'admin') {
      console.warn(`[Forbidden]: User: ${decoded.username} tried to access Admin. Role: ${decoded.role}`);
      return res.status(403).json({ error: 'Bạn không có quyền quản trị.' });
    }

    req.user = decoded;
    console.log(`[Admin Access]: ${decoded.username} authenticated successfully.`);
    next();
  } catch (error) {
    console.error('[Auth Error]: JWT Verification failed:', error.message);
    return res.status(401).json({ error: 'Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.' });
  }
};
