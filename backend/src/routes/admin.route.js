import express from 'express';
import { 
  getDashboardStats, getAllUsers, updateUserRole, updateUser, deleteUser,
  getAllGames, updateGame 
} from '../controllers/admin.controller.js';
import { protectAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Tất cả các route admin đều được bảo vệ bởi protectAdmin
router.use(protectAdmin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/games', getAllGames);
router.put('/games/:id', updateGame);

export default router;
