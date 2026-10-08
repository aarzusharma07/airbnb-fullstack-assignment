FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Initialize and seed database
RUN python -c "from app.database import engine, Base, get_db; from app.seed_data import seed_database; Base.metadata.create_all(bind=engine); db = next(get_db()); seed_database(db); db.close()"

ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]