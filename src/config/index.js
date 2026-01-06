const requiredEnv = [
  'BOT_TOKEN',
  'GOOGLE_SHEET_ID',
  'GOOGLE_CLIENT_EMAIL',
  'GOOGLE_PRIVATE_KEY'
];

function getEnv(name, fallback = undefined) {
  const value = process.env[name];
  if (value === undefined || value === null || value === '') {
    if (fallback !== undefined) return fallback;
    throw new Error(`Отсутствует обязательная переменная окружения: ${name}`);
  }
  return value;
}

export const config = {
  botToken: getEnv('BOT_TOKEN'),
  googleSheetId: getEnv('GOOGLE_SHEET_ID'),
  googleClientEmail: getEnv('GOOGLE_CLIENT_EMAIL'),
  // Railway/Heroku часто экранируют переносы строк как \n, нормализуем
  googlePrivateKey: getEnv('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n'),
  cacheTtlMinutes: Number(process.env.CACHE_TTL_MINUTES || '10')
};


