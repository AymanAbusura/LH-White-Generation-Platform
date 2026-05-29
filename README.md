# WhiteGen — AI White Page Generator

Профессиональный веб-сервис для генерации white pages с помощью Claude AI.
Очередь задач на BullMQ + Redis, backend на Node.js/Express, frontend на React/Vite.

---

## Стек

| Слой | Технология |
|------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Backend | Node.js + Express + TypeScript |
| AI | Anthropic Claude Sonnet |
| Очередь | BullMQ |
| Брокер | Redis |
| БД | SQLite (better-sqlite3) |
| Мониторинг | Bull Board |

---

## Быстрый старт

### 1. Запустить Redis

```bash
docker-compose up -d
```

### 2. Установить зависимости

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Настроить переменные окружения

```bash
cd backend
cp .env.example .env
# Открыть .env и вставить ANTHROPIC_API_KEY
```

### 4. Запустить

```bash
# Backend (порт 3001)
cd backend
npm run dev

# Frontend (порт 5173) — в другом терминале
cd frontend
npm run dev
```

Открыть: **http://localhost:5173**

---

## Что умеет

- ✅ Генерирует main page + privacy.html + terms.html
- ✅ Очередь задач с BullMQ (retry, progress, history)
- ✅ Скачать результат как ZIP-архив
- ✅ Сохранять вайты как шаблоны для повторного использования
- ✅ Фильтрация и поиск задач
- ✅ Live-мониторинг очереди
- ✅ Bull Board UI: http://localhost:3001/admin/queues

---

## Структура проекта

```
white-gen/
├── backend/
│   ├── src/
│   │   ├── db/          # SQLite база
│   │   ├── queue/       # BullMQ queue + worker
│   │   ├── routes/      # Express routes
│   │   ├── services/    # Anthropic AI service
│   │   └── index.ts     # Entry point
│   └── .env.example
├── frontend/
│   └── src/
│       ├── components/  # React компоненты
│       ├── pages/       # Страницы
│       ├── services/    # API клиент
│       ├── styles/      # CSS (глобальные стили)
│       └── types/       # TypeScript типы
├── docker-compose.yml   # Redis
└── README.md
```

---

## API Endpoints

| Method | Path | Описание |
|--------|------|----------|
| GET | /api/tasks | Список всех задач |
| POST | /api/tasks | Создать задачу |
| DELETE | /api/tasks/:id | Удалить задачу |
| GET | /api/tasks/:id/download | Скачать ZIP |
| GET | /api/tasks/:id/preview/:file | Превью файла |
| GET | /api/templates | Список шаблонов |
| POST | /api/templates/from-task/:id | Сохранить как шаблон |
| DELETE | /api/templates/:id | Удалить шаблон |
| GET | /api/queue/stats | Статистика очереди |
# LH-White-Generation-Platform
