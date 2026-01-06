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
  cacheTtlMinutes: Number(process.env.CACHE_TTL_MINUTES || '10')
};


