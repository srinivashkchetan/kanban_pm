FROM python:3.12-slim
WORKDIR /app
COPY backend/main.py ./backend/main.py
COPY frontend ./frontend
RUN pip install fastapi uvicorn openai
EXPOSE 8000
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
