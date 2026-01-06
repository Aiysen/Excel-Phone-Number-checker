import dotenv from 'dotenv';
import express from 'express';
import { createBot } from './bot/telegram.js';
import { initSheetsCache, getCacheStats } from './services/googleSheets.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  await initSheetsCache();
  await createBot();

  const app = express();

  app.get('/health', (req, res) => {
    const stats = getCacheStats();
    res.json({
      status: 'ok',
      cache: stats
    });
  });

  app.get('/', (req, res) => {
    res.send('Telegram phone checker bot is running');
  });

  app.listen(PORT, () => {
    console.log(`HTTP server listening on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal error on startup:', err);
  process.exit(1);
});




