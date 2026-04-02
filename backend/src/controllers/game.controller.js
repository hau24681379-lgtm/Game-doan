import db from '../db/db.js';

export const getAllGames = async (req, res) => {
  try {
    const games = await db('games').where({ is_active: true }).orderBy('id', 'asc');
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games', details: error.message });
  }
};

export const getGameBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const game = await db('games').where({ slug, is_active: true }).first();
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game', details: error.message });
  }
};
