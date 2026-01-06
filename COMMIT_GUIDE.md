# Руководство по коммитам

## Проблема с кодировкой

В Windows PowerShell русский текст в сообщениях коммитов может отображаться неправильно из-за проблем с кодировкой.

## Решение

### Вариант 1: Использовать английский язык (рекомендуется)

Стандартная практика в разработке - использовать английский язык для коммитов:

```bash
git commit -m "Fix: start HTTP server before bot"
git commit -m "Add logging for bot and server startup"
git commit -m "Simplify: public access only"
```

### Вариант 2: Использовать файл для сообщения коммита

Создайте файл с сообщением в UTF-8:

```bash
# Создать файл commit_msg.txt с текстом в UTF-8
git commit -F commit_msg.txt
```

### Вариант 3: Использовать PowerShell скрипт

Используйте скрипт `git-commit.ps1`:

```powershell
.\git-commit.ps1 "Ваше сообщение на русском"
```

## Настройки git

Следующие настройки уже применены:

```bash
git config --global core.quotepath false
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8
```

## Рекомендации

1. **Используйте английский язык** для сообщений коммитов (стандартная практика)
2. Если нужен русский - используйте файл или скрипт
3. Используйте понятные сообщения в формате: `type: description`

Примеры типов:
- `fix:` - исправление бага
- `feat:` - новая функция
- `refactor:` - рефакторинг
- `docs:` - документация
- `style:` - форматирование
- `test:` - тесты
- `chore:` - рутинные задачи

