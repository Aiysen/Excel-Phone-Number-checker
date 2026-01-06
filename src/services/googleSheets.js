import { GoogleSpreadsheet } from 'google-spreadsheet';
import { config } from '../config/index.js';

let cache = {
  phones: new Set(),
  lastUpdated: null,
  lastError: null
};

let refreshIntervalHandle = null;

async function loadSheetPhones() {
  const doc = new GoogleSpreadsheet(config.googleSheetId);

  await doc.useServiceAccountAuth({
    client_email: config.googleClientEmail,
    private_key: config.googlePrivateKey
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();

  const phones = new Set();

  for (const row of rows) {
    const raw = row.Phone || row.phone || row['PHONE'];
    if (!raw) continue;
    const value = String(raw).trim();
    if (!value) continue;
    phones.add(value);
  }

  return phones;
}

export async function initSheetsCache() {
  try {
    const phones = await loadSheetPhones();
    cache.phones = phones;
    cache.lastUpdated = new Date();
    cache.lastError = null;
    console.log(`Initial cache loaded, size=${phones.size}`);
  } catch (err) {
    cache.lastError = err.message || String(err);
    console.error('Failed to load initial Google Sheets cache:', err);
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
        console.log(`Cache refreshed, size=${phones.size}`);
      } catch (err) {
        cache.lastError = err.message || String(err);
        console.error('Failed to refresh Google Sheets cache:', err);
        // не падаем, оставляем старый кэш
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


