import express from 'express';
import { getAllGames, getGameBySlug } from '../controllers/game.controller.js';

const router = express.Router();

router.get('/', getAllGames);
router.get('/:slug', getGameBySlug);

export default router;
