from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
import os
import json
import sys

import openai

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

app = FastAPI()

@app.get("/", response_class=HTMLResponse)
def hello_world():
    frontend_path = os.path.join(os.path.dirname(__file__), '../frontend/index.html')
    if not os.path.exists(frontend_path):
        frontend_path = '/app/frontend/index.html'
    return FileResponse(frontend_path, media_type='text/html')

@app.get("/api/test")
def api_test():
    return {"message": "API call successful"}

@app.get("/api/ai-test")
def ai_test():
    if not OPENAI_API_KEY:
        return {"error": "OPENAI_API_KEY not set"}
    try:
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "What is 2+2?"}]
        )
        answer = response.choices[0].message.content
        return {"result": answer}
    except Exception as e:
        return {"error": str(e)}

KANBAN_DIR = '/app/kanban_data'

def get_kanban_path(username):
    return os.path.join(KANBAN_DIR, f"{username}.json")

@app.get("/api/kanban/{username}")
def get_kanban(username: str):
    path = get_kanban_path(username)
    sys.stderr.write(f"KANBAN_DIR: {KANBAN_DIR}\n")
    sys.stderr.write(f"Checking for file: {path}\n")
    if not os.path.exists(path):
        sys.stderr.write("File not found, creating default Kanban board...\n")
        os.makedirs(KANBAN_DIR, exist_ok=True)
        default_board = {
            "user": username,
            "columns": [
                {"id": "todo", "title": "To Do", "cards": ["Task 1", "Task 2"]},
                {"id": "inprogress", "title": "In Progress", "cards": ["Task 3"]},
                {"id": "done", "title": "Done", "cards": ["Task 4"]}
            ]
        }
        try:
            with open(path, 'w') as f:
                json.dump(default_board, f, indent=2)
            sys.stderr.write("Default Kanban board created successfully.\n")
        except Exception as e:
            sys.stderr.write(f"Error creating Kanban board: {e}\n")
        return JSONResponse(content=default_board)
    with open(path, 'r') as f:
        data = json.load(f)
    return JSONResponse(content=data)

@app.post("/api/kanban/{username}")
def save_kanban(username: str, kanban: dict):
    path = get_kanban_path(username)
    os.makedirs(KANBAN_DIR, exist_ok=True)
    with open(path, 'w') as f:
        json.dump(kanban, f, indent=2)
    return {"status": "saved"}

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
