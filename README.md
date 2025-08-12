# China Lesson Bot — Детский тренажёр китайского языка

Интерактивное приложение для изучения китайского языка детьми (7+), говорящими на русском. Работает через ChatGPT, генерирует простые уроки, хранит историю, поддерживает озвучку китайских фраз.

## Возможности
- Интерактивные уроки с ботом (ChatGPT)
- Простая история уроков с возможностью продолжения
- Озвучка китайских фраз (браузерный синтез речи)
- Детский минималистичный интерфейс
- Хранение истории локально (localStorage)

## Запуск локально

1. Клонируй репозиторий:
   ```sh
   git clone https://github.com/zweyka/china_lesson_bot.git
   cd china_lesson_bot/frontend
   ```
2. Установи зависимости:
   ```sh
   npm install
   ```
3. Создай файл `.env.local` и добавь свой OpenAI API ключ:
   ```env
   OPENAI_API_KEY=sk-...your-key...
   ```
4. Запусти dev-сервер:
   ```sh
   npm run dev
   ```
5. Открой [http://localhost:3000](http://localhost:3000)

## Запуск через Docker Compose

1. В корне проекта создай файл `frontend/.env.local` с ключом OpenAI.
2. Запусти:
   ```sh
   docker compose up --build
   ```
3. Открой [http://localhost:3010](http://localhost:3010)

## Переменные окружения
- `OPENAI_API_KEY` — ключ OpenAI для доступа к ChatGPT API (обязательно)

## Структура проекта
- `frontend/` — весь исходный код Next.js приложения
- `docker-compose.yml` — запуск через Docker Compose

## Лицензия
Apache-2.0

---

[Репозиторий на GitHub](https://github.com/zweyka/china_lesson_bot)
