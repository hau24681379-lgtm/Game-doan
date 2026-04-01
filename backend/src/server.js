import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db/db.js';
import userRoutes from './routes/user.route.js';
import gameRoutes from './routes/game.route.js';
import interactionRoutes from './routes/interaction.route.js';
import socialRoutes from './routes/social.route.js';

import adminRoutes from './routes/admin.route.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('JWT_SECRET Loaded:', process.env.JWT_SECRET ? 'YES' : 'NO');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Health Check Route
app.get('/api/health', async (req, res) => {
  try {
    const result = await db.raw('SELECT 1+1 AS result');
    res.json({ status: 'ok', db: 'connected', result: result.rows[0].result });
  } catch (error) {
    res.status(500).json({ status: 'error', db: 'disconnected', error: error.message });
  }
});


app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
