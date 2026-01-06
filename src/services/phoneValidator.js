// Нормализация и валидация номера телефона под формат 7900XXXXXXX

export function normalizePhone(input) {
  if (!input) return null;

  // Оставляем только цифры
  const digits = String(input).replace(/\D+/g, '');
  if (!digits) return null;

  let normalized = digits;

  // 10 цифр, предполагаем локальный формат 900XXXXXXX → добавляем 7
  if (normalized.length === 10) {
    normalized = '7' + normalized;
  }

  // 11 цифр и начинается с 8 → заменяем 8 на 7
  if (normalized.length === 11 && normalized.startsWith('8')) {
    normalized = '7' + normalized.slice(1);
  }

  // Проверка длины: 11 или 12 цифр по ТЗ, но для РФ нормализуем в 11 с префиксом 7
  if (normalized.length < 10 || normalized.length > 12) {
    return null;
  }

  // Для типичных российских номеров ожидаем 11 цифр и префикс 7
  if (normalized.length === 11 && normalized.startsWith('7')) {
    return normalized;
  }

  // Если 12 цифр или другой формат — считаем некорректным
  return null;
}

export function isValidPhone(input) {
  const normalized = normalizePhone(input);
  return normalized !== null;
}




