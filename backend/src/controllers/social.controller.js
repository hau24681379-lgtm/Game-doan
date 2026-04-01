import db from '../db/db.js';

// --- FRIENDS ---
export const sendFriendRequest = async (req, res) => {
  const { user_id, friend_id } = req.body;
  if (user_id === friend_id) return res.status(400).json({ error: 'Cannot add yourself' });
  
  try {
    const existing = await db('friends')
      .where(function() {
        this.where({ user_id, friend_id }).orWhere({ user_id: friend_id, friend_id: user_id });
      }).first();
      
    if (existing) return res.status(400).json({ error: 'Relationship already exists' });

    const [id] = await db('friends').insert({ user_id, friend_id, status: 'pending' }).returning('id');
    res.status(201).json({ message: 'Request sent', id });
  } catch (e) {
    res.status(500).json({ error: 'Failed to send request', details: e.message });
  }
};

export const getReceivedRequests = async (req, res) => {
  const { user_id } = req.params;
  try {
    const requests = await db('friends')
      .join('users', 'friends.user_id', 'users.id')
      .where({ friend_id: user_id, status: 'pending' })
      .select('friends.id', 'users.username', 'users.avatar_url', 'friends.created_at');
    res.json(requests);
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
};

export const respondToRequest = async (req, res) => {
  const { id, status } = req.body; // status: 'accepted' or 'rejected'
  try {
    await db('friends').where({ id }).update({ status, updated_at: db.fn.now() });
    res.json({ message: `Request ${status}` });
  } catch (e) {
    res.status(500).json({ error: 'Failed to respond', details: e.message });
  }
};

export const getFriendsList = async (req, res) => {
  const { user_id } = req.params;
  try {
    const list = await db('friends')
      .join('users', function() {
        this.on('friends.friend_id', '=', 'users.id').orOn('friends.user_id', '=', 'users.id');
      })
      .where(function() {
        this.where('friends.user_id', user_id).orWhere('friends.friend_id', user_id);
      })
      .whereNot('users.id', user_id)
      .where('friends.status', 'accepted')
      .select('users.id', 'users.username', 'users.avatar_url', 'friends.id as relationship_id');
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch friends', details: e.message });
  }
};

// --- MESSAGES ---
export const sendMessage = async (req, res) => {
  const { sender_id, receiver_id, content } = req.body;
  try {
    const [id] = await db('messages').insert({ sender_id, receiver_id, content }).returning('id');
    res.status(201).json({ message: 'Message sent', id });
  } catch (e) {
    res.status(500).json({ error: 'Failed to send message', details: e.message });
  }
};

export const getInbox = async (req, res) => {
  const { user_id } = req.params;
  try {
    const msgs = await db('messages')
      .join('users', 'messages.sender_id', 'users.id')
      .where({ receiver_id: user_id })
      .select('messages.*', 'users.username as sender_name', 'users.avatar_url as sender_avatar')
      .orderBy('messages.created_at', 'desc');
    res.json(msgs);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch inbox', details: e.message });
  }
};

export const searchUsers = async (req, res) => {
  const { q } = req.query;
  try {
    const users = await db('users')
      .where('username', 'ilike', `%${q}%`)
      .select('id', 'username', 'avatar_url')
      .limit(10);
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: 'Search failed' });
  }
};
