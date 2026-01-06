import { config } from '../config/index.js';

let cache = {
  phones: new Set(),
  lastUpdated: null,
  lastError: null
};

let refreshIntervalHandle = null;

async function loadSheetPhones() {
  const csvUrl = `https://docs.google.com/spreadsheets/d/${config.googleSheetId}/export?format=csv&gid=0`;
  
  const response = await fetch(csvUrl);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const csvText = await response.text();
  const lines = csvText.split('\n');
  
  const phones = new Set();
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const columns = line.split(',');
    const phoneValue = columns[0]?.trim();
    if (phoneValue && phoneValue.toLowerCase() !== 'phone') {
      phones.add(phoneValue);
    }
  }
  
  return phones;
}

export async function initSheetsCache() {
  console.log('Инициализация кэша Google Sheets (публичный доступ)...');
  
  try {
    const phones = await loadSheetPhones();
    cache.phones = phones;
    cache.lastUpdated = new Date();
    cache.lastError = null;
    console.log(`✅ Кэш Google Sheets загружен, размер=${phones.size}`);
  } catch (err) {
    cache.lastError = err.message || String(err);
    console.error('Ошибка загрузки кэша Google Sheets:', err);
  }

  const intervalMs = config.cacheTtlMinutes * 60 * 1000;
  if (intervalMs > 0) {
    if (refreshIntervalHandle) clearInterval(refreshIntervalHandle);
    refreshIntervalHandle = setInterval(async () => {
      try {
        const phones = await loadSheetPhones();
        cache.phones = phones;
        cache.lastUpdated = new Date();
        cache.lastError = null;
        console.log(`Кэш обновлён, размер=${phones.size}`);
      } catch (err) {
        cache.lastError = err.message || String(err);
        console.error('Ошибка обновления кэша Google Sheets:', err);
      }
    }, intervalMs);
  }
}

export function isPhoneInCache(normalizedPhone) {
  return cache.phones.has(normalizedPhone);
}

export function getCacheStats() {
  return {
    size: cache.phones.size,
    lastUpdated: cache.lastUpdated,
    lastError: cache.lastError
  };
}


