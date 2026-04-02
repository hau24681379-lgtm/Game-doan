import express from 'express';
import { register, login } from '../controllers/user.controller.js';
import { getUserAchievements } from '../controllers/achievement.controller.js';
import { protectAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/:user_id/achievements', getUserAchievements);

export default router;
