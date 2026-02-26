from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
import os
import json
import sys
import re
import openai

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
KANBAN_DIR = os.environ.get('KANBAN_DIR', os.path.join(os.path.dirname(__file__), 'kanban_data'))

app = FastAPI()

SYSTEM_PROMPT = """You are an AI assistant for a Kanban project management board. Help the user manage their tasks.

The current board state is:
{board_json}

Column IDs are fixed: backlog, todo, in_progress, review, done.

You MUST respond with a JSON object in exactly this format:
{{
  "response": "Your helpful text response to the user",
  "kanban_update": null
}}

If the user asks you to add, move, edit, or delete cards, include the full updated board in kanban_update:
{{
  "response": "I've updated your board",
  "kanban_update": {{
    "id": "<same board id>",
    "name": "<same board name>",
    "columns": [<all 5 columns with id and title>],
    "cards": [<ALL cards, including new or modified ones, each with id, columnId, title, details, position>]
  }}
}}

When creating new cards use IDs like "card-ai-1", "card-ai-2", etc.
Only include kanban_update when the user explicitly asks to change the board.
Output ONLY valid JSON with no markdown, no code fences, no extra text."""


def extract_json(text: str) -> dict:
    """Extract JSON from a response, handling markdown code blocks."""
    text = text.strip()
    # Strip markdown code fences if present
    match = re.search(r'```(?:json)?\s*([\s\S]*?)```', text)
    if match:
        text = match.group(1).strip()
    try:
        return json.loads(text)
    except Exception:
        return {"response": text}


def get_kanban_path(username):
    return os.path.join(KANBAN_DIR, f"{username}.json")


@app.post("/api/ai-kanban-structured/{username}")
async def ai_kanban_structured(username: str, request: Request):
    if not OPENAI_API_KEY:
        return {"error": "OPENAI_API_KEY not set"}
    try:
        body = await request.json()
        kanban = body.get("kanban")
        question = body.get("question")
        history = body.get("history", [])

        system_content = SYSTEM_PROMPT.format(board_json=json.dumps(kanban))
        messages = [{"role": "system", "content": system_content}]
        messages.extend(history)
        messages.append({"role": "user", "content": question})

        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            response_format={"type": "json_object"},
        )
        answer = response.choices[0].message.content
        structured = extract_json(answer)

        kanban_update = structured.get("kanban_update")
        if kanban_update:
            path = get_kanban_path(username)
            os.makedirs(KANBAN_DIR, exist_ok=True)
            with open(path, 'w') as f:
                json.dump(kanban_update, f, indent=2)

        return structured
    except Exception as e:
        return {"error": str(e)}


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
        return {"result": response.choices[0].message.content}
    except Exception as e:
        return {"error": str(e)}


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
