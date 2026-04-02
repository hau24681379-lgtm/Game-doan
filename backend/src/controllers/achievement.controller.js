import db from '../db/db.js';

export const getUserAchievements = async (req, res) => {
  const { user_id } = req.params;
  try {
    const list = await db('user_achievements')
      .join('achievements', 'user_achievements.achievement_id', 'achievements.id')
      .where({ 'user_achievements.user_id': user_id })
      .select('achievements.*', 'user_achievements.earned_at');
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch achievements', details: e.message });
  }
};

export const checkAndAward = async (user_id, category, value) => {
  try {
    // Find achievements in this category that the user hasn't earned yet
    const potential = await db('achievements')
      .where({ category })
      .where('threshold', '<=', value)
      .whereNotIn('id', function() {
        this.select('achievement_id').from('user_achievements').where({ user_id });
      });

    for (const ach of potential) {
      await db('user_achievements').insert({
        user_id,
        achievement_id: ach.id
      }).catch(err => console.log('Achievement already earned or error:', err.message));
    }
  } catch (e) {
    console.error('Error auto-awarding achievement:', e);
  }
};
