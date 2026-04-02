import db from '../db/db.js';
import { checkAndAward } from './achievement.controller.js';

export const saveSession = async (req, res) => {
  const { user_id, game_id, score, game_state, seconds_left } = req.body;
  try {
    // Check if session exists to update or insert new
    const existing = await db('game_sessions').where({ user_id, game_id }).first();
    if (existing) {
      await db('game_sessions').where({ id: existing.id }).update({
        score, game_state: JSON.stringify(game_state), seconds_left, updated_at: db.fn.now()
      });
    } else {
      await db('game_sessions').insert({
        user_id, game_id, score, game_state: JSON.stringify(game_state), seconds_left
      });
    }

    // --- AUTO ACHIEVEMENT CHECK ---
    // Check by score
    await checkAndAward(user_id, 'score', score);
    
    // Check by game participation
    const count = await db('game_sessions').where({ user_id }).count('id as val').first();
    await checkAndAward(user_id, 'game_count', parseInt(count.val));

    res.json({ message: 'Session saved and achievements checked' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save session', details: error.message });
  }
};

export const loadSession = async (req, res) => {
  const { user_id, game_id } = req.query;
  try {
    const session = await db('game_sessions').where({ user_id, game_id }).first();
    if (!session) return res.status(404).json({ error: 'No saved session found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load session', details: error.message });
  }
};

export const submitReview = async (req, res) => {
  const { user_id, game_id, rating, comment } = req.body;
  try {
    const [id] = await db('game_reviews').insert({ user_id, game_id, rating, comment }).returning('id');
    res.status(201).json({ message: 'Review submitted', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit review', details: error.message });
  }
};

export const getGameReviews = async (req, res) => {
  const { game_id } = req.params;
  try {
    const reviews = await db('game_reviews')
      .join('users', 'game_reviews.user_id', 'users.id')
      .where({ game_id })
      .select('game_reviews.*', 'users.username')
      .orderBy('created_at', 'desc');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews', details: error.message });
  }
};
