from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import psycopg2

app = Flask(__name__)
CORS(app)

MAX_ENTRYLENGTH = 200

#Инициализация базы данных
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres:sladkayavatka@localhost:5432/vatka_db",
)

def get_connect():
    return psycopg2.connect(DATABASE_URL)

def init_db():
    with get_connect() as connect:
        with connect.cursor() as cur:
            cur.execute(f"""
                CREATE TABLE IF NOT EXISTS entries (
                    id SERIAL PRIMARY KEY,
                    entry VARCHAR ({MAX_ENTRYLENGTH}) NOT NULL
                ); """)

#Получение записей из БД
@app.get("/api/items")
def get_items():
    with get_connect() as connect:
        with connect.cursor() as cur:
            cur.execute("SELECT * FROM entries ORDER BY id;")
            rows = cur.fetchall()
    return jsonify([
        {"id": row[0], "title": row[1]}
        for row in rows
    ])

#Добавление записи в БД
@app.post("/api/items")
def create_item():
    data = request.get_json(silent=True) or {}
    entry = str(data.get("title", "")).strip()

    if not entry:
        return jsonify({"error": "title is required"}), 400
    if len(entry) > 200:
        entry = entry[:200]

    with get_connect() as connect:
        with connect.cursor() as cur:
            cur.execute(
                "INSERT INTO entries (entry) VALUES (%s) RETURNING id, entry;",
                (entry,),
            )
            row = cur.fetchone()
    return jsonify({"id": row[0], "title": row[1]}), 201


if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5000)
