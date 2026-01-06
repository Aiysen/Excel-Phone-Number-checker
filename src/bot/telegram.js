import { Telegraf } from 'telegraf';
import { config } from '../config/index.js';
import { normalizePhone } from '../services/phoneValidator.js';
import { isPhoneInCache } from '../services/googleSheets.js';

let botInstance = null;

export async function createBot() {
  if (botInstance) return botInstance;

  const bot = new Telegraf(config.botToken);

  bot.start((ctx) => {
    ctx.reply(
      '👋 Привет! Я бот для проверки номера телефона.\n' +
        'Отправь мне номер телефона в любом формате, а я проверю, есть ли он в базе.\n\n' +
        'Примеры:\n' +
        '+7 900 042 33 66\n' +
        '8 900 042 33 66\n' +
        '9000423366'
    );
  });

  bot.help((ctx) => {
    ctx.reply(
      'ℹ️ Справка\n\n' +
        'Просто отправьте номер телефона текстом — я проверю его наличие в таблице.\n' +
        'Требования к номеру:\n' +
        '• Только цифры (остальные символы будут удалены автоматически)\n' +
        '• Длина 10–12 цифр\n\n' +
        'Команды:\n' +
        '/start — приветствие и краткая инструкция\n' +
        '/help — эта справка'
    );
  });

  bot.on('text', (ctx) => {
    const text = ctx.message.text || '';
    const normalized = normalizePhone(text);

    if (!normalized) {
      return ctx.reply('⚠️ Некорректный формат номера');
    }

    try {
      const found = isPhoneInCache(normalized);
      if (found) {
        return ctx.reply('✅ Номер найден');
      }
      return ctx.reply('❌ Номер не найден');
    } catch (err) {
      console.error('Error while checking phone in cache:', err);
      return ctx.reply('🔴 Сервис временно недоступен. Попробуйте позже.');
    }
  });

  // Обработка остальных типов сообщений
  bot.on('message', (ctx) => {
    ctx.reply('Отправьте, пожалуйста, номер телефона текстом.');
  });

  try {
    await bot.launch();
    console.log('✅ Telegram бот запущен');
  } catch (err) {
    console.error('❌ Ошибка запуска Telegram бота:', err);
    throw err;
  }

  // Корректное завершение при остановке процесса
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  botInstance = bot;
  return botInstance;
}


