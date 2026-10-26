# Сладкая ватка — запуск

## Структура

```text
project/
├── index.html
├── style.css
├── app.js
├── README.md
└── backend/
    ├── app.py
    └── requirements.txt
```

## 1. Настроить БД

Скачать PostgreSQL: https://www.postgresql.org/download/windows/

При установке установить пароль sladkayavatka (пока что захардкожен в app.py)

```bash
"C:\Program Files\PostgreSQL\[version]\bin\psql.exe" -U postgres -h localhost
```

Ввести пароль sladkayavatka

```sql
CREATE DATABASE vatka_db;
\q
```

```bash
set DATABASE_URL=postgresql://postgres:sladkayavatka@localhost:5432/vatka_db
```

## 2. Установить зависимости

Открыть терминал в папке `backend`:

```bash
cd backend
pip install -r requirements.txt
```

## 3. Запустить backend

```bash
python app.py
```

Backend запускается на `http://localhost:5000`.

Не закрывать терминал с работающим Flask.

## 4. Запустить frontend

Открыть `index.html` в браузере


## 5. Запуск через Docker Compose

Убедитесь, что установлен Docker Desktop.
В корневой папке проекта для запуска
всего стека воспользуйтесь одной командой:

```bash
docker compose up -d
```
Откройте в браузере: http://localhost:8080

Чтобы остановить стек:

```bash
docker compose down
```