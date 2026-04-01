import express from 'express';
import { 
  sendFriendRequest, respondToRequest, getFriendsList, getReceivedRequests,
  sendMessage, getInbox, searchUsers 
} from '../controllers/social.controller.js';
import { getRanking, getPlayerProfile } from '../controllers/ranking.controller.js';

const router = express.Router();

// Friends
router.get('/users/search', searchUsers);
router.post('/friends/request', sendFriendRequest);
router.post('/friends/respond', respondToRequest);
router.get('/friends/:user_id', getFriendsList);
router.get('/friends/received/:user_id', getReceivedRequests);

// Messages
router.post('/messages/send', sendMessage);
router.get('/messages/inbox/:user_id', getInbox);

// Ranking & Profile
router.get('/ranking', getRanking);
router.get('/profile/:user_id', getPlayerProfile);

export default router;
