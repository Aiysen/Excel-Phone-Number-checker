import dotenv from 'dotenv';
import express from 'express';
import { createBot } from './bot/telegram.js';
import { initSheetsCache, getCacheStats } from './services/googleSheets.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  console.log('🚀 Запуск приложения...');
  
  try {
    console.log('📥 Загрузка кэша Google Sheets...');
    await initSheetsCache();
    console.log('✅ Кэш загружен');
  } catch (err) {
    console.error('❌ Ошибка загрузки кэша:', err);
  }

  console.log('🌐 Создание HTTP сервера...');
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

  console.log(`🔌 Запуск HTTP сервера на порту ${PORT}...`);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ HTTP сервер запущен на порту ${PORT}`);
  });

  console.log('🤖 Запуск Telegram бота...');
  try {
    await createBot();
    console.log('✅ Telegram бот успешно запущен');
  } catch (err) {
    console.error('⚠️ Не удалось запустить Telegram бота:', err);
    console.log('HTTP сервер продолжает работать');
  }
  
  console.log('✅ Приложение полностью запущено');
}

bootstrap().catch((err) => {
  console.error('Fatal error on startup:', err);
  process.exit(1);
});




