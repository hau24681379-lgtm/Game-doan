import express from 'express';
import { saveSession, loadSession, submitReview, getGameReviews } from '../controllers/interaction.controller.js';

const router = express.Router();

router.post('/sessions', saveSession);
router.get('/sessions', loadSession);
router.post('/reviews', submitReview);
router.get('/reviews/:game_id', getGameReviews);

export default router;
