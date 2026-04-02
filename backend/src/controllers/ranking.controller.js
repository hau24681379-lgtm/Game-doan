import db from '../db/db.js';

export const getRanking = async (req, res) => {
  const { type, user_id, page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * limit;

  try {
    let queryBase = db('game_sessions')
      .join('users', 'game_sessions.user_id', 'users.id');

    if (type === 'friends' && user_id) {
       const friendIds = await db('friends')
         .where(function() {
           this.where('user_id', user_id).orWhere('friend_id', user_id);
         })
         .where('status', 'accepted')
         .then(friends => friends.map(f => f.user_id === parseInt(user_id) ? f.friend_id : f.user_id));
       
       friendIds.push(parseInt(user_id));
       queryBase = queryBase.whereIn('game_sessions.user_id', friendIds);
    } else if (type === 'personal' && user_id) {
       queryBase = queryBase.where('game_sessions.user_id', user_id);
    }

    // Count total for pagination
    const totalResult = await queryBase.clone().countDistinct('users.id as total').first();
    const total = parseInt(totalResult.total);

    const ranking = await queryBase
      .select('users.id', 'users.username', 'users.avatar_url')
      .sum('game_sessions.score as total_score')
      .groupBy('users.id', 'users.username', 'users.avatar_url')
      .orderBy('total_score', 'desc')
      .limit(limit)
      .offset(offset);

    res.json({
      data: ranking,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ranking', details: error.message });
  }
};

export const getPlayerProfile = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await db('users').where({ id: user_id }).first('id', 'username', 'avatar_url', 'created_at');
    const sessions = await db('game_sessions')
      .join('games', 'game_sessions.game_id', 'games.id')
      .where({ user_id })
      .select('games.name as game_name', 'game_sessions.score', 'game_sessions.updated_at');
    const totalScore = sessions.reduce((acc, s) => acc + s.score, 0);
    res.json({ ...user, sessions, totalScore });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
